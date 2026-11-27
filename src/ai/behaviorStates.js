export const BEHAVIOR_STATES = Object.freeze({
  ROAM: 'roam',
  SEEK_FOOD: 'seekFood',
  APPROACH_PREY: 'approachPrey',
  CHASE: 'chase',
  CHARGE: 'charge',
  EVADE: 'evade',
  COMFORT: 'comfort',
  SURRENDER: 'surrender',
});

export const BEHAVIOR_PRIORITY = Object.freeze({
  [BEHAVIOR_STATES.ROAM]: 1,
  [BEHAVIOR_STATES.SEEK_FOOD]: 2,
  [BEHAVIOR_STATES.APPROACH_PREY]: 3,
  [BEHAVIOR_STATES.CHASE]: 4,
  [BEHAVIOR_STATES.CHARGE]: 5,
  [BEHAVIOR_STATES.COMFORT]: 6,
  [BEHAVIOR_STATES.SURRENDER]: 7,
  [BEHAVIOR_STATES.EVADE]: 8,
});

export function hasHigherPriority(candidate, current) {
  return (BEHAVIOR_PRIORITY[candidate] ?? 0) > (BEHAVIOR_PRIORITY[current] ?? 0);
}
