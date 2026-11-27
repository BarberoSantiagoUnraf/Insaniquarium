import { BEHAVIOR_STATES } from './behaviorStates.js';
import { VISION_CATEGORIES } from './visionTypes.js';
import { PROVISIONAL_FISH_VALUES, canConsumeFish } from '../config/fishConfig.js';

function isValidNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function isPositiveNumber(value) {
  return isValidNumber(value) && value > 0;
}

function getEvasionChance(instinct) {
  const mapping = PROVISIONAL_FISH_VALUES.EVASION_INSTINCT_CHANCE;
  if (typeof mapping === 'function') {
    return mapping(instinct);
  }
  if (mapping && typeof mapping === 'object' && mapping[instinct] !== undefined) {
    return mapping[instinct];
  }
  // Regla pendiente de definición: sin regla acordada, no se bloquea la activación.
  // Se reporta en informe como decisión provisional pendiente.
  return 1;
}

function shouldTriggerEvasion(fish) {
  const chance = getEvasionChance(fish.persistent.instinct);
  if (chance <= 0) return false;
  if (chance >= 1) return true;
  return Math.random() < chance;
}

function getVisibleThreat(fish) {
  const contacts = fish.transient.vision?.contacts;
  if (!contacts) return null;
  let selected = null;
  for (const contact of contacts.values()) {
    if (!contact.visible || contact.category !== VISION_CATEGORIES.THREAT) continue;
    if (!selected || contact.distance < selected.distance) {
      selected = contact;
    }
  }
  return selected;
}

function getFoodTarget(fish) {
  const contacts = fish.transient.vision?.contacts;
  if (!contacts) return null;
  let selected = null;
  for (const contact of contacts.values()) {
    if (contact.type !== 'food' || contact.category !== VISION_CATEGORIES.FOOD) continue;
    if (contact.consumable !== true) continue;
    const distance = contact.distance ?? Infinity;
    if (!selected || distance < selected.distance) {
      selected = contact;
    }
  }
  return selected;
}

function getPreyTarget(fish, allFishes) {
  const contacts = fish.transient.vision?.contacts;
  if (!contacts) return null;
  let selected = null;
  for (const contact of contacts.values()) {
    if (contact.type !== 'fish' || contact.category !== VISION_CATEGORIES.PREY) continue;
    if (!contact.visible) continue;
    const targetFish = allFishes.find((candidate) => candidate.persistent.id === contact.id);
    if (!targetFish) continue;
    if (!canConsumeFish(fish, targetFish)) continue;
    const distance = contact.distance ?? Infinity;
    if (!selected || distance < selected.distance) {
      selected = contact;
    }
  }
  return selected;
}

export default class FishAIController {
  constructor({ movementController, hungerSystem, feedingSystem } = {}) {
    this.movementController = movementController;
    this.hungerSystem = hungerSystem;
    this.feedingSystem = feedingSystem;
  }

  update(delta, bounds, { foods = [], fishes = [] } = {}) {
    if (!this.movementController) {
      return;
    }

    for (const entry of this.movementController.entries.values()) {
      const fish = entry.fish;
      this.updateEvasionState(entry, delta);

      this.updateBehaviorState(fish, fishes);
      if (this.hungerSystem) {
        this.hungerSystem.update(fish, delta, {
          isSeekingFood: fish.transient.behaviorState === BEHAVIOR_STATES.SEEK_FOOD
            || fish.transient.behaviorState === BEHAVIOR_STATES.APPROACH_PREY,
        });
      } else {
        fish.transient.isHungry = false;
        fish.transient.isSeekingFood = false;
      }

      const state = fish.transient.behaviorState;
      if (state === BEHAVIOR_STATES.EVADE) {
        this.movementController.updateEvade(entry, delta);
        continue;
      }

      if (state === BEHAVIOR_STATES.APPROACH_PREY) {
        const targetPosition = this.getApproachPreyTargetPosition(fish, fishes);
        if (!targetPosition || !this.canApproachPrey(fish)) {
          this.clearPreyTarget(fish);
          fish.transient.behaviorState = this.canSeekFood(fish) ? BEHAVIOR_STATES.SEEK_FOOD : BEHAVIOR_STATES.ROAM;
          fish.transient.isSeekingFood = fish.transient.behaviorState === BEHAVIOR_STATES.SEEK_FOOD;
          if (fish.transient.behaviorState === BEHAVIOR_STATES.ROAM) {
            this.movementController.updateRoam(entry, delta);
          } else {
            this.movementController.updateSeekFood(entry, delta, this.getSeekFoodTargetPosition(fish));
          }
          continue;
        }
        this.movementController.updateApproachPrey(entry, delta, targetPosition);
        continue;
      }

      if (state === BEHAVIOR_STATES.SEEK_FOOD) {
        const targetPosition = this.getSeekFoodTargetPosition(fish);
        this.movementController.updateSeekFood(entry, delta, targetPosition);
        this.tryConsumeFood(fish, foods);
        if (fish.transient.behaviorState === BEHAVIOR_STATES.SEEK_FOOD && !this.canSeekFood(fish)) {
          this.clearFeedingTarget(fish);
          fish.transient.isSeekingFood = false;
          fish.transient.behaviorState = BEHAVIOR_STATES.ROAM;
        }
        continue;
      }

      if (state === BEHAVIOR_STATES.ROAM) {
        this.movementController.updateRoam(entry, delta);
      }
    }
  }

