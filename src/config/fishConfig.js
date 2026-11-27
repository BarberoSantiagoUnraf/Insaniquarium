import { GROWTH_STAGES, SPECIES } from '../config/constants.js';

export const PROVISIONAL_FISH_VALUES = Object.freeze({
  BASE_WEIGHT_BY_STAGE: Object.freeze({
    [GROWTH_STAGES.INFANT]: 1,
    [GROWTH_STAGES.JUVENILE]: null,
    [GROWTH_STAGES.ADULT]: null,
  }),
});

function createSpeciesConfig() {
  return {
    habitualSpeed: null,
    directionChangeInterval: null,
    visionRange: null,
    visualRecoveryTime: null,
    boost: {
      speedMultiplier: null,
      duration: null,
      cooldown: null,
    },
    evadeDuration: null,
    maxChaseDuration: null,
    comfortDuration: null,
    surrenderDuration: null,
    baseWeightByStage: { ...PROVISIONAL_FISH_VALUES.BASE_WEIGHT_BY_STAGE },
    hunger: {
      max: null,
      decayInterval: null,
    },
    survival: {
      maxDuration: null,
    },
  };
}

export const FISH_CONFIG = Object.freeze({
  [SPECIES.MOJARRITA]: createSpeciesConfig(),
  [SPECIES.SURUBI]: createSpeciesConfig(),
  [SPECIES.DIENTUDO]: createSpeciesConfig(),
});

export const FISH_DERIVATION = Object.freeze({
  scaledValue: (value, scale) => (value === null ? null : value * scale),
  boostedSpeed: (habitualSpeed, speedMultiplier, scale) => (
    habitualSpeed === null || speedMultiplier === null
      ? null
      : habitualSpeed * speedMultiplier * scale
  ),
});

export function deriveFishStats(species, scale, growthStage) {
  const config = FISH_CONFIG[species];
  if (!config) {
    return null;
  }

  return {
    effectiveWeight: FISH_DERIVATION.scaledValue(
      config.baseWeightByStage[growthStage] ?? null,
      scale,
    ),
    visionRange: FISH_DERIVATION.scaledValue(config.visionRange, scale),
    boostSpeed: FISH_DERIVATION.boostedSpeed(
      config.habitualSpeed,
      config.boost.speedMultiplier,
      scale,
    ),
    boostDuration: FISH_DERIVATION.scaledValue(config.boost.duration, scale),
    boostCooldown: FISH_DERIVATION.scaledValue(config.boost.cooldown, scale),
    evadeDuration: FISH_DERIVATION.scaledValue(config.evadeDuration, scale),
  };
}
