import Phaser from 'phaser';
import UiButton from './UiButton.js';
import { HUD_HEIGHT_RATIO, TEXTURES, TOOL_KEYS } from '../config/constants.js';

const noop = () => {};

export default class GameHud {
  constructor(scene, handlers = {}) {
    this.scene = scene;
    this.handlers = {
      onSelectTool: noop,
      onPause: noop,
      ...handlers,
    };

    this.container = scene.add.container(0, 0).setDepth(100);
    this.background = scene.add.rectangle(0, 0, 1, 1, 0x102a3c, 0.97).setOrigin(0, 0);
    this.container.add(this.background);

    const toolConfigs = [
      {
        tool: TOOL_KEYS.FOOD,
        texture: TEXTURES.FOOD,
        label: 'Alimento',
        name: 'select-food',
      },
      {
        tool: TOOL_KEYS.MOJARRITA,
        texture: TEXTURES.MOJARRITA,
        label: 'Mojarritas',
        name: 'select-mojarrita',
      },
      {
        tool: TOOL_KEYS.SURUBI,
        texture: TEXTURES.SURUBI,
        label: 'Surubí',
        name: 'select-surubi',
      },
    ];

    this.selectionButtons = toolConfigs.map(({ tool, ...config }) => {
      const button = new UiButton(scene, {
        ...config,
        selectedFill: 0x2f7191,
        selectedStroke: 0xffd166,
        onClick: () => this.handlers.onSelectTool(tool),
      });
      button.setData('tool', tool);
      return button;
    });

    this.pauseButton = new UiButton(scene, {
      texture: TEXTURES.PAUSE,
      label: 'Pausa',
      name: 'pause',
      fill: 0x1b3c50,
      hoverFill: 0x28617f,
      onClick: () => this.handlers.onPause(),
    });

    this.balanceText = scene.add
      .text(0, 0, 'Monedas: 0', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        color: '#ffd166',
        align: 'right',
      })
      .setOrigin(1, 0.5);

    this.container.add([...this.selectionButtons, this.pauseButton, this.balanceText]);
    this.layout(scene.scale.width, scene.scale.height);
  }

  setActiveTool(tool) {
    this.selectionButtons.forEach((button) => {
      button.setSelected(button.getData('tool') === tool);
    });
  }

  setBalance(balance) {
    this.balanceText.setText(`Monedas: ${balance}`);
  }

  layout(width, height) {
    this.hudHeight = Math.round(height * HUD_HEIGHT_RATIO);
    this.background.setSize(width, this.hudHeight);

    const padding = Math.max(8, Math.round(width * 0.014));
    const gap = Math.max(8, Math.round(width * 0.01));
    const pauseWidth = Phaser.Math.Clamp(width * 0.07, 44, 84);
    const pauseHeight = Phaser.Math.Clamp(this.hudHeight * 0.45, 30, 54);
    const balanceWidth = Phaser.Math.Clamp(width * 0.13, 100, 170);
    const availableWidth = width - pauseWidth - balanceWidth - padding * 4 - gap * 2;
    const buttonWidth = Math.max(52, availableWidth / 3);
    const buttonHeight = Phaser.Math.Clamp(this.hudHeight * 0.58, 38, 84);
    const selectionFontSize = Phaser.Math.Clamp(Math.round(buttonHeight * 0.28), 11, 20);
    const pauseFontSize = Phaser.Math.Clamp(Math.round(pauseHeight * 0.3), 10, 14);
    const balanceFontSize = Phaser.Math.Clamp(Math.round(this.hudHeight * 0.22), 12, 20);

    this.selectionButtons.forEach((button, index) => {
      button
        .resize(buttonWidth, buttonHeight, selectionFontSize)
        .setPosition(padding + buttonWidth / 2 + index * (buttonWidth + gap), this.hudHeight / 2);
    });

    this.pauseButton
      .resize(pauseWidth, pauseHeight, pauseFontSize)
      .setPosition(width - padding - pauseWidth / 2, this.hudHeight / 2);

    this.balanceText
      .setFontSize(balanceFontSize)
      .setWordWrapWidth(balanceWidth)
      .setPosition(width - padding - pauseWidth - 12, this.hudHeight / 2);
  }

  destroy() {
    this.container.destroy();
  }
}
