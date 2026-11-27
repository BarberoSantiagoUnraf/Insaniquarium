export function isValidNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isPositiveNumber(value) {
  return isValidNumber(value) && value > 0;
}

export default class HungerSystem {
  update(fish, delta, { isSeekingFood = false } = {}) {
    const stats = fish.stats ?? {};
    const hungerMax = stats.hungerMax;
    const decayInterval = stats.hungerDecayInterval;
    const seekThreshold = stats.hungerSeekThreshold;
    const survivalMax = stats.survivalMaxDuration;

    const hungerActive = isPositiveNumber(hungerMax) && isPositiveNumber(decayInterval);
    const seekActive = hungerActive && isValidNumber(seekThreshold);
    const survivalActive = seekActive && isPositiveNumber(survivalMax);

    if (!hungerActive) {
      fish.transient.hunger = null;
      fish.transient.hungerTimer = 0;
      fish.transient.survivalTimer = 0;
      fish.transient.isHungry = false;
      fish.transient.isSeekingFood = false;
      return { hungerActive: false, seekActive: false, survivalActive: false };
    }

    if (!isValidNumber(fish.transient.hunger)) {
      fish.transient.hunger = hungerMax;
    }

    fish.transient.hunger = Math.min(hungerMax, Math.max(0, fish.transient.hunger));
    fish.transient.hungerTimer += delta;
    while (fish.transient.hungerTimer >= decayInterval && fish.transient.hunger > 0) {
      fish.transient.hunger = Math.max(0, fish.transient.hunger - 1);
      fish.transient.hungerTimer -= decayInterval;
    }

    fish.transient.isHungry = seekActive ? fish.transient.hunger <= seekThreshold : false;

    const seeking = fish.transient.isHungry && isSeekingFood;
    fish.transient.isSeekingFood = seeking;
    if (survivalActive && seeking) {
      fish.transient.survivalTimer += delta;
    } else if (!survivalActive) {
      fish.transient.survivalTimer = 0;
    }

    return { hungerActive, seekActive, survivalActive };
  }

  canRecover(fish) {
    return isPositiveNumber(fish.stats?.hungerRecoveryAmount) && isPositiveNumber(fish.stats?.hungerMax);
  }

  recover(fish) {
    if (!this.canRecover(fish)) {
      return false;
    }
    const max = fish.stats.hungerMax;
    const amount = fish.stats.hungerRecoveryAmount;
    const current = isValidNumber(fish.transient.hunger) ? fish.transient.hunger : max;
    fish.transient.hunger = Math.min(max, Math.max(0, current + amount));
    return true;
  }
}
