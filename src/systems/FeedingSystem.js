import { canConsumeBaseFood } from '../config/fishConfig.js';

export default class FeedingSystem {
  constructor({ distance = 18 } = {}) {
    this.distance = distance;
  }

  findConsumableTarget(fish) {
    if (!canConsumeBaseFood(fish)) return null;
    const contacts = fish.transient.vision?.contacts;
    if (!contacts) return null;

    let selected = null;
    for (const contact of contacts.values()) {
      if (contact.type !== 'food' || contact.category !== 'food' || contact.consumable !== true) continue;
      if (!selected || contact.distance < selected.distance) {
        selected = contact;
      }
    }
    return selected;
  }

  tryConsume(fish, foods, hungerSystem) {
    if (!canConsumeBaseFood(fish)) {
      return { consumed: false, reason: 'incompatible' };
    }

    const target = this.findConsumableTarget(fish);
    if (!target || !target.visible) {
      return { consumed: false, reason: 'no-target' };
    }
    if (target.distance > this.distance) {
      return { consumed: false, reason: 'out-of-range' };
    }

    const foodIndex = foods.findIndex((food) => (food.id ?? food.shape) === target.id);
    if (foodIndex < 0) {
      return { consumed: false, reason: 'missing-food' };
    }

    if (!hungerSystem || !hungerSystem.recover(fish)) {
      return { consumed: false, reason: 'hunger-recover-failed' };
    }

    const [food] = foods.splice(foodIndex, 1);
    food.shape?.destroy();
    fish.transient.feeding.targetId = null;
    fish.transient.feeding.targetLastPosition = null;
    return { consumed: true, food };
  }
}
