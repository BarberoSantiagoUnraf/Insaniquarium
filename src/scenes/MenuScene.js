import Phaser from 'phaser';
import UiButton from '../ui/UiButton.js';
import { SCENE_KEYS } from '../config/constants.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.MENU);
  }

  create() {
    this.cameras.main.setBackgroundColor('#0b2130');

    this.title = this.add.text(0, 0, 'Insaniquarium', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '48px',
      color: '#f2f7f9',
    }).setOrigin(0.5);

    this.subtitle = this.add.text(0, 0, 'Cuidá tu pequeño ecosistema', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#9ec7d8',
    }).setOrigin(0.5);

    this.playButton = new UiButton(this, {
      label: 'Jugar',
      name: 'play',
      onClick: () => this.scene.start(SCENE_KEYS.GAME),
    });

    this.exitButton = new UiButton(this, {
      label: 'Salir',
      name: 'exit',
      fill: 0x3a2230,
      hoverFill: 0x633145,
      stroke: 0xd38ba1,
      onClick: () => this.handleExit(),
    });

    this.exitMessage = this.add.text(0, 0, 'No se pudo cerrar la pestaña. Cerrala manualmente.', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#f2c14e',
      align: 'center',
    }).setOrigin(0.5).setVisible(false);

    this.scale.on('resize', this.layout, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
    this.layout(this.scale.width, this.scale.height);
  }

  layout(width, height) {
    const centerX = width / 2;
    const buttonWidth = Phaser.Math.Clamp(width * 0.28, 200, 340);
    const buttonHeight = Phaser.Math.Clamp(height * 0.09, 52, 74);
    const titleSize = Phaser.Math.Clamp(Math.round(width * 0.055), 30, 64);
    const buttonFontSize = Phaser.Math.Clamp(Math.round(buttonHeight * 0.35), 16, 24);

    this.title.setFontSize(titleSize).setPosition(centerX, height * 0.28);
    this.subtitle.setPosition(centerX, height * 0.38);
    this.playButton.resize(buttonWidth, buttonHeight, buttonFontSize).setPosition(centerX, height * 0.53);
    this.exitButton
      .resize(buttonWidth, buttonHeight, buttonFontSize)
      .setPosition(centerX, height * 0.53 + buttonHeight + 16);
    this.exitMessage.setPosition(centerX, height * 0.53 + (buttonHeight + 16) * 2 + 24);
  }

  handleExit() {
    let closeRejected = false;

    try {
      window.close();
    } catch {
      closeRejected = true;
    }

    this.time.delayedCall(250, () => {
      if (closeRejected || !window.closed) {
        this.exitMessage.setVisible(true);
      }
    });
  }

  cleanup() {
    this.scale.off('resize', this.layout, this);
  }
}
