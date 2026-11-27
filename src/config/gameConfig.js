import Phaser from 'phaser';
import BootScene from '../scenes/BootScene.js';
import MenuScene from '../scenes/MenuScene.js';
import GameScene from '../scenes/GameScene.js';
import PauseScene from '../scenes/PauseScene.js';

const GAME_SCENES = [BootScene, MenuScene, GameScene, PauseScene];

export function createGameConfig() {
  return {
    type: Phaser.AUTO,
    parent: 'game-root',
    backgroundColor: '#071622',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    render: {
      antialias: true,
    },
    scene: GAME_SCENES,
  };
}
