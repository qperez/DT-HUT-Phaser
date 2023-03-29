import { GameObjects, Physics, Scene, Tilemaps } from 'phaser';
import { CASSETS } from '../constants/CASSETS';
import { Player } from '../game-objects/Player';
import { Text } from '../game-objects/Text';
import { AjaxRequestSender } from '../helpers/AjaxRequestSender';

import $, { Callbacks } from "jquery";
import { EffectorObject } from '../game-objects/EffectorObject';

type ObjectPoint = {
	height: number;
	id: number;
	name: string;
	point: boolean;
	rotation: number;
	type: string;
	visible: boolean;
	width: number;
	x: number;
	y: number;
};


export const gameObjectsToObjectPoints = (gameObjects: unknown[]): ObjectPoint[] => {
	return gameObjects.map(gameObject => gameObject as ObjectPoint);
};


export class Level1 extends Scene {
	private player!: Player;

	private map!: Tilemaps.Tilemap;

	private tilesets!: Phaser.Tilemaps.Tileset[];
	// private layers! : Phaser.Tilemaps.TilemapLayer[];

	private floorLayer!: Phaser.Tilemaps.TilemapLayer;
	private carpetsLayer!: Phaser.Tilemaps.TilemapLayer;
	private wallsLayer!: Phaser.Tilemaps.TilemapLayer;
	private doorsLayer!: Phaser.Tilemaps.TilemapLayer;
	private staticObjectsLayer!: Tilemaps.TilemapLayer;
	private objectsOnstaticObjectsLayer!: Tilemaps.TilemapLayer;

	private lamps!: EffectorObject[];
	private lampGroup!: Phaser.Physics.Arcade.Group;
	private smartPlugs!: EffectorObject[];
	private smartPlugGroup!: Phaser.Physics.Arcade.Group;
	private smartDoors!: EffectorObject[];
	private smartDoorGroup!: Phaser.Physics.Arcade.Group;
	private computers!: Phaser.GameObjects.Sprite[];
	private computerGroup!: Phaser.Physics.Arcade.Group;
	private doors!: Phaser.GameObjects.Sprite[];
	private doorGroup!: Phaser.Physics.Arcade.Group;

	private toggleLamp!: Boolean;
	private toggleSmartPlug!: Boolean;
	private toggleComputer!: Boolean;
	private toggleSmartDoor!: Boolean;

	private colorControlValues! : number[];

	private triggerTimer!: Phaser.Time.TimerEvent;

	private timeEventClickPad! : Boolean;


	constructor() {
		super('Level1');
	}

	create() {
		console.log('Loading scene level1 was created');
		this.initMap();
		this.player = new Player(this, 400, 500);
		this.physics.add.collider(this.player, this.wallsLayer);

		this.lamps = [];
		this.smartPlugs = [];
		this.smartDoors = [];
		this.computers = [];
		this.colorControlValues = [];
		
		this.lampGroup = this.physics.add.group({
			classType: Physics.Arcade.Sprite,
			immovable: true
		});
		this.computerGroup = this.physics.add.group({
			classType: Physics.Arcade.Sprite,
			immovable: true
		});
		this.doorGroup = this.physics.add.group({
			classType: Physics.Arcade.Sprite,
			immovable: true
		});
		this.smartPlugGroup = this.physics.add.group({
			classType: Physics.Arcade.Sprite,
			immovable: true
		});
		this.smartDoorGroup = this.physics.add.group({
			classType: Physics.Arcade.Sprite,
			immovable: true
		});
		this.toggleLamp = false;
		this.toggleComputer = false;
		this.toggleSmartPlug = false;
		this.toggleSmartDoor = false;


		this.initColliderSmartObjects('lamps', 'lamp', this.lamps, this.lampGroup, 0);
		this.initColliderObjects('doors','door', this.doors, this.doorGroup, 1);
		this.initColliderObjects('computers','computer_point', this.computers, this.computerGroup, 2);
		this.initColliderSmartObjects('smart_plugs', 'smart_plug', this.smartPlugs, this.smartPlugGroup, 3);
		this.initColliderSmartObjects('smart_doors', 'smart_door', this.smartDoors, this.smartDoorGroup, 4);
		//this.initColliderObjects('ext_doors', 'ext_door', this.extDoors, this.extDoorGroup, 5);

		this.initCamera();

		this.triggerTimer = this.time.addEvent({
            callback: this.updateStateObjects,
            callbackScope: this,
            delay: 3000, // 1000 = 1 second
            loop: true
        });

		this.timeEventClickPad = false;
	}

