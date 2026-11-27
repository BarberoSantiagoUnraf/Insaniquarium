export const AI_SYSTEM_ROLES = Object.freeze({
  fishAiController: 'Coordina el comportamiento individual del pez.',
  visionSystem: 'Detecta entidades dentro del rango de visión.',
  movementController: 'Ejecuta desplazamientos y orientación.',
  hungerSystem: 'Administra el hambre y la supervivencia.',
  feedingSystem: 'Administra el consumo de alimento.',
  behaviorSystem: 'Gestiona los estados de comportamiento.',
  entityManager: 'Administra las entidades activas.',
});

export function createAiDependencies(entityManager) {
  return {
    fishAiController: null,
    visionSystem: null,
    movementController: null,
    hungerSystem: null,
    feedingSystem: null,
    behaviorSystem: null,
    entityManager: entityManager ?? null,
  };
}
