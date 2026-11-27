import Phaser from 'phaser';
import { SCENE_KEYS, TEXTURES } from '../config/constants.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.BOOT);
  }

  create() {
    const graphics = this.add.graphics();

    graphics.fillStyle(0x0e6f9e, 1);
    graphics.fillRect(0, 0, 128, 128);
    graphics.fillStyle(0x2296bd, 0.5);
    for (let y = 8; y < 128; y += 24) {
      graphics.fillRect(0, y, 128, 5);
    }
    graphics.generateTexture(TEXTURES.BACKGROUND, 128, 128);
    graphics.clear();

    graphics.fillStyle(0x9a4f2e, 1);
    graphics.fillCircle(32, 32, 21);
    graphics.fillStyle(0xe0a055, 1);
    graphics.fillCircle(25, 27, 5);
    graphics.fillCircle(39, 36, 6);
    graphics.generateTexture(TEXTURES.FOOD, 64, 64);
    graphics.clear();

    graphics.fillStyle(0xb9d8e6, 1);
    graphics.fillEllipse(52, 24, 70, 28);
    graphics.fillStyle(0x7fa9bf, 1);
    graphics.fillTriangle(20, 24, 5, 12, 5, 36);
    graphics.fillStyle(0x1d3445, 1);
    graphics.fillCircle(70, 19, 3);
    graphics.generateTexture(TEXTURES.MOJARRITA, 96, 48);
    graphics.clear();

    graphics.fillStyle(0x5f432c, 1);
    graphics.fillTriangle(20, 32, 3, 15, 3, 49);
    graphics.fillStyle(0x7c5a3c, 1);
    graphics.fillEllipse(66, 32, 100, 42);
    graphics.fillStyle(0x9b7753, 1);
    graphics.fillEllipse(68, 32, 78, 28);
    graphics.fillStyle(0x1d3445, 1);
    graphics.fillCircle(92, 25, 4);
    graphics.lineStyle(2, 0x4b3626, 1);
    graphics.strokeEllipse(66, 32, 100, 42);
    graphics.generateTexture(TEXTURES.SURUBI, 128, 64);
    graphics.clear();

    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(20, 14, 8, 36);
    graphics.fillRect(36, 14, 8, 36);
    graphics.generateTexture(TEXTURES.PAUSE, 64, 64);
    graphics.destroy();

    this.scene.start(SCENE_KEYS.MENU);
  }
}
