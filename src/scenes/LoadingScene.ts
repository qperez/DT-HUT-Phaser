import { GameObjects, Scene } from 'phaser';
import { CASSETS } from '../constants/CASSETS';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }
	protected preload() {
		this.load.image(CASSETS.IMAGES.PLAYER, 'assets/sprites/player.png');
		this.load.atlas(CASSETS.ATLAS_PLAYER, 'assets/spritesheets/sprites_woman.png', 'assets/spritesheets/sprites_map.json');
		this.load.tilemapTiledJSON('map_hut', 'assets/tilemaps/json/hut_map.json');
		this.load.tilemapTiledJSON('map_experimenthaal', 'assets/tilemaps/json/experimenthaal_map.json');


		Object.entries(CASSETS.TILESETS).forEach(
			([key, value]) => this.load.image({
				key: key,
				url: value,
			})
		);

		
		this.load.spritesheet('tiles_spr', 'assets/tilemaps/tiles/4_Bedroom_32x32.png', {
			frameWidth: 32,
			frameHeight: 32,
		});
	}
	
	protected create() {
		console.log('Loading scene was created');
		this.scene.start('Level1');
	}
}