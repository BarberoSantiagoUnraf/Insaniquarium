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
  constructor({ movementController, hungerSystem, feedingSystem, entityManager } = {}) {
    this.movementController = movementController;
    this.hungerSystem = hungerSystem;
    this.feedingSystem = feedingSystem;
    this.entityManager = entityManager;
  }

  update(delta, bounds, { foods = [], fishes = [] } = {}) {
    if (!this.movementController) {
      return;
    }

    for (const entry of this.movementController.entries.values()) {
      const fish = entry.fish;
      this.updateEvasionState(entry, delta);

      this.updateBehaviorState(fish, fishes);
      if (fish.transient.charge?.cooldownTimer > 0) {
        fish.transient.charge.cooldownTimer = Math.max(0, fish.transient.charge.cooldownTimer - delta);
      }

      if (this.hungerSystem) {
        this.hungerSystem.update(fish, delta, {
          isSeekingFood: fish.transient.behaviorState === BEHAVIOR_STATES.SEEK_FOOD
            || fish.transient.behaviorState === BEHAVIOR_STATES.APPROACH_PREY
            || fish.transient.behaviorState === BEHAVIOR_STATES.CHASE
            || fish.transient.behaviorState === BEHAVIOR_STATES.CHARGE,
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

      if (state === BEHAVIOR_STATES.CHARGE) {
        fish.transient.charge.timer += delta;
        const targetInfo = this.getPreyTargetInfo(fish, fishes, fish.transient.charge?.targetId ?? fish.transient.prey?.targetId);
        if (!targetInfo || !this.shouldContinueCharge(fish, fishes)) {
          this.endCharge(fish, { consumed: false });
          this.resolvePostHuntState(fish, fishes, entry, delta);
          continue;
        }
        fish.transient.charge.targetId = targetInfo.id;
        fish.transient.prey.targetId = targetInfo.id;
        fish.transient.prey.targetLastPosition = { ...targetInfo.position };
        if (this.tryConsumePrey(fish, targetInfo)) {
          this.endCharge(fish, { consumed: true });
          this.resolvePostHuntState(fish, fishes, entry, delta);
          continue;
        }
        this.movementController.updateCharge(entry, delta, targetInfo.position);
        continue;
      }

      if (state === BEHAVIOR_STATES.CHASE) {
        fish.transient.chase.timer += delta;
        const targetInfo = this.getPreyTargetInfo(fish, fishes, fish.transient.chase?.targetId ?? fish.transient.prey?.targetId);
        if (!targetInfo || !this.shouldContinueChase(fish, fishes)) {
          this.clearChase(fish);
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
        fish.transient.chase.targetId = targetInfo.id;
        if (this.canStartCharge(fish, targetInfo)) {
          this.startCharge(fish, targetInfo);
          this.movementController.updateCharge(entry, delta, targetInfo.position);
          continue;
        }
        this.movementController.updateChase(entry, delta, targetInfo.position);
        continue;
      }

      if (state === BEHAVIOR_STATES.APPROACH_PREY) {
        const targetPosition = this.getApproachPreyTargetPosition(fish, fishes);
        if (!targetPosition || !this.canApproachPrey(fish)) {
          this.clearPreyTarget(fish);
          this.clearChase(fish);
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
    ]);

    if (protectedStates.has(state)) {
      return;
    }

    if (state === BEHAVIOR_STATES.CHARGE) {
      if (this.shouldContinueCharge(fish, fishes)) {
        fish.transient.isSeekingFood = true;
        return;
      }
      this.endCharge(fish, { consumed: false });
      this.setPostHuntBehaviorState(fish, fishes);
      return;
    }

    if (state === BEHAVIOR_STATES.CHASE) {
      if (this.shouldContinueChase(fish, fishes)) {
        const targetInfo = this.getPreyTargetInfo(fish, fishes, fish.transient.chase?.targetId ?? fish.transient.prey?.targetId);
        if (targetInfo && this.canStartCharge(fish, targetInfo)) {
          this.startCharge(fish, targetInfo);
          return;
        }
        fish.transient.isSeekingFood = true;
        return;
      }
      this.clearChase(fish);
      this.clearPreyTarget(fish);
      if (this.canSeekFood(fish)) {
        this.clearFeedingTarget(fish);
        fish.transient.behaviorState = BEHAVIOR_STATES.SEEK_FOOD;
        fish.transient.isSeekingFood = true;
        return;
      }
      this.clearFeedingTarget(fish);
      fish.transient.isSeekingFood = false;
      fish.transient.behaviorState = BEHAVIOR_STATES.ROAM;
      return;
    }

    if (state === BEHAVIOR_STATES.APPROACH_PREY) {
      if (this.canApproachPrey(fish) && this.hasValidPreyTarget(fish, fishes)) {
        if (this.canStartChase(fish, fishes)) {
          this.startChase(fish);
          return;
        }
        fish.transient.isSeekingFood = true;
        return;
      }
      this.clearPreyTarget(fish);
      this.clearChase(fish);
    }

    if (this.canApproachPrey(fish) && this.hasValidPreyTarget(fish, fishes)) {
      this.clearFeedingTarget(fish);
      fish.transient.behaviorState = BEHAVIOR_STATES.APPROACH_PREY;
      fish.transient.isSeekingFood = true;
      if (this.canStartChase(fish, fishes)) {
        this.startChase(fish);
      }
      return;
    }

    if (this.canSeekFood(fish)) {
      this.clearPreyTarget(fish);
      this.clearChase(fish);
      fish.transient.behaviorState = BEHAVIOR_STATES.SEEK_FOOD;
      fish.transient.isSeekingFood = true;
      return;
    }

    if (state === BEHAVIOR_STATES.SEEK_FOOD || state === BEHAVIOR_STATES.APPROACH_PREY) {
      this.clearFeedingTarget(fish);
      this.clearPreyTarget(fish);
      this.clearChase(fish);
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

  isChaseConfigured(fish) {
    const stats = fish.stats ?? {};
    return isPositiveNumber(stats.chaseSpeed)
      && isPositiveNumber(stats.chaseActivationDistance)
      && isPositiveNumber(stats.chaseMaxDuration);
  }

  canStartChase(fish, fishes) {
    if (!this.canApproachPrey(fish) || !this.isChaseConfigured(fish)) return false;
    const targetInfo = this.getPreyTargetInfo(fish, fishes);
    if (!targetInfo) return false;
    return targetInfo.distance <= fish.stats.chaseActivationDistance;
  }

  shouldContinueChase(fish, fishes) {
    if (!this.canApproachPrey(fish) || !this.isChaseConfigured(fish)) return false;
    const chase = fish.transient.chase;
    if (!chase?.active) return false;
    if (isPositiveNumber(chase.duration) && chase.timer >= chase.duration) return false;
    return this.getPreyTargetInfo(fish, fishes, chase.targetId) !== null;
  }

  startChase(fish) {
    const chase = fish.transient.chase ?? (fish.transient.chase = { active: false, timer: 0, duration: null, targetId: null });
    chase.active = true;
    chase.timer = 0;
    chase.duration = fish.stats.chaseMaxDuration;
    chase.targetId = fish.transient.prey?.targetId ?? null;
    fish.transient.behaviorState = BEHAVIOR_STATES.CHASE;
    fish.transient.isSeekingFood = true;
  }

  clearChase(fish) {
    const chase = fish.transient.chase;
    if (!chase) return;
    chase.active = false;
    chase.timer = 0;
    chase.duration = null;
    chase.targetId = null;
  }

  getPreyTargetInfo(fish, fishes, preferredId = null) {
    const contacts = fish.transient.vision?.contacts;
    if (!contacts) return null;

    const prey = fish.transient.prey ?? (fish.transient.prey = { targetId: null, targetLastPosition: null });
    const targetId = preferredId ?? prey.targetId;

    if (targetId) {
      const contact = contacts.get(`fish:${String(targetId)}`);
      const targetFish = fishes.find((candidate) => candidate.persistent.id === targetId);
      const validTarget = targetFish && canConsumeFish(fish, targetFish);

      if (validTarget && contact?.visible && contact.category === VISION_CATEGORIES.PREY) {
        const position = contact.position ?? targetFish.transient?.position;
        if (position) {
          const dx = position.x - fish.transient.position.x;
          const dy = position.y - fish.transient.position.y;
          const distance = contact.distance ?? Math.hypot(dx, dy);
          prey.targetId = targetId;
          prey.targetLastPosition = { ...position };
          return { position: { ...position }, distance, id: targetId, remembered: false, target: targetFish };
        }
      }

      if (validTarget
        && contact
        && contact.category === VISION_CATEGORIES.PREY
        && contact.recoveryTimer > 0
        && contact.lastKnownPosition) {
        prey.targetId = targetId;
        prey.targetLastPosition = { ...contact.lastKnownPosition };
        const dx = contact.lastKnownPosition.x - fish.transient.position.x;
        const dy = contact.lastKnownPosition.y - fish.transient.position.y;
        return { position: { ...contact.lastKnownPosition }, distance: Math.hypot(dx, dy), id: targetId, remembered: true, target: targetFish };
      }

      return null;
    }

    const visible = getPreyTarget(fish, fishes);
    if (!visible) return null;
    const targetFish = fishes.find((candidate) => candidate.persistent.id === visible.id) ?? null;
    prey.targetId = visible.id;
    prey.targetLastPosition = { ...visible.position };
    return { position: visible.position, distance: visible.distance ?? Infinity, id: visible.id, remembered: false, target: targetFish };
  }

  hasValidPreyTarget(fish, fishes) {
    return this.getPreyTargetInfo(fish, fishes) !== null;
  }

  getApproachPreyTargetPosition(fish, fishes) {
    const info = this.getPreyTargetInfo(fish, fishes);
    if (info) {
      return info.position;
    }
    this.clearPreyTarget(fish);
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

    if (fish.transient.charge?.active) {
      this.endCharge(fish, { consumed: false });
    }
    this.clearChase(fish);
    this.clearPreyTarget(fish);
    this.clearFeedingTarget(fish);
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
    this.clearChase(fish);
    if (this.canApproachPrey(fish) && this.hasValidPreyTarget(fish, fishes)) {
      fish.transient.behaviorState = BEHAVIOR_STATES.APPROACH_PREY;
      fish.transient.isSeekingFood = true;
      if (this.canStartChase(fish, fishes)) {
        this.startChase(fish);
      }
    } else if (this.canSeekFood(fish)) {
      fish.transient.behaviorState = BEHAVIOR_STATES.SEEK_FOOD;
      fish.transient.isSeekingFood = true;
    } else {
      fish.transient.behaviorState = BEHAVIOR_STATES.ROAM;
      fish.transient.isSeekingFood = false;
    }
    this.movementController.endEvade(entry);
  }

  isValidPreyTarget(fish, targetFish) {
    return Boolean(targetFish) && canConsumeFish(fish, targetFish);
  }

  getDistance(a, b) {
    if (!a || !b) return Infinity;
    return Math.hypot((a.x ?? 0) - (b.x ?? 0), (a.y ?? 0) - (b.y ?? 0));
  }

  canStartCharge(fish, targetInfo) {
    if (!fish || !targetInfo) return false;
    if (fish.transient.behaviorState !== BEHAVIOR_STATES.CHASE) return false;
    if (!fish.transient.isHungry) return false;
    if (!this.hungerSystem?.isConfigured(fish)) return false;
    if (!this.hasChargeConfig(fish)) return false;
    if ((fish.transient.charge?.cooldownTimer ?? 0) > 0) return false;
    if (!this.isValidPreyTarget(fish, targetInfo.target)) return false;
    const activationDistance = this.getChargeActivationDistance(fish);
    if (activationDistance === null) return false;
    const distance = this.getDistance(fish.transient.position, targetInfo.position);
    return distance <= activationDistance;
  }

  hasChargeConfig(fish) {
    const { chargeSpeed, chargeMaxDuration, chargeCooldown } = fish.stats ?? {};
    return [chargeSpeed, chargeMaxDuration, chargeCooldown].every(
      (value) => typeof value === 'number' && Number.isFinite(value) && value > 0,
    );
  }

  getChargeActivationDistance(fish) {
    const visionRange = fish.stats?.visionRange;
    if (typeof visionRange !== 'number' || !Number.isFinite(visionRange) || visionRange <= 0) {
      return null;
    }
    return visionRange / 3;
  }

  startCharge(fish, targetInfo) {
    this.clearChase(fish);
    fish.transient.behaviorState = BEHAVIOR_STATES.CHARGE;
    fish.transient.isSeekingFood = true;
    fish.transient.charge.active = true;
    fish.transient.charge.timer = 0;
    fish.transient.charge.duration = fish.stats.chargeMaxDuration;
    fish.transient.charge.targetId = targetInfo.id;
    fish.transient.prey.targetId = targetInfo.id;
    fish.transient.prey.targetLastPosition = { ...targetInfo.position };
  }

  shouldContinueCharge(fish, fishes) {
    const charge = fish.transient.charge;
    if (!charge?.active) return false;
    if (!fish.transient.isHungry) return false;
    if (!this.hungerSystem?.isConfigured(fish)) return false;
    if (!this.hasChargeConfig(fish)) return false;
    const duration = charge.duration;
    if (typeof duration === 'number' && Number.isFinite(duration) && duration > 0 && charge.timer >= duration) {
      return false;
    }
    const targetInfo = this.getPreyTargetInfo(fish, fishes, charge.targetId ?? fish.transient.prey?.targetId);
    return Boolean(targetInfo);
  }

  endCharge(fish, { consumed = false } = {}) {
    const charge = fish.transient.charge;
    if (!charge) return;
    const wasActive = charge.active || fish.transient.behaviorState === BEHAVIOR_STATES.CHARGE;
    if (!wasActive && !consumed) {
      charge.targetId = null;
      return;
    }
    charge.active = false;
    charge.timer = 0;
    charge.duration = null;
    charge.targetId = null;
    charge.cooldownTimer = this.hasChargeConfig(fish) ? fish.stats.chargeCooldown : 0;
    if (!consumed) {
      this.clearPreyTarget(fish);
    } else {
      fish.transient.prey.targetId = null;
      fish.transient.prey.targetLastPosition = null;
    }
  }

  clearCharge(fish) {
    const charge = fish.transient.charge;
    if (!charge) return;
    charge.active = false;
    charge.timer = 0;
    charge.duration = null;
    charge.targetId = null;
  }

  tryConsumePrey(fish, targetInfo) {
    if (!this.entityManager || !targetInfo?.target) return false;
    if (!this.isValidPreyTarget(fish, targetInfo.target)) return false;
    const distance = this.getDistance(fish.transient.position, targetInfo.position);
    const predatorRadius = this.getFishRadius(fish);
    const preyRadius = this.getFishRadius(targetInfo.target);
    if (predatorRadius === null || preyRadius === null) return false;
    if (distance > predatorRadius + preyRadius) return false;
    const targetId = targetInfo.target.persistent.id;
    const removed = this.entityManager.removeFish(targetId);
    if (!removed) return false;
    this.movementController.unregisterFish(targetId);
    if (this.hungerSystem?.isConfigured(fish)) {
      this.hungerSystem.recover(fish);
    }
    return true;
  }

  getFishRadius(fish) {
    const shape = fish?.references?.shape;
    if (!shape) return null;
    const width = typeof shape.displayWidth === 'number' ? shape.displayWidth : shape.width;
    const height = typeof shape.displayHeight === 'number' ? shape.displayHeight : shape.height;
    if (![width, height].every((value) => typeof value === 'number' && Number.isFinite(value) && value > 0)) {
      return null;
    }
    return Math.max(width, height) / 2;
  }

  resolvePostHuntState(fish, fishes, entry, delta) {
    this.setPostHuntBehaviorState(fish, fishes);
    const state = fish.transient.behaviorState;
    if (state === BEHAVIOR_STATES.APPROACH_PREY) {
      const target = this.getPreyTargetInfo(fish, fishes, fish.transient.prey?.targetId);
      if (target) {
        this.movementController.updateApproachPrey(entry, delta, target.position);
      } else {
        fish.transient.behaviorState = this.canSeekFood(fish) ? BEHAVIOR_STATES.SEEK_FOOD : BEHAVIOR_STATES.ROAM;
        fish.transient.isSeekingFood = fish.transient.behaviorState === BEHAVIOR_STATES.SEEK_FOOD;
        if (fish.transient.behaviorState === BEHAVIOR_STATES.ROAM) this.movementController.updateRoam(entry, delta);
        else this.movementController.updateSeekFood(entry, delta, this.getSeekFoodTargetPosition(fish));
      }
      return;
    }
    if (state === BEHAVIOR_STATES.SEEK_FOOD) {
      this.movementController.updateSeekFood(entry, delta, this.getSeekFoodTargetPosition(fish));
      return;
    }
    this.movementController.updateRoam(entry, delta);
  }

  setPostHuntBehaviorState(fish, fishes) {
    this.clearChase(fish);
    if (this.canApproachPrey(fish) && this.hasValidPreyTarget(fish, fishes)) {
      this.clearFeedingTarget(fish);
      fish.transient.behaviorState = BEHAVIOR_STATES.APPROACH_PREY;
      fish.transient.isSeekingFood = true;
      if (this.canStartChase(fish, fishes)) {
        this.startChase(fish);
      }
      return;
    }
    this.clearPreyTarget(fish);
    if (this.canSeekFood(fish)) {
      this.clearFeedingTarget(fish);
      fish.transient.behaviorState = BEHAVIOR_STATES.SEEK_FOOD;
      fish.transient.isSeekingFood = true;
      return;
    }
    this.clearFeedingTarget(fish);
    fish.transient.isSeekingFood = false;
    fish.transient.behaviorState = BEHAVIOR_STATES.ROAM;
  }
}
