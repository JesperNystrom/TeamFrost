var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    }
 };
 
 var layer;
 var tileset;
 var player;
 var platforms;
 var map;
 var game = new Phaser.Game(config);
 
 function preload (){
    this.load.spritesheet('playerRun', '../sprites/PlayerRun.png',
        { frameWidth:128, frameHeight:140});
    this.load.image('dirtGrass', '../sprites/ground.png');
    //LOAD TERRAIN
    this.load.image('tiles', '../sprites/allTiles.png');
    this.load.tilemapCSV('map', '../maps/TestMap2.csv');

 }
 
 function create (){
    map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });
    var tileset = map.addTilesetImage('tiles');
    var layer = map.createStaticLayer(0, tileset, 0, 500);

    map.setCollisionBetween(0,5);
    //Make player a phys object
    player = this.physics.add.sprite(200,200,'playerRun');
    //Makes player and platforms collide
    this.physics.add.collider(player, layer);

    //Animations for player
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('playerRun', { start: 0, end: 19 }),
        frameRate: 20,
        repeat: 1
    });

 }
 
 function update (){
    //Plays animation
 }