import { FISH_CONFIG } from '../config/fishConfig.js';

export default class MovementController {
  constructor() {
    this.entries = new Map();
  }

  registerFish(fish, bounds) {
    const existing = this.entries.get(fish.persistent.id);
    if (existing) {
      existing.bounds = bounds;
      return existing;
    }

    const entry = {
      fish,
      bounds,
      heading: { x: 1, y: 0 },
      targetHeading: { x: 1, y: 0 },
      directionElapsed: 0,
      speedOffset: 0,
      speedElapsed: 0,
    };

    this.entries.set(fish.persistent.id, entry);
    this.setRandomHeading(entry, true);
    this.refreshSpeedOffset(entry, true);
    return entry;
  }

  unregisterFish(fishId) {
    this.entries.delete(fishId);
  }

  clear() {
    this.entries.clear();
  }

  update(delta, bounds) {
    for (const entry of this.entries.values()) {
      entry.bounds = bounds;
      this.updateRoam(entry, delta);
    }
  }

  updateRoam(entry, delta) {
    const config = FISH_CONFIG[entry.fish.persistent.species];
    const directionChangeInterval = config?.directionChangeInterval ?? 2000;

    entry.directionElapsed += delta;
    if (entry.directionElapsed >= directionChangeInterval) {
      this.setRandomHeading(entry);
      entry.directionElapsed = 0;
    }

    this.updateHeading(entry, delta);
    const speed = this.getCurrentSpeed(entry, delta);
    this.moveFish(entry, speed, delta);
    this.constrainToBounds(entry);
  }

  moveFish(entry, speed, delta) {
    const { fish } = entry;
    const shape = fish.references.shape;
    if (!shape || speed === null) {
      return;
    }

    const distance = (speed * delta) / 1000;
    const nextX = shape.x + entry.heading.x * distance;
    const nextY = shape.y + entry.heading.y * distance;
    const probe = this.getProbePoint(entry, nextX, nextY);
    const obstacle = this.findBlockingObstacle(entry, probe.x, probe.y);

    if (obstacle) {
      this.avoidObstacle(entry, obstacle);
      return;
    }

    shape.x = nextX;
    shape.y = nextY;
    this.syncFish(entry);
  }

  syncFish(entry) {
    const { fish } = entry;
    const shape = fish.references.shape;
    fish.transient.position.x = shape.x;
    fish.transient.position.y = shape.y;
    fish.transient.orientation = entry.heading.x < 0 ? -1 : 1;
    shape.setFlipX(fish.transient.orientation < 0);
  }

  getCurrentSpeed(entry, delta) {
    const baseSpeed = entry.fish.stats?.habitualSpeed;
    if (baseSpeed === null || baseSpeed === undefined) {
      return null;
    }

    entry.speedElapsed += delta;
    if (entry.speedElapsed >= 900) {
      this.refreshSpeedOffset(entry);
      entry.speedElapsed = 0;
    }

    return Math.max(10, baseSpeed * (1 + entry.speedOffset));
  }

  refreshSpeedOffset(entry, immediate = false) {
    const target = (Math.random() * 0.16) - 0.08;
    entry.speedOffset = immediate
      ? target
      : entry.speedOffset + (target - entry.speedOffset) * 0.45;
  }

  setRandomHeading(entry, immediate = false) {
    const angle = Math.random() * Math.PI * 2;
    entry.targetHeading = { x: Math.cos(angle), y: Math.sin(angle) };
    if (immediate) {
      entry.heading = { ...entry.targetHeading };
    }
  }

  updateHeading(entry, delta) {
    const turnFactor = 1 - Math.exp(-delta / 320);
    entry.heading.x += (entry.targetHeading.x - entry.heading.x) * turnFactor;
    entry.heading.y += (entry.targetHeading.y - entry.heading.y) * turnFactor;
    const length = Math.hypot(entry.heading.x, entry.heading.y) || 1;
    entry.heading.x /= length;
    entry.heading.y /= length;
  }