	update(): void {
		
		this.player.update();

		let lampOverlaped = this.checkOverlapEffectorObject(this.player, this.lampGroup);
		if (lampOverlaped) {
			let lampEffectorObject = lampOverlaped as EffectorObject
			let OH_ID = lampEffectorObject.name.split('lamp_')[1]

			if (!this.toggleLamp) {
				this.cameras.main.flash();
				AjaxRequestSender.sendRequestToggleLampAndPlug(lampEffectorObject, OH_ID, "0");
			}

			let $iframe = $('#openhab');
			let currentUrlIframe = (document.getElementById('openhab') as HTMLIFrameElement).src;
			if(currentUrlIframe != "http://localhost:8080/page/page_5b4a2ac473"){
				$iframe.attr('src', "http://localhost:8080/page/page_5b4a2ac473");
			}

			if(this.player.getHasPad()){
				let pad = this.player.getPad();
				let buttonA = pad.buttons[2];
				let buttonB = pad.buttons[1];
				let buttonX = pad.buttons[3];

				let buttonZR = pad.buttons[7];
				let buttonZL = pad.buttons[6];


				//let buttonA = pad.buttons[0];
				//let buttonB = pad.buttons[2];
				//let buttonX = pad.buttons[1];

				//let buttonZR = pad.buttons[5];
				//let buttonZL = pad.buttons[4];

				let currentColorControlValues = this.colorControlValues;

				if(!this.timeEventClickPad && buttonA.value > 0 && buttonZR.value > 0 && currentColorControlValues && currentColorControlValues[2] < 100){
					this.setClickPadTrue()
					currentColorControlValues[2] += 5;
					$.when(AjaxRequestSender.postStateObject("ZWaveNode003RGBWE2RGBWBulbV2_ColorControl",",," + currentColorControlValues[2])).then(this.setClickPadTrue);

					this.time.addEvent({
						callback: this.setClickPadFalse,
						callbackScope: this,
						delay: 200, // 1000 = 1 second
					});
				}

				if(!this.timeEventClickPad && buttonA.value > 0 && buttonZL.value > 0 && currentColorControlValues && currentColorControlValues[2] >= 0){
					this.setClickPadTrue()
					currentColorControlValues[2] -= 5;
					$.when(AjaxRequestSender.postStateObject("ZWaveNode003RGBWE2RGBWBulbV2_ColorControl",",," + currentColorControlValues[2])).then(this.setClickPadTrue);

					this.time.addEvent({
						callback: this.setClickPadFalse,
						callbackScope: this,
						delay: 200, // 1000 = 1 second
					});
				}

				if(!this.timeEventClickPad && buttonB.value > 0 && buttonZR.value > 0 && currentColorControlValues && currentColorControlValues[2] < 360){
					this.setClickPadTrue()
					currentColorControlValues[1] += 10;
					$.when(AjaxRequestSender.postStateObject("ZWaveNode003RGBWE2RGBWBulbV2_ColorControl", currentColorControlValues[0]+"," + currentColorControlValues[1]+ ","+ currentColorControlValues[2])).then(this.setClickPadTrue);

					this.time.addEvent({
						callback: this.setClickPadFalse,
						callbackScope: this,
						delay: 200, // 1000 = 1 second
					});
				}

				if(!this.timeEventClickPad && buttonB.value > 0 && buttonZL.value > 0 && currentColorControlValues && currentColorControlValues[2] >= 0){
					this.setClickPadTrue()
					currentColorControlValues[1] -= 10;
					$.when(AjaxRequestSender.postStateObject("ZWaveNode003RGBWE2RGBWBulbV2_ColorControl",currentColorControlValues[0]+"," + currentColorControlValues[1]+ ","+ currentColorControlValues[2])).then(this.setClickPadTrue);

					this.time.addEvent({
						callback: this.setClickPadFalse,
						callbackScope: this,
						delay: 200, // 1000 = 1 second
					});
				}

				if(!this.timeEventClickPad && buttonX.value > 0 && buttonZR.value > 0 && currentColorControlValues && currentColorControlValues[0] < 100){
					this.setClickPadTrue()
					currentColorControlValues[0] += 5;
					$.when(AjaxRequestSender.postStateObject("ZWaveNode003RGBWE2RGBWBulbV2_ColorControl", currentColorControlValues[0]+"," + currentColorControlValues[1]+ ","+ currentColorControlValues[2])).then(this.setClickPadTrue);

					this.time.addEvent({
						callback: this.setClickPadFalse,
						callbackScope: this,
						delay: 200, // 1000 = 1 second
					});
				}

				if(!this.timeEventClickPad && buttonX.value > 0 && buttonZL.value > 0 && currentColorControlValues && currentColorControlValues[0] >= 0){
					this.setClickPadTrue()
					currentColorControlValues[0] -= 5;
					$.when(AjaxRequestSender.postStateObject("ZWaveNode003RGBWE2RGBWBulbV2_ColorControl",currentColorControlValues[0]+"," + currentColorControlValues[1]+ ","+ currentColorControlValues[2])).then(this.setClickPadTrue);

					this.time.addEvent({
						callback: this.setClickPadFalse,
						callbackScope: this,
						delay: 200, // 1000 = 1 second
					});
				}
			}

			this.toggleLamp = true;
		}
		if (!this.checkOverlapEffectorObject(this.player, this.lampGroup)) {
			//console.log('NOT INTERSECT');
			this.toggleLamp = false;
		}

		let smartPlugOverlaped = this.checkOverlapEffectorObject(this.player, this.smartPlugGroup);
		if (smartPlugOverlaped) {
			if (!this.toggleSmartPlug) {
				console.log(this.toggleSmartPlug);
				this.cameras.main.flash();
				let smartPlugObject = smartPlugOverlaped as EffectorObject
				smartPlugObject.getTextObject().setText("ON")
				let OH_ID = smartPlugObject.name.split('smart_plug_')[1]

				AjaxRequestSender.sendRequestToggleLampAndPlug(smartPlugObject, OH_ID, "OFF");

				let $iframe = $('#openhab');
				let currentUrlIframe = (document.getElementById('openhab') as HTMLIFrameElement).src;
				if(currentUrlIframe != "http://localhost:8080/page/page_1b590db342"){
					$iframe.attr('src', "http://localhost:8080/page/page_1b590db342");
				}
			}
			this.toggleSmartPlug = true;
		}

		if (!this.checkOverlapEffectorObject(this.player, this.smartPlugGroup)) {
			//console.log('NOT INTERSECT');
			this.toggleSmartPlug = false;
		}

		let smartDoorOverlaped = this.checkOverlapEffectorObject(this.player, this.smartDoorGroup);
		if (smartDoorOverlaped) {
			if (!this.toggleSmartDoor) {
				this.cameras.main.flash();
				let smartPlugObject = smartDoorOverlaped as EffectorObject
				let OH_ID = smartPlugObject.name.split('smart_door_')[1]

				let $iframe = $('#openhab');
				let currentUrlIframe = (document.getElementById('openhab') as HTMLIFrameElement).src;
				if(currentUrlIframe != "http://localhost:8080/page/page_hall"){
					$iframe.attr('src', "http://localhost:8080/page/page_hall");
				}
				
				this.scene.start('SceneLivingLabIMTAtlantique');

				//AjaxRequestSender.sendRequestToggleLampAndPlug(smartPlugObject, OH_ID, "OFF");
			}
			this.toggleSmartDoor = true;
		}

		if (!this.checkOverlapEffectorObject(this.player, this.smartDoorGroup)) {
			this.toggleSmartDoor = false;
		}

		if (!this.checkOverlapGameObjectGroup(this.player, this.computerGroup)) {
			if (this.toggleComputer) {
				let $iframe = $('#openhab');
				console.log('overlap computer');
				$iframe.attr('src', "http://localhost:8080/page/page_5b4a2ac473");
			}
			this.toggleComputer = false;
		}


		if(!this.checkOverlapEffectorObject(this.player, this.smartDoorGroup) &&
			!this.checkOverlapEffectorObject(this.player, this.smartPlugGroup) &&
			!this.checkOverlapEffectorObject(this.player, this.lampGroup) &&
			!this.checkOverlapGameObjectGroup(this.player, this.computerGroup)){
				let $iframe = $('#openhab');
				let currentUrlIframe = (document.getElementById('openhab') as HTMLIFrameElement).src;
				if(currentUrlIframe != "http://localhost:8080/"){
					$iframe.attr('src', "http://localhost:8080/");
				}
		}

		if (this.checkOverlapGameObjectGroup(this.player, this.doorGroup)) {
			console.log('overlap door');
			this.cameras.main.flash();
			this.player.passDoor();
		}
	}

