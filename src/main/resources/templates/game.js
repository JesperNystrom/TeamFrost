var config = {
    type: Phaser.AUTO,
    width: 1137,
    height: 640,
    input: {
        gamepad: true
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    }
};

var gamepad;
var states;
var fallBuffert;
var timer;
var count = 0;
var cursors;
var layer;
var tileset;
var player;
var weaponHitBox;
var enemies;
var map;
var spacefield;
var backgroundv;
var timedEvent;
var game = new Phaser.Game(config);

function preload() {
    //Player sprites
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

    //Enemy sprites
    this.load.spritesheet('enemyGhost', '../sprites/EnemyGhost.png',
        { frameWidth: 64, frameHeight: 100 });


    this.load.image('dirtGrass', '../sprites/ground.png');
    this.load.image('background', '../sprites/testBackground.png');
    //LOAD TERRAIN
    this.load.image('tiles', '../sprites/allTiles.png');
    this.load.tilemapCSV('map', '../maps/GlideLevel.csv');

    //Weapon hitbox
    this.load.image('weaponHitBox', '../sprites/WeaponHitBoxTest.png')
}

function create() {

    //Background
    spacefield = this.add.tileSprite(0, 0, 1137, 640, 'background');
    backgroundv = -2;

    //FloorCounter
    fallBuffert = 25;

    //Creating Map
    map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });
    var tileset = map.addTilesetImage('tiles');
    var layer = map.createStaticLayer(0, tileset, 0, -50);

    //Tile collision
    map.setCollisionBetween(0, 15);
    weaponHitBox = this.physics.add.staticGroup();

    //Make player a phys object and player/platforms/enemies collide
    player = this.physics.add.sprite(200, 200, 'playerRun');
    player.body.setSize(64, 138);

    //Create enemies
    enemies = this.physics.add.group();
    enemies.create(400,200, 'enemyGhost');
    enemies.create(500,200, 'enemyGhost');
    //enemies.body.setSize(64, 90);

    //this.physics.add.collider(player, layer);
    this.physics.add.collider(player, layer);
    this.physics.add.collider(enemies, layer);
    //this.physics.add.collider(player, enemies);
    this.physics.add.overlap(weaponHitBox,enemies,checkOverlap,null,this);


    
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

    //GAMEPAD TESTING
    config = Phaser.Input.Gamepad.Configs.DUALSHOCK_4;
    this.input.gamepad.on('down', function (pad, button, value, data) {
        gamepad = pad;
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
        case 'run':
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

    //CONTROLS
    if (cursors.down.isDown && fallBuffert > 0) {
        states = 'glide';
        player.originY = 0.58;
        if (player.flipX) {
            player.setVelocityX(-650)
            player.originX = 0.2;
        } else {
            player.setVelocityX(650)
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
        if (player.body.onFloor()) {
            states = 'run';
        }

    } else {
        player.originX = 0.5;
        player.originY = 0.5;
        player.setVelocityX(0);
        states = 4;
    }
    if (key_Z.isDown && !cursors.down.isDown) {
        player.originY = 0.5;
        if (player.flipX) {
            timedEvent = this.time.addEvent({
                delay: 0, callback: onEvent,
                callbackScope: this, repeat: 0, startAt: 0
            });
            //this.physics.add.collider(weaponHitBox, enemies);
            player.originX = 0.7;
        } else {
            timedEvent = this.time.addEvent({
                delay: 0, callback: onEvent,
                callbackScope: this, repeat: 0, startAt: 0
            });
            player.originX = 0.3;
            //this.physics.add.collider(weaponHitBox, enemies);
        }
        states = 'lightAttack';
    }

    if (key_X.isDown && !cursors.down.isDown) {
        player.originY = 0.62;
        if (player.flipX) {
            timedEvent = this.time.addEvent({
                delay: 0, callback: onEvent,
                callbackScope: this, repeat: 0, startAt: 0
            });
            //this.physics.add.collider(weaponHitBox, enemies);
            player.originX = 0.7;
        } else {
            timedEvent = this.time.addEvent({
                delay: 0, callback: onEvent,
                callbackScope: this, repeat: 0, startAt: 0
            });
            //this.physics.add.collider(weaponHitBox, enemies);
            player.originX = 0.3;
        }
        states = 'heavyAttack';

    }

    if (key_jump.isDown && player.body.onFloor()) {
        player.setVelocityY(-400);
        if (player.body.velocity.y < 0 && player.body.velocity.x != 0)
            states = 'jump';
        fallBuffert = 0;
    }

    if (player.body.velocity.y > 0 && !key_X.isDown && !key_Z.isDown) {
        states = 'fall';
    }
    if (player.body.velocity.y < 0 && !cursors.up.isDown) {
        states = 'jump';
    }
    if (player.body.velocity.y < 0) {
        states = 'jump';
    }
    if (cursors.up.isDown && player.body.onWall()) {
        if (player.flipX) {
            player.originX = 0.3;
        } else {
            player.originX = 0.7;
        }
        states = 'wallGlide';
        player.setVelocityY(-400);
    }
    //GAMEPAD CONTROLS
    if (gamepad) {
        if (gamepad.buttons[config.R1].pressed && fallBuffert > 0) {
            states = 'glide';
            player.originY = 0.58;
            if (player.flipX) {
                player.setVelocityX(-650)
                player.originX = 0.2;
            } else {
                player.setVelocityX(650)
                player.originX = 0.8;
            }

        } else if (gamepad.buttons[config.LEFT].pressed) {
            player.setVelocityX(-260);

            if (player.body.onFloor())
                states = 'run';

            player.flipX = true;
        } else if (gamepad.buttons[config.RIGHT].pressed) {
            player.setVelocityX(260);
            player.flipX = false;
            if (player.body.onFloor()) {
                states = 'run';
            }
        } else {
            player.originX = 0.5;
            player.originY = 0.5;
            player.setVelocityX(0);
            states = 4;
        }
        if (gamepad.buttons[config.SQUARE].pressed && !gamepad.buttons[config.R1].pressed) {
            player.originY = 0.5;
            if (player.flipX) {
                player.originX = 0.7;
            } else {
                player.originX = 0.3;
            }
            states = 'lightAttack';
        }

        if (gamepad.buttons[config.TRIANGLE].pressed && !gamepad.buttons[config.R1].pressed) {
            player.originY = 0.62;
            if (player.flipX) {
                player.originX = 0.7;
            } else {
                player.originX = 0.3;
            }
            states = 'heavyAttack';
        }

        if (gamepad.buttons[config.X].pressed && player.body.onFloor()) {
            player.setVelocityY(-400);
            if (player.body.velocity.y < 0 && player.body.velocity.x != 0)
                states = 'jump';
            fallBuffert = 0;
        }

        if (player.body.velocity.y > 0 && !gamepad.buttons[config.TRIANGLE].pressed && !gamepad.buttons[config.SQUARE].pressed) {
            states = 'fall';
        }
        if (player.body.velocity.y < 0 && !gamepad.buttons[config.UP].pressed) {
            states = 'jump';
        }

        if (player.body.velocity.y < 0 && !gamepad.buttons[config.TRIANGLE].pressed && !gamepad.buttons[config.SQUARE].pressed) {
            states = 'jump';
        }
        if (gamepad.buttons[config.UP].pressed && gamepad.buttons[config.R1].pressed && player.body.onWall()) {
            player.originY = 0.5;
            if (player.flipX) {
                player.originX = 0.3;
                player.setVelocityX(-260);
            } else {
                player.originX = 0.7;
                player.setVelocityX(260);
            }
            states = 'wallGlide';
            player.setVelocityY(-400);
        }
    }

    if (cursors.right.isDown)
        gamepad = false;

    //CONTROL END
    console.log(states)
}

function onEvent() {
    if (states == 'lightAttack') {
        if (player.flipX) {
            setTimeout(function () {
                weaponHitBox.create(player.body.x - 40, player.body.y + 110, 'weaponHitBox');
            }, 100);
            setTimeout(function () {
                weaponHitBox.create(player.body.x - 65, player.body.y + 65, 'weaponHitBox');
            }, 160);
            setTimeout(function () {
                weaponHitBox.clear(true);
            },250);

        } else {
            setTimeout(function () {
                weaponHitBox.create(player.body.x + 105, player.body.y + 110, 'weaponHitBox');
            }, 100);
            setTimeout(function () {
                weaponHitBox.create(player.body.x + 130, player.body.y + 65, 'weaponHitBox');
            }, 160);
            setTimeout(function () {
                weaponHitBox.clear(true);
            },250);
        }


    }
    if (states == 'heavyAttack') {
        if (player.flipX) {
            setTimeout(function () {
                weaponHitBox.create(player.body.x - 25, player.body.y - 20, 'weaponHitBox');
            }, 200);
            setTimeout(function () {
                weaponHitBox.create(player.body.x - 50, player.body.y + 22, 'weaponHitBox');
            }, 260);
            setTimeout(function () {
                weaponHitBox.create(player.body.x - 65, player.body.y + 65, 'weaponHitBox');
            }, 320);
            setTimeout(function () {
                weaponHitBox.clear(true);
            },350);

        } else {
            setTimeout(function () {
                weaponHitBox.create(player.body.x + 90, player.body.y - 20, 'weaponHitBox');
            }, 200);
            setTimeout(function () {
                weaponHitBox.create(player.body.x + 115, player.body.y + 22, 'weaponHitBox');
            }, 260);
            setTimeout(function () {
                weaponHitBox.create(player.body.x + 130, player.body.y + 65, 'weaponHitBox');
            }, 320);
            setTimeout(function () {
                weaponHitBox.clear(true);
            },350);

        }

    }
}
function checkOverlap(weaponHitBox, enemy){
    enemy.disableBody(true, true);
}