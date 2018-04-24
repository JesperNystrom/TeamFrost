var config = {
    type: Phaser.AUTO,
    width: 1137,
    height: 640,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    }
};

var states;
var fallBuffert;
var cursors;
var layer;
var tileset;
var player;
var platforms;
var map;
var spacefield;
var backgroundv;
var game = new Phaser.Game(config);

function preload() {
    this.load.spritesheet('playerRun', '../sprites/PlayerRun.png',
        { frameWidth: 128, frameHeight: 140 });
    this.load.spritesheet('playerIdle', '../sprites/PlayerIdle.png',
        { frameWidth: 128, frameHeight: 140 });
    this.load.spritesheet('playerHeavyAttack', '../sprites/PlayerHeavyAtk.png',
        { frameWidth: 217, frameHeight: 187 });
    this.load.spritesheet('playerLightAttack', '../sprites/PlayerLightAttack.png',
        { frameWidth: 216, frameHeight: 135 });
    this.load.spritesheet('playerGlide', '../sprites/PlayerGlide.png',
        { frameWidth: 199, frameHeight: 168 });
    this.load.spritesheet('playerJump', '../sprites/PlayerJump.png',
        { frameWidth: 128, frameHeight: 140 });
    this.load.spritesheet('playerFall', '../sprites/PlayerFall.png',
        { frameWidth: 128, frameHeight: 150 });
    this.load.spritesheet('playerWallGlide', '../sprites/PlayerWallGlide.png',
        { frameWidth: 129, frameHeight: 210 });    


    this.load.image('dirtGrass', '../sprites/ground.png');
    this.load.image('background','../sprites/testBackground.png');
    //LOAD TERRAIN
    this.load.image('tiles', '../sprites/allTiles.png');
    this.load.tilemapCSV('map', '../maps/TutLevel.csv');

}

function create() {
    spacefield = this.add.tileSprite(0,0,1137,640,'background');
    backgroundv = -5;



    //FloorCounter
    fallBuffert = 25;

    //Creating Map
    map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });
    var tileset = map.addTilesetImage('tiles');
    var layer = map.createStaticLayer(0, tileset, 0, -1000);

    map.setCollisionBetween(0, 15);

    //Make player a phys object and player/platforms collide
    player = this.physics.add.sprite(200, 200, 'playerRun');
    player.body.setSize(64, 138)
    this.physics.add.collider(player, layer);

    //"Key listener"
    cursors = game.input.keyboard.createCursorKeys();
    key_X = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    key_Z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    key_jump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


    //Camera
    this.cameras.main.setSize(1137, 640);
    //this.cameras.add(400,0);
    this.cameras.main.startFollow(player);




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

    this.anims.create({
        key: 'glide',
        frames: this.anims.generateFrameNumbers('playerGlide', { start: 0, end: 4 }),
        frameRate: 20,
        repeat: 1
    });

    this.anims.create({
        key: 'wallGlide',
        frames: this.anims.generateFrameNumbers('playerWallGlide', { start: 0, end: 4 }),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('playerJump', { start: 0, end: 1 }),
        frameRate: 20,
        repeat: 1
    });

    this.anims.create({
        key: 'fall',
        frames: this.anims.generateFrameNumbers('playerFall', { start: 0, end: 1 }),
        frameRate: 20,
        repeat: 1
    });
}

function update() {
    spacefield.x = player.x;
    spacefield.y = player.y;
    spacefield.tilePositionY += backgroundv;

    if (!player.body.onFloor()) {
        fallBuffert--;
    } else if (player.body.onFloor()) {
        fallBuffert = 25;
    }


    //Plays animation'
    switch (states) {
        case 'glide':
        player.anims.play('glide', true);
        player.originX = 0.8;
        player.originY = 0.58;
        break;
        case 'wallGlide':
        player.anims.play('wallGlide', true);
        break;
        case 'run' :
        player.anims.play('run', true);
        player.originX = 0.5;
        player.originY = 0.5;
        break;
        case 'lightAttack':
        player.anims.play('lightAttack', true);
        break;
        case 'heavyAttack':
        player.anims.play('heavyAttack', true);
        break;
        case 'jump':
        player.anims.play('jump', true);
        player.originX = 0.5;
        break;
        case 'fall':
        player.anims.play('fall', true);
        break;
        default:
        player.anims.play('idle', true);
    }



    if (cursors.down.isDown && fallBuffert > 0) {
        states = 'glide';
        player.originY = 0.58;
        if (player.flipX) {
            player.setVelocityX(-900)
            player.originX = 0.2;
        } else {
            player.setVelocityX(900)
            player.originX = 0.8;
        }

    } else if (cursors.left.isDown) {
        player.setVelocityX(-260);

        if (player.body.onFloor())
        states = 'run';

        player.flipX = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(260);
        player.flipX = false;
        if (player.body.onFloor()){
            states = 'run';
        }

    } else {
        player.originX = 0.5;
        player.originY = 0.5;
        player.setVelocityX(0);
        states = 4;
    }
    if (key_Z.isDown && !cursors.down.isDown){
        player.originY = 0.5;
        if(player.flipX){
            player.originX = 0.7;
        } else {
            player.originX = 0.3;
        }
        states = 'lightAttack';
    }

    if (key_X.isDown && !cursors.down.isDown){
        player.originY = 0.62;
        if(player.flipX){
            player.originX = 0.7;
        } else {
            player.originX = 0.3;
        }
        states = 'heavyAttack';
    }

    if (key_jump.isDown && player.body.onFloor()) {
        player.setVelocityY(-400);
        if (player.body.velocity.y < 0 && player.body.velocity.x !=0)
            states = 'jump';
        fallBuffert = 0;
    }

    if (player.body.velocity.y > 0 && !key_X.isDown && !key_Z.isDown) {
       states = 'fall';
    }
    if (player.body.velocity.y < 0 && !cursors.up.isDown) {
        states = 'jump';
     }

    if(player.body.velocity.y < 0){
        states = 'jump';
    }
    if(cursors.up.isDown && player.body.onWall()){
        if(player.flipX){
        player.originX = 0.3;
        } else {
            player.originX = 0.7; 
        }
        states = 'wallGlide';
        player.setVelocityY(-400);
    }
    console.log(states)
}