import { Text } from '../game-objects/Text';

export class EffectorObject extends Phaser.GameObjects.Sprite {
    private text: Text;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, name: string, texture: string, frame?: string | number) {
		super(scene, x, y, texture, frame);
        this.name = name;
        this.text = new Text(this.scene, x+10, y-40, text).setFontSize(12).setOrigin(0.8, 0.5); 
		scene.add.existing(this);
  	}

    getTextObject(){
        return this.text
    }
}