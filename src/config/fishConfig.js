import { GROWTH_STAGES, SPECIES } from './constants.js';

export const PROVISIONAL_FISH_VALUES = Object.freeze({
  BASE_WEIGHT_BY_STAGE: Object.freeze({
    [GROWTH_STAGES.LARV]: 1,
    [GROWTH_STAGES.JUVENILE]: null,
    [GROWTH_STAGES.ADULT]: null,
    [GROWTH_STAGES.OLD]: null,
  }),
  HABITUAL_SPEED: Object.freeze({
    [SPECIES.MOJARRITA]: 62,
    [SPECIES.SURUBI]: 46,
    [SPECIES.DIENTUDO]: 54,
  }),
  DIRECTION_CHANGE_INTERVAL: Object.freeze({
    [SPECIES.MOJARRITA]: 1800,
    [SPECIES.SURUBI]: 2400,
    [SPECIES.DIENTUDO]: 2100,
  }),
});

function createSpeciesConfig(species) {
  return {
    habitualSpeed: PROVISIONAL_FISH_VALUES.HABITUAL_SPEED[species],
    directionChangeInterval: PROVISIONAL_FISH_VALUES.DIRECTION_CHANGE_INTERVAL[species],
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
  [SPECIES.MOJARRITA]: createSpeciesConfig(SPECIES.MOJARRITA),
  [SPECIES.SURUBI]: createSpeciesConfig(SPECIES.SURUBI),
  [SPECIES.DIENTUDO]: createSpeciesConfig(SPECIES.DIENTUDO),
});

export const FISH_DERIVATION = Object.freeze({
  scaledValue: (value, scale) => (value === null ? null : value * scale),
  habitualSpeed: (value, scale) => (value === null ? null : value / scale),
  boostedSpeed: (habitualSpeed, speedMultiplier, scale) => (
    habitualSpeed === null || speedMultiplier === null
      ? null
      : (habitualSpeed * speedMultiplier) / scale
  ),
});

export function deriveFishStats(species, scale, growthStage) {
  const config = FISH_CONFIG[species];
  if (!config) {
    return null;
  }

  return {
    habitualSpeed: FISH_DERIVATION.habitualSpeed(config.habitualSpeed, scale),
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