  updateBehaviorState(fish, fishes) {
    const state = fish.transient.behaviorState;
    const protectedStates = new Set([
      BEHAVIOR_STATES.EVADE,
      BEHAVIOR_STATES.SURRENDER,
      BEHAVIOR_STATES.COMFORT,
      BEHAVIOR_STATES.CHARGE,
      BEHAVIOR_STATES.CHASE,
    ]);

    if (protectedStates.has(state)) {
      return;
    }

    if (state === BEHAVIOR_STATES.APPROACH_PREY) {
      if (this.canApproachPrey(fish) && this.hasValidPreyTarget(fish, fishes)) {
        fish.transient.isSeekingFood = true;
        return;
      }
      this.clearPreyTarget(fish);
    }

    if (this.canApproachPrey(fish) && this.hasValidPreyTarget(fish, fishes)) {
      this.clearFeedingTarget(fish);
      fish.transient.behaviorState = BEHAVIOR_STATES.APPROACH_PREY;
      fish.transient.isSeekingFood = true;
      return;
    }

    if (this.canSeekFood(fish)) {
      this.clearPreyTarget(fish);
      fish.transient.behaviorState = BEHAVIOR_STATES.SEEK_FOOD;
      fish.transient.isSeekingFood = true;
      return;
    }

    if (state === BEHAVIOR_STATES.SEEK_FOOD || state === BEHAVIOR_STATES.APPROACH_PREY) {
      this.clearFeedingTarget(fish);
      this.clearPreyTarget(fish);
      fish.transient.isSeekingFood = false;
      fish.transient.behaviorState = BEHAVIOR_STATES.ROAM;
    }
  }

  isHungerConfigured(fish) {
    const stats = fish.stats ?? {};
    return isPositiveNumber(stats.hungerMax)
      && isPositiveNumber(stats.hungerDecayInterval)
      && isValidNumber(stats.hungerSeekThreshold)
      && isPositiveNumber(stats.hungerRecoveryAmount);
  }

  canSeekFood(fish) {
    if (!this.isHungerConfigured(fish)) return false;
    const stats = fish.stats ?? {};
    if (isValidNumber(fish.transient.hunger) && fish.transient.hunger <= stats.hungerSeekThreshold) {
      return true;
    }
    return fish.transient.isHungry === true;
  }

  canApproachPrey(fish) {
    if (!this.isHungerConfigured(fish)) return false;
    const stats = fish.stats ?? {};
    if (isValidNumber(fish.transient.hunger) && fish.transient.hunger <= stats.hungerSeekThreshold) {
      return true;
    }
    return fish.transient.isHungry === true;
  }

  hasValidPreyTarget(fish, fishes) {
    return this.getApproachPreyTargetPosition(fish, fishes) !== null;
  }

  getApproachPreyTargetPosition(fish, fishes) {
    const prey = fish.transient.prey ?? (fish.transient.prey = { targetId: null, targetLastPosition: null });
    const target = getPreyTarget(fish, fishes);
    if (target) {
      prey.targetId = target.id;
      prey.targetLastPosition = { ...target.position };
      return target.position;
    }

    if (prey.targetId) {
      const remembered = fish.transient.vision?.contacts?.get(`fish:${String(prey.targetId)}`);
      if (remembered
        && remembered.category === VISION_CATEGORIES.PREY
        && remembered.recoveryTimer > 0
        && remembered.lastKnownPosition) {
        const targetFish = fishes.find((candidate) => candidate.persistent.id === prey.targetId);
        if (targetFish && canConsumeFish(fish, targetFish)) {
          prey.targetLastPosition = { ...remembered.lastKnownPosition };
          return remembered.lastKnownPosition;
        }
      }
    }

    prey.targetId = null;
    prey.targetLastPosition = null;
    return null;
  }

  clearPreyTarget(fish) {
    if (fish.transient.prey) {
      fish.transient.prey.targetId = null;
      fish.transient.prey.targetLastPosition = null;
    }
  }

