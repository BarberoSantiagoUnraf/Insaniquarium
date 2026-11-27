import Phaser from 'phaser';
import FishAIController from '../ai/FishAIController.js';
import VisionSystem from '../ai/VisionSystem.js';
import GameHud from '../ui/GameHud.js';
import Wallet from '../systems/Wallet.js';
import EntityManager from '../entities/EntityManager.js';
import MovementController from '../systems/MovementController.js';
import { createAiDependencies } from '../ai/systemRoles.js';
import {
  ECONOMY,
  FISH_BY_TOOL,
  FISH_RULES,
  FISH_TEXTURE,
  FOOD_RULES,
  HUD_HEIGHT_RATIO,
  SCENE_KEYS,
  SPECIES,
  TEXTURES,
  TOOL_KEYS,
} from '../config/constants.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.GAME);
  }

  create() {
    this.cameras.main.setBackgroundColor('#0e6f9e');

    this.background = this.add.image(0, 0, TEXTURES.BACKGROUND).setOrigin(0, 0).setDepth(0);
    this.entities = new EntityManager();
    this.movementController = new MovementController();
    this.visionSystem = new VisionSystem();
    this.fishAiController = new FishAIController({
      movementController: this.movementController,
    });
    this.aiDependencies = createAiDependencies(this.entities);
    this.aiDependencies.movementController = this.movementController;
    this.aiDependencies.visionSystem = this.visionSystem;
    this.aiDependencies.fishAiController = this.fishAiController;
    this.initialFish = this.createInitialFish();
    this.fish = this.initialFish.references.shape;
    this.foods = [];
    this.activeTool = null;
    this.wallet = new Wallet(ECONOMY.INITIAL_BALANCE);

    this.hud = new GameHud(this, {
      onSelectTool: (tool) => this.selectTool(tool),
      onPause: () => this.openPauseMenu(),
    });
    this.unsubscribeWallet = this.wallet.subscribe((balance) => this.hud.setBalance(balance));

    this.arenaZone = this.add.zone(0, 0, 1, 1).setOrigin(0, 0).setInteractive();
    this.arenaZone.on('pointerdown', (pointer) => this.handleArenaClick(pointer));

    this.scale.on('resize', this.layout, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
    this.layout(this.scale.width, this.scale.height);
  }

  layout(width, height) {
    const hudHeight = Math.round(height * HUD_HEIGHT_RATIO);
    const arenaHeight = Math.max(1, height - hudHeight);
    const arenaBounds = this.getArenaBounds(width, height);
    const initialBaseWidth = Phaser.Math.Clamp(
      width * FISH_RULES.INITIAL_DISPLAY_WIDTH_RATIO,
      FISH_RULES.INITIAL_DISPLAY_WIDTH_MIN,
      FISH_RULES.INITIAL_DISPLAY_WIDTH_MAX,
    );

    this.background.setPosition(0, hudHeight).setDisplaySize(width, arenaHeight);
    this.fish.setPosition(width / 2, hudHeight + arenaHeight / 2);
    this.applyFishDisplaySize(this.initialFish, initialBaseWidth);
    this.arenaZone.setPosition(0, hudHeight).setSize(width, arenaHeight);

    this.entities.fishes.forEach((fish) => {
      const shape = fish.references.shape;
      if (!shape) {
        return;
      }
      fish.transient.position.x = shape.x;
      fish.transient.position.y = shape.y;
      this.movementController.registerFish(fish, arenaBounds);
      this.movementController.constrainToBounds(this.movementController.entries.get(fish.persistent.id));
    });

    this.foods.forEach((food) => {
      food.bottomY = height - food.radius - FOOD_RULES.BOTTOM_PADDING;
      if (food.shape.y > food.bottomY) {
        food.shape.y = food.bottomY;
      }
    });

    this.hud.layout(width, height);
  }

  getArenaBounds(width = this.scale.width, height = this.scale.height) {
    const hudHeight = Math.round(height * HUD_HEIGHT_RATIO);
    return {
      x: 0,
      y: hudHeight,
      width,
      height: Math.max(1, height - hudHeight),
      obstacles: [],
    };
  }

  update(time, delta) {
    this.visionSystem.update({
      fishes: this.entities.fishes,
      foods: this.foods,
      delta,
    });
    this.fishAiController.update(delta, this.getArenaBounds());

    for (let index = this.foods.length - 1; index >= 0; index -= 1) {
      const food = this.foods[index];

      if (food.resting) {
        food.elapsed += delta;
        if (food.elapsed >= FOOD_RULES.REST_DURATION) {
          food.shape.destroy();
          this.foods.splice(index, 1);
        }
        continue;
      }

      food.shape.y = Math.min(
        food.shape.y + (FOOD_RULES.FALL_SPEED * delta) / 1000,
        food.bottomY,
      );

      if (food.shape.y >= food.bottomY) {
        food.resting = true;
        food.elapsed = 0;
      }
    }
  }

  selectTool(tool) {
    this.activeTool = this.activeTool === tool ? null : tool;
    this.hud.setActiveTool(this.activeTool);
  }

  handleArenaClick(pointer) {
    if (!this.activeTool) {
      return;
    }

    const cost = ECONOMY.COSTS[this.activeTool];
    if (cost === undefined || !this.wallet.spend(cost)) {
      return;
    }

    if (this.activeTool === TOOL_KEYS.FOOD) {
      this.spawnFood(pointer.worldX, pointer.worldY);
      return;
    }

    this.spawnFish(pointer.worldX, pointer.worldY, this.activeTool);
  }

  spawnFood(x, y) {
    const shape = this.add
      .circle(x, y, FOOD_RULES.RADIUS, 0xb85c32, 1)
      .setStrokeStyle(2, 0xe0a055)
      .setDepth(20);

    this.foods.push({
      id: `food-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      shape,
      radius: FOOD_RULES.RADIUS,
      bottomY: this.scale.height - FOOD_RULES.RADIUS - FOOD_RULES.BOTTOM_PADDING,
      resting: false,
      elapsed: 0,
    });
  }

  createInitialFish() {
    const fish = this.entities.createFish({
      species: SPECIES.SURUBI,
      x: this.scale.width / 2,
      y: this.scale.height / 2,
    });

    this.createFishSprite(SPECIES.SURUBI, fish);
    this.movementController.registerFish(fish, this.getArenaBounds());
    return fish;
  }

  createFishSprite(species, fish) {
    const { x, y } = fish.transient.position;
    const shape = this.add.image(x, y, FISH_TEXTURE[species]).setDepth(FISH_RULES.DEPTH);
    fish.references.shape = shape;
    return shape;
  }

  applyFishDisplaySize(fish, baseWidth) {
    const width = baseWidth * fish.persistent.scale;
    fish.references.shape.setDisplaySize(width, width * FISH_RULES.DISPLAY_HEIGHT_RATIO);
  }

  spawnFish(x, y, tool) {
    const species = FISH_BY_TOOL[tool];
    if (!species) {
      return null;
    }

    const fish = this.entities.createFish({ species, x, y });
    if (!fish) {
      return null;
    }

    this.createFishSprite(species, fish);
    const baseWidth = Math.min(
      FISH_RULES.DISPLAY_WIDTH[species],
      this.scale.width * FISH_RULES.MAX_DISPLAY_WIDTH_RATIO,
    );
    this.applyFishDisplaySize(fish, baseWidth);
    this.movementController.registerFish(fish, this.getArenaBounds());
    return fish;
  }

  openPauseMenu() {
    if (this.scene.isActive(SCENE_KEYS.PAUSE)) {
      return;
    }

    this.scene.launch(SCENE_KEYS.PAUSE);
    this.scene.pause();
  }

  cleanup() {
    this.scale.off('resize', this.layout, this);
    this.unsubscribeWallet();
    this.movementController.clear();
    this.entities.clear();
    this.hud.destroy();
  }
}
