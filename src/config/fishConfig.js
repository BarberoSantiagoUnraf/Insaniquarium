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
  VISION_RANGE: Object.freeze({
    [SPECIES.MOJARRITA]: 180,
    [SPECIES.SURUBI]: 220,
    [SPECIES.DIENTUDO]: 200,
  }),
  VISUAL_RECOVERY_TIME: Object.freeze({
    [SPECIES.MOJARRITA]: 2500,
    [SPECIES.SURUBI]: 2500,
    [SPECIES.DIENTUDO]: 2500,
  }),
  // Provisional: duración base de evasión en ms. Pendiente de ajuste/balance.
  EVASION_DURATION_BASE: Object.freeze({
    [SPECIES.MOJARRITA]: 2500,
    [SPECIES.SURUBI]: 3000,
    [SPECIES.DIENTUDO]: 2800,
  }),
  // Pendiente de definición: relación Instinct (2-8) -> probabilidad de activar evasión.
  // null significa que no hay regla acordada; no se inventa fórmula.
  EVASION_INSTINCT_CHANCE: null,
});

export const GROWTH_STAGE_ORDER = Object.freeze([
  GROWTH_STAGES.LARV,
  GROWTH_STAGES.JUVENILE,
  GROWTH_STAGES.ADULT,
  GROWTH_STAGES.OLD,
]);

function upToStage(maxStage) {
  const maxIndex = GROWTH_STAGE_ORDER.indexOf(maxStage);
  return Object.freeze(GROWTH_STAGE_ORDER.slice(0, maxIndex + 1));
}

export const FISH_DIETS = Object.freeze({
  [SPECIES.MOJARRITA]: Object.freeze({
    [GROWTH_STAGES.LARV]: Object.freeze({ baseFood: true, fish: Object.freeze([]) }),
    [GROWTH_STAGES.JUVENILE]: Object.freeze({ baseFood: true, fish: Object.freeze([]) }),
    [GROWTH_STAGES.ADULT]: Object.freeze({ baseFood: true, fish: Object.freeze([]) }),
    [GROWTH_STAGES.OLD]: Object.freeze({ baseFood: true, fish: Object.freeze([]) }),
  }),
  [SPECIES.DIENTUDO]: Object.freeze({
    [GROWTH_STAGES.LARV]: Object.freeze({
      baseFood: true,
      fish: Object.freeze([{ species: SPECIES.MOJARRITA, stages: upToStage(GROWTH_STAGES.LARV) }]),
    }),
    [GROWTH_STAGES.JUVENILE]: Object.freeze({
      baseFood: true,
      fish: Object.freeze([{ species: SPECIES.MOJARRITA, stages: upToStage(GROWTH_STAGES.JUVENILE) }]),
    }),
    [GROWTH_STAGES.ADULT]: Object.freeze({
      baseFood: true,
      fish: Object.freeze([
        { species: SPECIES.MOJARRITA, stages: upToStage(GROWTH_STAGES.OLD) },
        { species: SPECIES.SURUBI, stages: upToStage(GROWTH_STAGES.LARV) },
      ]),
    }),
    [GROWTH_STAGES.OLD]: Object.freeze({
      baseFood: true,
      fish: Object.freeze([
        { species: SPECIES.MOJARRITA, stages: upToStage(GROWTH_STAGES.OLD) },
        { species: SPECIES.SURUBI, stages: upToStage(GROWTH_STAGES.JUVENILE) },
      ]),
    }),
  }),
  [SPECIES.SURUBI]: Object.freeze({
    [GROWTH_STAGES.LARV]: Object.freeze({ baseFood: true, fish: Object.freeze([]) }),
    [GROWTH_STAGES.JUVENILE]: Object.freeze({
      baseFood: false,
      fish: Object.freeze([
        { species: SPECIES.MOJARRITA, stages: upToStage(GROWTH_STAGES.LARV) },
        { species: SPECIES.DIENTUDO, stages: upToStage(GROWTH_STAGES.LARV) },
      ]),
    }),
    [GROWTH_STAGES.ADULT]: Object.freeze({
      baseFood: false,
      fish: Object.freeze([
        { species: SPECIES.MOJARRITA, stages: upToStage(GROWTH_STAGES.JUVENILE) },
        { species: SPECIES.DIENTUDO, stages: upToStage(GROWTH_STAGES.LARV) },
      ]),
    }),
    [GROWTH_STAGES.OLD]: Object.freeze({
      baseFood: false,
      fish: Object.freeze([
        { species: SPECIES.MOJARRITA, stages: upToStage(GROWTH_STAGES.OLD) },
        { species: SPECIES.DIENTUDO, stages: upToStage(GROWTH_STAGES.JUVENILE) },
      ]),
    }),
  }),
});

export function canConsumeFish(observer, target) {
  if (!observer || !target || observer.persistent.id === target.persistent.id) {
    return false;
  }

  const diet = FISH_DIETS[observer.persistent.species]?.[observer.persistent.growthStage];
  if (!diet) {
    return false;
  }

  return diet.fish.some(
    (entry) => entry.species === target.persistent.species && entry.stages.includes(target.persistent.growthStage),
  );
}

export function canConsumeBaseFood(fish) {
  const diet = FISH_DIETS[fish?.persistent?.species]?.[fish?.persistent?.growthStage];
  return Boolean(diet?.baseFood);
}

function createSpeciesConfig(species) {
  return {
    habitualSpeed: PROVISIONAL_FISH_VALUES.HABITUAL_SPEED[species],
    directionChangeInterval: PROVISIONAL_FISH_VALUES.DIRECTION_CHANGE_INTERVAL[species],
    visionRange: PROVISIONAL_FISH_VALUES.VISION_RANGE[species],
    visualRecoveryTime: PROVISIONAL_FISH_VALUES.VISUAL_RECOVERY_TIME[species],
    boost: {
      // Provisional: boost disponible para evasión sin introducir mecánica completa de boost.
      speedMultiplier: 1.6,
      duration: null,
      cooldown: null,
    },
    evadeDuration: PROVISIONAL_FISH_VALUES.EVASION_DURATION_BASE[species],
    maxChaseDuration: null,
    comfortDuration: null,
    surrenderDuration: null,
    baseWeightByStage: { ...PROVISIONAL_FISH_VALUES.BASE_WEIGHT_BY_STAGE },
    hunger: {
      max: null,
      decayInterval: null,
      seekThreshold: null,
      recoveryAmount: null,
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
    visualRecoveryTime: config.visualRecoveryTime,
    boostSpeed: FISH_DERIVATION.boostedSpeed(
      config.habitualSpeed,
      config.boost.speedMultiplier,
      scale,
    ),
    boostDuration: FISH_DERIVATION.scaledValue(config.boost.duration, scale),
    boostCooldown: FISH_DERIVATION.scaledValue(config.boost.cooldown, scale),
    evadeDuration: FISH_DERIVATION.scaledValue(config.evadeDuration, scale),
    hungerMax: config.hunger.max,
    hungerDecayInterval: config.hunger.decayInterval,
    hungerSeekThreshold: config.hunger.seekThreshold,
    hungerRecoveryAmount: config.hunger.recoveryAmount,
    survivalMaxDuration: config.survival.maxDuration,
  };
}