  getSeekFoodTargetPosition(fish) {
    const target = getFoodTarget(fish);
    const feeding = fish.transient.feeding;
    if (target) {
      feeding.targetId = target.id;
      feeding.targetLastPosition = { ...target.position };
      return target.position;
    }

    if (feeding.targetId) {
      const remembered = fish.transient.vision?.contacts?.get(`food:${String(feeding.targetId)}`);
      if (remembered && remembered.recoveryTimer > 0 && remembered.lastKnownPosition) {
        feeding.targetLastPosition = { ...remembered.lastKnownPosition };
        return remembered.lastKnownPosition;
      }
    }

    feeding.targetId = null;
    feeding.targetLastPosition = null;
    return null;
  }

  clearFeedingTarget(fish) {
    if (fish.transient.feeding) {
      fish.transient.feeding.targetId = null;
      fish.transient.feeding.targetLastPosition = null;
    }
  }

  tryConsumeFood(fish, foods) {
    if (!this.feedingSystem || !this.hungerSystem) return;
    const result = this.feedingSystem.tryConsume(fish, foods, this.hungerSystem);
    if (result.consumed) {
      this.clearFeedingTarget(fish);
      if (fish.transient.behaviorState === BEHAVIOR_STATES.SEEK_FOOD && !this.canSeekFood(fish)) {
        fish.transient.behaviorState = BEHAVIOR_STATES.ROAM;
        fish.transient.isSeekingFood = false;
      }
    }
  }

  updateEvasionState(entry, delta) {
    const fish = entry.fish;
    const evasion = fish.transient.evasion;
    const threat = getVisibleThreat(fish);

    if (threat) {
      evasion.threatLastPosition = { ...threat.position };
      if (!evasion.active && shouldTriggerEvasion(fish)) {
        this.startEvasion(entry, threat);
      } else if (evasion.active) {
        evasion.threatId = threat.id;
      }
    }

    if (!evasion.active) {
      return;
    }

    evasion.timer += delta;
    if (evasion.boostActive) {
      evasion.boostTimer += delta;
      const boostDuration = fish.stats?.boostDuration;
      if (boostDuration !== null && evasion.boostTimer >= boostDuration) {
        evasion.boostActive = false;
        evasion.boostTimer = 0;
        evasion.boostCooldownTimer = 0;
      }
    } else if (evasion.boostCooldownTimer > 0) {
      evasion.boostCooldownTimer = Math.max(0, evasion.boostCooldownTimer - delta);
    }

    if (evasion.timer >= evasion.duration) {
      this.endEvasion(entry);
    }
  }

  startEvasion(entry, threat) {
    const fish = entry.fish;
    const evasion = fish.transient.evasion;
    const duration = fish.stats?.evadeDuration;
    if (duration === null || duration === undefined) {
      return;
    }

    fish.transient.behaviorState = BEHAVIOR_STATES.EVADE;
    evasion.active = true;
    evasion.timer = 0;
    evasion.duration = duration;
    evasion.threatId = threat.id;
    evasion.threatLastPosition = { ...threat.position };
    evasion.boostActive = this.canUseBoost(fish);
    evasion.boostTimer = 0;
    evasion.boostCooldownTimer = 0;
    this.movementController.beginEvade(entry, threat.position);
  }

  canUseBoost(fish) {
    const { boostSpeed, boostDuration, boostCooldown } = fish.stats ?? {};
    return [boostSpeed, boostDuration, boostCooldown].every(
      (value) => typeof value === 'number' && Number.isFinite(value) && value > 0,
    );
  }

  endEvasion(entry) {
    const fish = entry.fish;
    const evasion = fish.transient.evasion;
    evasion.active = false;
    evasion.timer = 0;
    evasion.duration = 0;
    evasion.threatId = null;
    evasion.threatLastPosition = null;
    evasion.boostActive = false;
    evasion.boostTimer = 0;
    evasion.boostCooldownTimer = 0;
    const fishes = [...this.movementController.entries.values()].map((item) => item.fish);
    if (this.canApproachPrey(fish) && this.hasValidPreyTarget(fish, fishes)) {
      fish.transient.behaviorState = BEHAVIOR_STATES.APPROACH_PREY;
      fish.transient.isSeekingFood = true;
    } else if (this.canSeekFood(fish)) {
      fish.transient.behaviorState = BEHAVIOR_STATES.SEEK_FOOD;
      fish.transient.isSeekingFood = true;
    } else {
      fish.transient.behaviorState = BEHAVIOR_STATES.ROAM;
      fish.transient.isSeekingFood = false;
    }
    this.movementController.endEvade(entry);
  }
}