	public setClickPadTrue(){
		this.timeEventClickPad = true;
	}

	public setClickPadFalse(){
		this.timeEventClickPad = false;
	}

	private updateStateObjects(){
		if(!this.toggleSmartPlug && !this.toggleSmartPlug){
			this.smartPlugGroup.getChildren().forEach(smartPlug => {
				let smartPlugEffectorObject = smartPlug as EffectorObject
				let OH_ID = smartPlugEffectorObject.name.split('smart_plug_')[1];
				if(OH_ID){
					AjaxRequestSender.updateTextWithStateObject(smartPlugEffectorObject, OH_ID, "OFF", "OFF", "ON")
				}
			});

			this.lampGroup.getChildren().forEach(lamp => {
				let lampEffectorObject = lamp as EffectorObject
				let OH_ID = lampEffectorObject.name.split('lamp_')[1];
				if(OH_ID){
					AjaxRequestSender.updateTextWithStateObject(lampEffectorObject, OH_ID, "0", "OFF", "ON")
				}
			});

			this.smartDoorGroup.getChildren().forEach(door => {
				let doorEffectorObject = door as EffectorObject
				let OH_ID = doorEffectorObject.name.split('smart_door_')[1];
				if(OH_ID){
					AjaxRequestSender.updateTextWithStateObject(doorEffectorObject, OH_ID, "CLOSED", "CLOSED", "OPEN")
				}
			});

			this.colorControlValues = [];
			var vals : number[] = [];
			this.ajax().done(function(result){
				let state = result["state"];
				let data = (state as string).split(',').map(Number)
				for (var i = 0, len = data.length; i < len; i++) {
				 		vals[i] = data[i];
				}
			})
			console.log(vals)
			this.colorControlValues = vals
		}
	}

