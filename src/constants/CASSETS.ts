export const CASSETS = {
    TILESETS: 
        {
            'Room_Builder_32x32'            : 'assets/tilemaps/tiles/Room_Builder_32x32.png',
            '5_Classroom_and_library_32x32' : 'assets/tilemaps/tiles/5_Classroom_and_library_32x32.png',
            '4_Bedroom_32x32'               : 'assets/tilemaps/tiles/4_Bedroom_32x32.png',
            '3_Bathroom_32x32'              : 'assets/tilemaps/tiles/3_Bathroom_32x32.png',
            '12_Kitchen_32x32'              : 'assets/tilemaps/tiles/12_Kitchen_32x32.png',
            '2_LivingRoom_32x32'            : 'assets/tilemaps/tiles/2_LivingRoom_32x32.png',
            '1_Generic_32x32'               : 'assets/tilemaps/tiles/1_Generic_32x32.png',
            '8_Gym_32x32'                   : 'assets/tilemaps/tiles/8_Gym_32x32.png',
            '18_Jail_32x32'                 : 'assets/tilemaps/tiles/18_Jail_32x32.png'
        }
    ,
    ATLAS_PLAYER : 'a-player',
    IMAGES: {
        PLAYER: 'player',
    },
    ANIMATIONS: {
        PLAYER_MOVE_LEFT: 'run-left',
        PLAYER_MOVE_RIGHT: 'run-right',
        PLAYER_MOVE_UP: 'run-back',
        PLAYER_MOVE_DOWN: 'run-front',
        PLAYER_IDLE_UP: '',
        PLAYER_IDLE_DOWN: '',
        PLAYER_IDLE_SIDE: ''
    }
} as const;