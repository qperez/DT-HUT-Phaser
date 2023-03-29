import { NONE } from 'phaser';
import { CASSETS } from '../constants/CASSETS';
import { CKEYBOARD } from '../constants/CKEYBOARD';
import { AbstractCharacter } from './AbstractCharacter';
import { Text } from './Text';

export class Player extends AbstractCharacter {
	private keyUP: Phaser.Input.Keyboard.Key;
	private keyLEFT: Phaser.Input.Keyboard.Key;
	private keyDOWN: Phaser.Input.Keyboard.Key;
	private keyRIGHT: Phaser.Input.Keyboard.Key;

	//private axisX: Phaser.Input.Gamepad.Axis;
	//private axisY: Phaser.Input.Gamepad.Axis;

	private hasPad: boolean;
	private pad: Phaser.Input.Gamepad.Gamepad;
	private lastDirection: string;

	private passDoorMutex: boolean;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, CASSETS.IMAGES.PLAYER);
		// KEYS
		this.keyUP = this.scene.input.keyboard.addKey(CKEYBOARD.UP);
		this.keyLEFT = this.scene.input.keyboard.addKey(CKEYBOARD.LEFT);
		this.keyDOWN = this.scene.input.keyboard.addKey(CKEYBOARD.DOWN);
		this.keyRIGHT = this.scene.input.keyboard.addKey(CKEYBOARD.RIGHT);
		// PHYSICS
		this.getBody().setSize(26, 40);
		this.getBody().setOffset(2, 0);
		this.initAnimations();

		this.lastDirection = "";
		this.passDoorMutex = false;

		//console.log(this.scene.input.gamepad.total != 0)
		if (this.scene.input.gamepad.total !== 0){
        	this.hasPad = true;
			this.pad = this.scene.input.gamepad.gamepads[0]
			console.log("y'a un pad")
    	}else{
			this.hasPad = false;
			this.pad = this.scene.input.gamepad.gamepads[0]
		}
	}

	public getHasPad(){
		return this.hasPad
	}

	public getPad(){
		return this.pad
	}

	update(): void {

		let axisX;
		let axisY;
		if (this.scene.input.gamepad.total !== 0){
        	this.hasPad = true;
			this.pad = this.scene.input.gamepad.gamepads[0]
			axisX = this.pad.axes[0]
			axisY = this.pad.axes[1]
		
    	}else{
			this.hasPad = false;
			this.pad = this.scene.input.gamepad.gamepads[0]
			axisX = null;
			axisY = null;
		}

		this.getBody().setVelocity(0);
		if ((this.keyUP?.isDown || (this.hasPad && axisY !== null && axisY.getValue() < 0)) && !this.passDoorMutex) {
		//if (this.keyUP?.isDown){
			this.body.velocity.y = -130;
			this.getBody().setOffset(2, 0);
			//this.hpValue.setText("UP");
			this.lastDirection = "UP";
			!this.anims.isPlaying && this.anims.play(CASSETS.ANIMATIONS.PLAYER_MOVE_UP, true);
		}
		if ((this.keyLEFT?.isDown || (this.hasPad && axisX !== null && axisX.getValue() < 0)) && !this.passDoorMutex) {
		//if (this.keyLEFT?.isDown ) {
			this.body.velocity.x = -130;
			//this.checkFlip();
			this.getBody().setOffset(0, 0);
			this.lastDirection = "LEFT";
			//this.hpValue.setText("LEFT");

			!this.anims.isPlaying && this.anims.play(CASSETS.ANIMATIONS.PLAYER_MOVE_LEFT, true);
		}
		if ((this.keyDOWN?.isDown || (this.hasPad && axisY !== null && axisY.getValue() > 0)) && !this.passDoorMutex) {
		//if (this.keyDOWN?.isDown ) {
			this.body.velocity.y = 130;
			this.getBody().setOffset(2, 0);
			this.lastDirection = "DOWN";
			!this.anims.isPlaying && this.anims.play(CASSETS.ANIMATIONS.PLAYER_MOVE_DOWN, true);
		}
		if ((this.keyRIGHT?.isDown || (this.hasPad && axisX !== null && axisX.getValue() > 0)) && !this.passDoorMutex) {
		//if (this.keyRIGHT?.isDown ) {
			this.body.velocity.x = 130;
			//this.checkFlip();
			this.getBody().setOffset(-2, 0);
			this.lastDirection = "RIGHT";
			!this.anims.isPlaying && this.anims.play(CASSETS.ANIMATIONS.PLAYER_MOVE_RIGHT, true);
		}
  }
  
	private initAnimations(): void {
		this.scene.anims.create({
			key: CASSETS.ANIMATIONS.PLAYER_MOVE_LEFT,
			frames: this.scene.anims.generateFrameNames(CASSETS.ATLAS_PLAYER, {
				prefix: CASSETS.ANIMATIONS.PLAYER_MOVE_LEFT + '-',
				start:1,
				end: 2,
			}),
			frameRate: 10,
		});
		this.scene.anims.create({
			key: CASSETS.ANIMATIONS.PLAYER_MOVE_RIGHT,
			frames: this.scene.anims.generateFrameNames(CASSETS.ATLAS_PLAYER, {
				prefix: CASSETS.ANIMATIONS.PLAYER_MOVE_RIGHT + '-',
				start:1,
				end: 2,
			}),
			frameRate: 10,
		});
		this.scene.anims.create({
			key: CASSETS.ANIMATIONS.PLAYER_MOVE_DOWN,
			frames: this.scene.anims.generateFrameNames(CASSETS.ATLAS_PLAYER, {
				prefix: CASSETS.ANIMATIONS.PLAYER_MOVE_DOWN + '-',
				start:1,
				end: 2,
			}),
			frameRate: 10,
		});
		this.scene.anims.create({
			key: CASSETS.ANIMATIONS.PLAYER_MOVE_UP,
			frames: this.scene.anims.generateFrameNames(CASSETS.ATLAS_PLAYER, {
				prefix: CASSETS.ANIMATIONS.PLAYER_MOVE_UP + '-',
				start:1,
				end: 2,
			}),
			frameRate: 10,
		});
	}

	passDoor() : void{
		this.body.velocity.y = 0;
		this.body.velocity.x = 0;
		this.passDoorMutex = true;

		if(this.lastDirection == "DOWN"){
			this.body.position.y = this.body.position.y + 50;
		}
		if(this.lastDirection == "UP"){
			this.body.position.y = this.body.position.y - 50;
		}
		if(this.lastDirection == "RIGHT"){
			this.body.position.x = this.body.position.x + 10;
		}
		if(this.lastDirection == "LEFT"){
			this.body.position.x = this.body.position.x - 10;
		}
		this.passDoorMutex = false;
	}


}