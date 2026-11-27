import Phaser from 'phaser';
import UiButton from '../ui/UiButton.js';
import { SCENE_KEYS } from '../config/constants.js';
import { saveGame } from '../services/saveService.js';

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.PAUSE);
  }

  create() {
    this.overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x02080c, 0.68)
      .setOrigin(0, 0);

    this.panel = this.add
      .rectangle(0, 0, 400, 360, 0x122b3d, 0.99)
      .setStrokeStyle(2, 0x74b2cf);

    this.title = this.add.text(0, 0, 'Pausa', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '32px',
      color: '#f2f7f9',
    }).setOrigin(0.5);

    this.resumeButton = new UiButton(this, {
      label: 'Continuar',
      name: 'resume',
      onClick: () => this.resumeGame(),
    });

    this.saveButton = new UiButton(this, {
      label: 'Guardar',
      name: 'save',
      onClick: () => {
        void saveGame({ scene: SCENE_KEYS.GAME });
      },
    });

    this.menuButton = new UiButton(this, {
      label: 'Volver al menú',
      name: 'back-to-menu',
      fill: 0x3a2230,
      hoverFill: 0x633145,
      stroke: 0xd38ba1,
      onClick: () => this.returnToMenu(),
    });

    this.scale.on('resize', this.layout, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
    this.layout(this.scale.width, this.scale.height);
  }

  layout(width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const panelWidth = Phaser.Math.Clamp(width * 0.5, 300, 460);
    const panelHeight = Phaser.Math.Clamp(height * 0.6, 300, 420);
    const buttonWidth = panelWidth * 0.76;
    const buttonHeight = Phaser.Math.Clamp(panelHeight * 0.14, 40, 58);
    const gap = buttonHeight + 14;

    this.overlay.setSize(width, height);
    this.panel.setSize(panelWidth, panelHeight).setPosition(centerX, centerY);
    this.title.setPosition(centerX, centerY - panelHeight / 2 + 54);
    this.resumeButton.resize(buttonWidth, buttonHeight, 18).setPosition(centerX, centerY - gap);
    this.saveButton.resize(buttonWidth, buttonHeight, 18).setPosition(centerX, centerY);
    this.menuButton.resize(buttonWidth, buttonHeight, 18).setPosition(centerX, centerY + gap);
  }

  resumeGame() {
    this.scene.get(SCENE_KEYS.GAME).scene.resume();
    this.scene.stop();
  }

  returnToMenu() {
    this.scene.stop(SCENE_KEYS.GAME);
    this.scene.start(SCENE_KEYS.MENU);
  }

  cleanup() {
    this.scale.off('resize', this.layout, this);
  }
}
