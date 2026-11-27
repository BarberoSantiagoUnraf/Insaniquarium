import { canConsumeBaseFood, canConsumeFish } from '../config/fishConfig.js';
import { VISION_CATEGORIES, VISION_FIELD } from './visionTypes.js';

function normalizeAngle(angle) {
  let normalized = angle;
  while (normalized > Math.PI) normalized -= Math.PI * 2;
  while (normalized < -Math.PI) normalized += Math.PI * 2;
  return normalized;
}

function getHeadAngle(fish) {
  return fish.transient.orientation < 0 ? Math.PI : 0;
}

function isWithinVisionCone(fish, targetX, targetY, range) {
  const { x, y } = fish.transient.position;
  const dx = targetX - x;
  const dy = targetY - y;
  const distanceSq = dx * dx + dy * dy;
  if (distanceSq > range * range) {
    return { visible: false, distance: Math.sqrt(distanceSq) };
  }

  const angleToTarget = Math.atan2(dy, dx);
  const delta = Math.abs(normalizeAngle(angleToTarget - getHeadAngle(fish)));
  return { visible: delta <= VISION_FIELD.HALF_ANGLE_RADIANS, distance: Math.sqrt(distanceSq) };
}

function classifyFish(observer, target) {
  if (observer.persistent.id === target.persistent.id) {
    return null;
  }
  if (observer.persistent.species === target.persistent.species) {
    return VISION_CATEGORIES.COMPANION;
  }
  if (canConsumeFish(observer, target)) {
    return VISION_CATEGORIES.PREY;
  }
  if (canConsumeFish(target, observer)) {
    return VISION_CATEGORIES.THREAT;
  }
  return null;
}

export default class VisionSystem {
  update({ fishes, foods, delta }) {
    for (const fish of fishes) {
      this.updateFishVision(fish, fishes, foods, delta);
    }
  }

  updateFishVision(fish, fishes, foods, delta) {
    const vision = fish.transient.vision;
    const range = fish.stats?.visionRange;
    if (!vision || range === null || range === undefined) {
      return;
    }

    const visibleNow = new Map();

    for (const other of fishes) {
      const category = classifyFish(fish, other);
      if (!category) {
        continue;
      }
      const { x, y } = other.transient.position;
      const check = isWithinVisionCone(fish, x, y, range);
      if (check.visible) {
        visibleNow.set(this.entityKey('fish', other.persistent.id), {
          id: other.persistent.id,
          type: 'fish',
          category,
          position: { x, y },
          distance: check.distance,
        });
      }
    }

    const canEatBaseFood = canConsumeBaseFood(fish);
    for (const food of foods) {
      const x = food.shape.x;
      const y = food.shape.y;
      const check = isWithinVisionCone(fish, x, y, range);
      if (check.visible) {
        visibleNow.set(this.entityKey('food', food.id ?? food.shape), {
          id: food.id ?? food.shape,
          type: 'food',
          category: VISION_CATEGORIES.FOOD,
          consumable: canEatBaseFood,
          position: { x, y },
          distance: check.distance,
        });
      }
    }

    this.mergeContacts(fish, visibleNow, delta);
  }

  entityKey(type, id) {
    return `${type}:${String(id)}`;
  }

  mergeContacts(fish, visibleNow, delta) {
    const vision = fish.transient.vision;
    const nextContacts = new Map();

    for (const [key, contact] of visibleNow.entries()) {
      const previous = vision.contacts.get(key);
      nextContacts.set(key, {
        ...contact,
        visible: true,
        lastKnownPosition: { ...contact.position },
        recoveryTimer: previous?.recoveryTimer ?? 0,
        lost: false,
      });
    }

    for (const [key, previous] of vision.contacts.entries()) {
      if (nextContacts.has(key)) {
        continue;
      }
      if (previous.visible) {
        nextContacts.set(key, {
          ...previous,
          visible: false,
          lost: true,
          recoveryTimer: fish.stats?.visualRecoveryTime ?? 0,
        });
        continue;
      }

      const recoveryTimer = Math.max(0, (previous.recoveryTimer ?? 0) - delta);
      if (recoveryTimer > 0) {
        nextContacts.set(key, { ...previous, visible: false, lost: true, recoveryTimer });
      }
    }

    vision.contacts = nextContacts;
  }

  getVisibleByCategory(fish, category) {
    return [...fish.transient.vision.contacts.values()].filter(
      (contact) => contact.visible && contact.category === category,
    );
  }

  getRememberedByCategory(fish, category) {
    return [...fish.transient.vision.contacts.values()].filter(
      (contact) => !contact.visible && contact.lost && contact.category === category && contact.recoveryTimer > 0,
    );
  }
}

