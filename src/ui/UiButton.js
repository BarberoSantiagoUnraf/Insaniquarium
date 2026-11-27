import Phaser from 'phaser';

export default class UiButton extends Phaser.GameObjects.Container {
  constructor(scene, options = {}) {
    const {
      x = 0,
      y = 0,
      width = 120,
      height = 60,
      texture = null,
      label = '',
      labelSize = 16,
      fill = 0x16344a,
      hoverFill = 0x205575,
      activeFill = 0x0f2638,
      stroke = 0x75b7d4,
      selectedFill = 0x2f7191,
      selectedStroke = 0xffd166,
      textColor = '#ffffff',
      onClick = () => {},
      name = '',
    } = options;

    super(scene, x, y);

    this.normalFill = fill;
    this.hoverFill = hoverFill;
    this.activeFill = activeFill;
    this.strokeColor = stroke;
    this.selectedFill = selectedFill;
    this.selectedStroke = selectedStroke;
    this.labelSize = labelSize;
    this.isSelected = false;
    this.pointerState = 'out';

    this.background = scene.add
      .rectangle(0, 0, width, height, fill, 0.96)
      .setStrokeStyle(2, stroke);

    this.icon = texture
      ? scene.add.image(-width * 0.3, 0, texture).setDisplaySize(height * 0.46, height * 0.46)
      : null;

    this.text = scene.add
      .text(texture ? width * 0.03 : 0, 0, label, {
        fontFamily: 'Arial, sans-serif',
        fontSize: `${labelSize}px`,
        color: textColor,
        align: 'center',
      })
      .setOrigin(texture ? 0 : 0.5, 0.5);

    this.add(this.icon ? [this.background, this.icon, this.text] : [this.background, this.text]);
    this.setSize(width, height);
    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, width, height),
      Phaser.Geom.Rectangle.Contains,
    );

    this.on('pointerover', () => {
      this.pointerState = 'over';
      this.refreshVisual();
    });
    this.on('pointerout', () => {
      this.pointerState = 'out';
      this.refreshVisual();
    });
    this.on('pointerdown', () => {
      this.pointerState = 'down';
      this.refreshVisual();
    });
    this.on('pointerup', () => {
      this.pointerState = 'over';
      this.refreshVisual();
      onClick();
    });

    if (name) {
      this.setName(name);
    }

    scene.add.existing(this);
  }

  setSelected(selected) {
    this.isSelected = Boolean(selected);
    return this.refreshVisual();
  }

  refreshVisual() {
    const fill = this.isSelected
      ? this.selectedFill
      : this.pointerState === 'down'
        ? this.activeFill
        : this.pointerState === 'over'
          ? this.hoverFill
          : this.normalFill;
    const strokeColor = this.isSelected ? this.selectedStroke : this.strokeColor;
    const strokeWidth = this.isSelected ? 3 : 2;

    this.background.setFillStyle(fill, 0.96).setStrokeStyle(strokeWidth, strokeColor);
    return this;
  }

  resize(width, height, labelSize = this.labelSize) {
    this.labelSize = labelSize;
    this.background.setSize(width, height);

    const iconSize = Math.min(height * 0.46, width * 0.24);
    this.icon?.setPosition(-width * 0.3, 0).setDisplaySize(iconSize, iconSize);
    this.text
      .setPosition(this.icon ? width * 0.03 : 0, 0)
      .setFontSize(labelSize)
      .setWordWrapWidth(this.icon ? width * 0.62 : width * 0.9);

    this.setSize(width, height);
    this.input.hitArea.setTo(0, 0, width, height);
    return this;
  }
}
