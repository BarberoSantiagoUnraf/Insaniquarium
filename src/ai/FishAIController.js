import { BEHAVIOR_STATES } from './behaviorStates.js';

export default class FishAIController {
  constructor({ movementController } = {}) {
    this.movementController = movementController;
  }

  update(delta, bounds) {
    if (!this.movementController) {
      return;
    }

    for (const entry of this.movementController.entries.values()) {
      const state = entry.fish.transient.behaviorState;
      if (state === BEHAVIOR_STATES.ROAM) {
        this.movementController.updateRoam(entry, delta);
        this.movementController.constrainToBounds(entry);
      }
    }
  }
}
