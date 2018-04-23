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
 
 var cursors;
 var layer;
 var tileset;
 var player;
 var platforms;
 var map;
 var game = new Phaser.Game(config);
 
 function preload (){
    this.load.spritesheet('playerRun', '../sprites/PlayerRun.png',
        { frameWidth:128, frameHeight:140});
    this.load.spritesheet('playerIdle', '../sprites/PlayerIdle.png',
        { frameWidth:128, frameHeight:140});
    this.load.spritesheet('playerHeavyAttack', '../sprites/PlayerHeavyAtk.png',
        { frameWidth:217, frameHeight:187});
    this.load.spritesheet('playerLightAttack', '../sprites/PlayerLightAtk.png',
        { frameWidth:217, frameHeight:187});    
    
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

    //"Key listener"
    cursors = game.input.keyboard.createCursorKeys();

    //Animations for player
    this.anims.create({
        key: 'lightAttack',
        frames: this.anims.generateFrameNumbers('playerLightAttack', { start: 0, end: 9 }),
        frameRate: 20,
        repeat: 1
    });

    this.anims.create({
        key: 'heavyAttack',
        frames: this.anims.generateFrameNumbers('playerHeavyAttack', { start: 0, end: 9 }),
        frameRate: 20,
        repeat: 1
    });

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('playerRun', { start: 0, end: 19 }),
        frameRate: 20,
        repeat: 1
    });
    
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 19 }),
        frameRate: 20,
        repeat: 1
    });
 }
 
 function update (){
    //Plays animation
    if(cursors.down.isDown) {
        player.anims.play('heavyAttack', true);
    } else if(cursors.left.isDown) {
        player.setVelocityX(-260);
        player.anims.play('run', true);
        player.flipX=true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(260);
        player.anims.play('run', true);
        player.flipX=false;
    } else {
        player.setVelocityX(0);
        player.anims.play('idle', true);
    }
    if(cursors.up.isDown && player.body.onFloor()) {
        player.setVelocityY(-400);
    }

 }