	public ajax() {
		return $.ajax({
			headers: {
				Accept: "*/*",
			},
			crossDomain: true,
			type: 'GET',
			url: 'http://localhost:8080/rest/items/ZWaveNode003RGBWE2RGBWBulbV2_ColorControl?recursive=false',
			success: function (json_response) {}
		})
	}
	

	private initMap(): void {
		this.map = this.make.tilemap({ key: 'map_hut', tileWidth: 32, tileHeight: 32 });

		//add tilesets to map
		this.tilesets = []

		Object.entries(CASSETS.TILESETS).forEach(
			([key]) => this.tilesets.push(this.map.addTilesetImage(key, key))
		);

		this.floorLayer = this.map.createLayer('floor', this.tilesets);
		this.carpetsLayer = this.map.createLayer('carpets', this.tilesets);
		this.wallsLayer = this.map.createLayer('wall', this.tilesets);
		this.doorsLayer = this.map.createLayer('doors', this.tilesets);
		this.staticObjectsLayer = this.map.createLayer('static_objects', this.tilesets);
		this.objectsOnstaticObjectsLayer = this.map.createLayer('objects_on_static_objects', this.tilesets);

		this.wallsLayer.setCollisionByProperty({
			collides: true
		});

		this.staticObjectsLayer.setCollisionByProperty({
			collides: true
		});

		this.physics.world.setBounds(32, 32, this.wallsLayer.width - (32 * 2), this.wallsLayer.height - (32 * 2));
		this.physics.world.setBounds(32, 32, this.staticObjectsLayer.width, this.staticObjectsLayer.height);
	}

