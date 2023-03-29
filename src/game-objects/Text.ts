import { GameObjects, Scene } from 'phaser';
export class Text extends GameObjects.Text {
  constructor(scene: Scene, x: number, y: number, text: string) {
    super(scene, x, y, text, {
      fontSize: '62',
      fontFamily: 'Arial',
      align: 'center',
      color: '#fff',
      stroke: '#000',
      strokeThickness:3,
    });
    this.setOrigin(0, 0);
    scene.add.existing(this);
  }
}