import { FISH_CONFIG } from '../config/fishConfig.js';
import { createFishData } from './fishData.js';

export default class EntityManager {
  constructor() {
    this.fishes = [];
    this.nextFishId = 1;
  }

  createFish({ species, x, y }) {
    if (!FISH_CONFIG[species]) {
      return null;
    }

    const fish = createFishData({ id: this.nextFishId, species, x, y });
    this.nextFishId += 1;
    this.fishes.push(fish);
    return fish;
  }

  getFishById(id) {
    return this.fishes.find((fish) => fish.persistent.id === id) ?? null;
  }

  getFishByShape(shape) {
    return this.fishes.find((fish) => fish.references.shape === shape) ?? null;
  }

  clear() {
    this.fishes.length = 0;
  }
}