	private initCamera(): void {
		this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
		this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
		this.cameras.main.setZoom(1);
	}

	private initColliderSmartObjects(layerObjectName : string, objectNamePrefix: string, 
		sprites: EffectorObject[], group: Phaser.Physics.Arcade.Group, frame: number): void {


		const objectPoints = gameObjectsToObjectPoints(
			this.map.filterObjects(layerObjectName, obj => obj.name.includes(objectNamePrefix)),
		);

		sprites = objectPoints.map(objectPoint =>
			new EffectorObject(this, objectPoint.x, objectPoint.y, "OFF", objectPoint.name, 'tiles_spr', frame).setScale(1.2),
			//this.physics.add.sprite(chestPoint.x, chestPoint.y, 'tiles_spr', 0).setScale(1.2),
		);

		sprites.forEach(chest => {
			group.add(chest, true);
		});
		this.physics.add.overlap(this.player, group);
	}

	private initColliderObjects(layerObjectName : string, objectNamePrefix: string, 
		sprites: Phaser.GameObjects.Sprite[], group: Phaser.Physics.Arcade.Group, frame: number): void {

		const objectPoints = gameObjectsToObjectPoints(
			this.map.filterObjects(layerObjectName, obj => obj.name.includes(objectNamePrefix)),
		);

		sprites = objectPoints.map(objectPoint =>
			this.physics.add.sprite(objectPoint.x, objectPoint.y, 'tiles_spr', frame).setScale(1.2),
		);

		sprites.forEach(chest => {
			group.add(chest, true);
		});
		this.physics.add.overlap(this.player, group);
	}

	checkOverlapEffectorObject(obj1: Phaser.GameObjects.GameObject, objectsGroup: Phaser.GameObjects.Group) {
		const spriteA = obj1 as Player;
		let boundsA = spriteA.getBounds();
		let effectorObjectIntersected = null

		objectsGroup.getChildren().forEach(ef => {
			let object = ef as EffectorObject;
			let boundsB = object.getBounds();
			if (!Phaser.Geom.Intersects.GetRectangleIntersection(boundsA, boundsB).isEmpty()) {
				effectorObjectIntersected = object
			}
		})
		return effectorObjectIntersected;
	}

	checkOverlapGameObjectGroup(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.Group) {
		let intersect = false;
		const spriteA = obj1 as Player;
		var boundsA = spriteA.getBounds();

		obj2.getChildren().forEach(el => {
			const lamp = el as Phaser.GameObjects.Sprite;
			var boundsB = lamp.getBounds();
			if (!Phaser.Geom.Intersects.GetRectangleIntersection(boundsA, boundsB).isEmpty()) {
				intersect = true;
			}
		})

		return intersect;
	}
}