import { BEHAVIOR_STATES } from '../ai/behaviorStates.js';
import { deriveFishStats } from '../config/fishConfig.js';
import { FISH_RULES, GROWTH_STAGES } from '../config/constants.js';

function randomFloat(min, max) {
  return min + Math.random() * (max - min);
}

function randomInteger(min, max) {
  return Math.floor(randomFloat(min, max + 1));
}

export function createFishData({ id, species, x, y }) {
  const fish = {
    persistent: {
      id,
      species,
      growthStage: GROWTH_STAGES.LARV,
      scale: randomFloat(FISH_RULES.SCALE.MIN, FISH_RULES.SCALE.MAX),
      instinct: randomInteger(FISH_RULES.INSTINCT.MIN, FISH_RULES.INSTINCT.MAX),
      growthProgress: 0,
    },
    transient: {
      hunger: null,
      hungerTimer: 0,
      survivalTimer: 0,
      isHungry: false,
      isSeekingFood: false,
      position: { x, y },
      orientation: 1,
      behaviorState: BEHAVIOR_STATES.ROAM,
      vision: {
        contacts: new Map(),
      },
      evasion: {
        active: false,
        timer: 0,
        duration: 0,
        threatId: null,
        threatLastPosition: null,
        boostActive: false,
        boostTimer: 0,
        boostCooldownTimer: 0,
      },
      feeding: {
        targetId: null,
        targetLastPosition: null,
      },
      prey: {
        targetId: null,
        targetLastPosition: null,
      },
      chase: {
        active: false,
        timer: 0,
        duration: null,
        targetId: null,
      },
    },
    references: {
      shape: null,
      targets: [],
    },
  };

  Object.defineProperty(fish, 'stats', {
    enumerable: true,
    get: () => deriveFishStats(
      fish.persistent.species,
      fish.persistent.scale,
      fish.persistent.growthStage,
    ),
  });

  return fish;
}
