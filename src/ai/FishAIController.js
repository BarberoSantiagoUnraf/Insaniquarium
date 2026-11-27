import { BEHAVIOR_STATES } from './behaviorStates.js';
import { VISION_CATEGORIES } from './visionTypes.js';
import { PROVISIONAL_FISH_VALUES } from '../config/fishConfig.js';

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

export default class FishAIController {
  constructor({ movementController } = {}) {
    this.movementController = movementController;
  }

  update(delta, bounds) {
    if (!this.movementController) {
      return;
    }

    for (const entry of this.movementController.entries.values()) {
      const fish = entry.fish;
      this.updateEvasionState(entry, delta);

      const state = fish.transient.behaviorState;
      if (state === BEHAVIOR_STATES.EVADE) {
        this.movementController.updateEvade(entry, delta);
        continue;
      }

      if (state === BEHAVIOR_STATES.ROAM) {
        this.movementController.updateRoam(entry, delta);
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
    fish.transient.behaviorState = BEHAVIOR_STATES.ROAM;
    this.movementController.endEvade(entry);
  }
}
