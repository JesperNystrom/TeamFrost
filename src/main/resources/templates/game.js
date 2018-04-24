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
            gravity: { y: 1000 },
            debug: false
        }
    }
};

var playerStatesEnum = {"attacking":true, "moving":true, "idle":true}
Object.freeze(playerStatesEnum);
var jumper;
var cursors;
var layer;
var tileset;
var player;
var platforms;
var map;
var game = new Phaser.Game(config);

function preload() {
    this.load.spritesheet('playerRun', '../sprites/PlayerRun.png',
        { frameWidth: 128, frameHeight: 140 });
    this.load.spritesheet('playerIdle', '../sprites/PlayerIdle.png',
        { frameWidth: 128, frameHeight: 140 });
    this.load.spritesheet('playerHeavyAttack', '../sprites/PlayerHeavyAtk.png',
        { frameWidth: 217, frameHeight: 187 });
    this.load.spritesheet('playerLightAttack', '../sprites/PlayerLightAtk.png',
        { frameWidth: 217, frameHeight: 187 });
    this.load.spritesheet('playerGlide', '../sprites/PlayerGlide.png',
        { frameWidth: 199, frameHeight: 168 });
    this.load.spritesheet('playerJump', '../sprites/PlayerJump.png',
        { frameWidth: 128, frameHeight: 140 });
    this.load.spritesheet('playerFall', '../sprites/PlayerFall.png',
        { frameWidth: 128, frameHeight: 150 });


    this.load.image('dirtGrass', '../sprites/ground.png');
    //LOAD TERRAIN
    this.load.image('tiles', '../sprites/allTiles.png');
    this.load.tilemapCSV('map', '../maps/TutLevel.csv');

}

function create() {

    //FloorCounter
    jumper = 25;

    //Creating Map
    map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });
    var tileset = map.addTilesetImage('tiles');
    var layer = map.createStaticLayer(0, tileset, 0, -1000);

    map.setCollisionBetween(0, 5);

    //Make player a phys object and player/platforms collide
    player = this.physics.add.sprite(200, 200, 'playerRun');
    this.physics.add.collider(player, layer);

    //"Key listener"
    cursors = game.input.keyboard.createCursorKeys();
    key_X = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    key_Z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

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
        repeat: 0
    });

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('playerRun', { start: 0, end: 19 }),
        frameRate: 20,
        repeat: -19
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

    if (!player.body.onFloor()) {
        jumper--;
    } else if (player.body.onFloor()) {
        jumper = 25;
    }

    //Plays animation
    if (cursors.down.isDown && jumper > 0) {
        player.anims.play('glide', true);
        if (player.flipX == false) {
            player.setVelocityX(400)
        } else {
            player.setVelocityX(-400)
        }
    } else if (cursors.left.isDown) {
        player.setVelocityX(-260);

        if (player.body.onFloor())
            player.anims.play('run', true);

        player.flipX = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(260);
        player.flipX = false;
        if (player.body.onFloor()){
            player.anims.play('run', true);
        }
    } else {
        player.setVelocityX(0);
    }

    if (key_X.isDown){
        player.anims.play('heavyAttack', true);
    }

    if (cursors.up.isDown && player.body.onFloor()) {
        player.setVelocityY(-400);
        if (player.body.velocity.y < 0 && player.body.velocity.x !=0)
            player.anims.play('jump', true);
        jumper = 0;
    }
    if (player.body.velocity.y > 200) {
        player.anims.play('fall', true);
    }
    if(player.body.velocity.x == 0 && player.body.velocity.y == 0){
        player.anims.play('idle', true);
    }
}