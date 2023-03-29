
import Phaser from 'phaser';

import { Preloader } from './scenes/LoadingScene';
import { Level1 } from './scenes/Level1';
import { SceneLivingLabIMTAtlantique } from './scenes/SceneLivingLabIMTAtlantique';

class PhaserGame extends Phaser.Game {
    constructor() {
      const config = {
        type: Phaser.AUTO,
        parent: 'game-container',
        width: 1000,
        height: 600,
        backgroundColor: '#ffffff',
        pixelArt: true,
        input: {
          gamepad: true
        },
        scale: {
            autoCenter: Phaser.Scale.CENTER_VERTICALLY
          },
        physics: {
          default: 'arcade',
          arcade: {
            debug: true,
          },
        },
        scene: [Preloader, Level1, SceneLivingLabIMTAtlantique],
      };
      super(config);
    }
  }
  // tslint:disable-next-line
new PhaserGame();