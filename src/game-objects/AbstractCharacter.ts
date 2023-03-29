import { Physics } from 'phaser';
export class AbstractCharacter extends Physics.Arcade.Sprite {
	protected hp = 100;
  	
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
		super(scene, x, y, texture, frame);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.getBody().setCollideWorldBounds(true);
  	}
	
  	public getBody(): Physics.Arcade.Body {
    	return this.body as Physics.Arcade.Body;
  	}
}