  getBounds(entry) {
    const shape = entry.fish.references.shape;
    const bounds = entry.bounds;
    const halfWidth = (shape?.displayWidth ?? 0) / 2;
    const halfHeight = (shape?.displayHeight ?? 0) / 2;
    return {
      minX: bounds.x + halfWidth,
      maxX: bounds.x + bounds.width - halfWidth,
      minY: bounds.y + halfHeight,
      maxY: bounds.y + bounds.height - halfHeight,
      centerX: bounds.x + bounds.width / 2,
      centerY: bounds.y + bounds.height / 2,
    };
  }

  constrainToBounds(entry) {
    const shape = entry.fish.references.shape;
    if (!shape) {
      return;
    }

    const bounds = this.getBounds(entry);
    let hitEdge = false;

    if (shape.x <= bounds.minX) { shape.x = bounds.minX; hitEdge = true; }
    if (shape.x >= bounds.maxX) { shape.x = bounds.maxX; hitEdge = true; }
    if (shape.y <= bounds.minY) { shape.y = bounds.minY; hitEdge = true; }
    if (shape.y >= bounds.maxY) { shape.y = bounds.maxY; hitEdge = true; }

    if (hitEdge) {
      this.setHeadingTowardCenter(entry);
    }

    this.syncFish(entry);
  }

  setHeadingTowardCenter(entry) {
    const shape = entry.fish.references.shape;
    const bounds = this.getBounds(entry);
    const dx = bounds.centerX - shape.x;
    const dy = bounds.centerY - shape.y;
    const baseAngle = Math.atan2(dy || (Math.random() - 0.5), dx || (Math.random() - 0.5));
    const jitter = (Math.random() - 0.5) * (Math.PI / 3);
    const angle = baseAngle + jitter;
    entry.targetHeading = { x: Math.cos(angle), y: Math.sin(angle) };
    entry.heading = { ...entry.targetHeading };
    entry.directionElapsed = 0;
  }

  getProbePoint(entry, nextX, nextY) {
    const shape = entry.fish.references.shape;
    const lookAhead = Math.max(shape.displayWidth, shape.displayHeight) * 0.75;
    const length = Math.hypot(entry.heading.x, entry.heading.y) || 1;
    return {
      x: nextX + (entry.heading.x / length) * lookAhead,
      y: nextY + (entry.heading.y / length) * lookAhead,
    };
  }

  getObstacles(entry) {
    return (entry.bounds.obstacles ?? []).filter(Boolean);
  }

  findBlockingObstacle(entry, probeX, probeY) {
    const shape = entry.fish.references.shape;
    const padding = Math.max(shape.displayWidth, shape.displayHeight) * 0.15;
    for (const obstacle of this.getObstacles(entry)) {
      if (probeX >= obstacle.x - padding
        && probeX <= obstacle.x + obstacle.width + padding
        && probeY >= obstacle.y - padding
        && probeY <= obstacle.y + obstacle.height + padding) {
        return obstacle;
      }
    }
    return null;
  }

  avoidObstacle(entry, obstacle) {
    const shape = entry.fish.references.shape;
    const centerX = obstacle.x + obstacle.width / 2;
    const centerY = obstacle.y + obstacle.height / 2;
    const awayX = shape.x - centerX;
    const awayY = shape.y - centerY;
    const baseAngle = Math.atan2(awayY || (Math.random() - 0.5), awayX || (Math.random() - 0.5));

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const angle = baseAngle + (Math.random() - 0.5) * Math.PI;
      const candidate = { x: Math.cos(angle), y: Math.sin(angle) };
      const probeX = shape.x + candidate.x * shape.displayWidth;
      const probeY = shape.y + candidate.y * shape.displayHeight;
      if (!this.findBlockingObstacle(entry, probeX, probeY) && this.isInsideBounds(entry, probeX, probeY)) {
        entry.targetHeading = candidate;
        entry.directionElapsed = 0;
        return;
      }
    }

    this.setHeadingTowardCenter(entry);
  }

  isInsideBounds(entry, x, y) {
    const bounds = this.getBounds(entry);
    return x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY;
  }
}
