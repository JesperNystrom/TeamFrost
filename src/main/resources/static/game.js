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
var health;
//var healthBar;
var healthValue = 100;
var healthText;
var map;
var spacefield;
var backgroundv;
var timedEvent;
var innKeeper;
var portal;
var portal1;
var portal2;
var portal3;
var portal4;
var game = new Phaser.Game(config);

function preload() {
    this.load.image('bkGround', '../sprites/Background.png');
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
    this.load.spritesheet('playerHurt', '../sprites/PlayerHurt.png',
        { frameWidth: 128, frameHeight: 140 });

    //Enemy sprites
    this.load.spritesheet('enemyFlurry', '../sprites/EnemyFlurry.png',
        { frameWidth: 44, frameHeight: 40 });
    this.load.spritesheet('enemyGhost', '../sprites/EnemyGhost.png',
        { frameWidth: 64, frameHeight: 100 });
    this.load.spritesheet('enemyImp', '../sprites/EnemyImp.png',
        { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('enemyWraith', '../sprites/EnemyWraith.png',
        { frameWidth: 83, frameHeight: 164 });
    this.load.spritesheet('enemyYeti', '../sprites/EnemyYeti.png',
        { frameWidth: 232, frameHeight: 236 });
    this.load.spritesheet('enemyZombie', '../sprites/EnemyZombie.png',
        { frameWidth: 64, frameHeight: 128 });



    this.load.image('background', '../sprites/testBackground.png');
    //LOAD TERRAIN
    this.load.image('tiles', '../sprites/TileSetComplete.png');
    this.load.tilemapCSV('map', '../maps/World.csv');

    //Weapon hitbox
    this.load.image('weaponHitBox', '../sprites/WeaponHitBox.png');
    this.load.image('portalTest', '../sprites/WeaponHitboxTest.png');
}


//Spawn places
//Hub: 12,5
//map1: 120,3
//map2: 205,4
//map3: 427,6
//map4: 128,5

//portal places
//map1: 169,27
//map2: 323,34
//map3: 703,9
//map4: 981,44
function create() {
    spacefield = this.add.image(0, 0, 'bkGround');
    //Player health
    health = 100;



    //Background
    //spacefield = this.add.tileSprite(0, 0, 1137, 640, 'background');

    //FloorCounter
    fallBuffert = 25;

    //Creating Map and tile collision
    map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });
    var tileset = map.addTilesetImage('tiles');
    var layer = map.createStaticLayer(0, tileset, 0, -50);
    map.setCollision([0,1,2,3,4,5,6,7,8,9,10,11,12,14]);
    
    weaponHitBox = this.physics.add.staticGroup();

    //Portal
    portal = this.physics.add.group();
    portal.create(768,320, 'portalTest');

    portal1 = this.physics.add.group();
    portal1.create(10816, 1650, 'portalTest');

    portal2 = this.physics.add.group();
    portal2.create(20672, 2100, 'portalTest');

    portal3 = this.physics.add.group();
    portal3.create(44992, 500, 'portalTest');

    portal4 = this.physics.add.group();
    portal4.create(62784, 2750, 'portalTest');
    //Make player a phys object and player/platforms/ghostEnemies collide
    player = this.physics.add.sprite(768,320, 'playerRun');
    player.body.setSize(64, 138);

    //Create healthBar
    /* healthBar = this.add.image(this.width/2, this.height/2, 'healthBar');
    Phaser.Display.Align.In.TopLeft(spacefield, healthBar); */
    healthText = this.add.text(16,16, 'Health: 100',  { fontSize: '32px', fill: '#999' });



    //Create ghostEnemies
    ghostEnemies = this.physics.add.group();
    /* var ghostSpawn = [];
    var lastGhostSpawn = {x:map.findByIndex(16,0,true).x*64, y:map.findByIndex(16,0,true).y*64}
    var currentGhostSpawn;
    var i=0;
    do {
        ghostSpawn.push({x:map.findByIndex(16,i).x*64, y:map.findByIndex(16,i).y*64});
        currentGhostSpawn = {x:map.findByIndex(16,i).x*64, y:map.findByIndex(16,i).y*64};
        i++;
    } while(lastGhostSpawn.x != currentGhostSpawn.x && lastGhostSpawn.y != currentGhostSpawn.y)
    for(spawn of ghostSpawn){
    ghostEnemies.create(spawn.x, spawn.y, 'enemyGhost');
    } */

    //Create flurryEnemies
    flurryEnemies = this.physics.add.group();
    flurryEnemies.create(400, 100, 'enemyFlurry');

    //Create impEnemies
    impEnemies = this.physics.add.group();
    impEnemies.create(9999, 150, 'enemyImp');

    //Create wraithEnemies
    wraithEnemies = this.physics.add.group();
    wraithEnemies.create(9999, 150, 'enemyWraith');

    //Create yetiEnemies
    yetiEnemies = this.physics.add.group();
    //yetiEnemies.create(600, 150, 'enemyYeti');

    //Create zombieEnemies
    zombieEnemies = this.physics.add.group();
    zombieEnemies.create(9999, 150, 'enemyZombie');

    //Colliders
    this.physics.add.collider(player, layer);
    this.physics.add.collider(flurryEnemies, layer);
    //this.physics.add.collider(ghostEnemies, layer);
    this.physics.add.collider(impEnemies, layer);
    this.physics.add.collider(wraithEnemies, layer);
    this.physics.add.collider(yetiEnemies, layer);
    this.physics.add.collider(zombieEnemies, layer);
    this.physics.add.collider(portal, layer);
    this.physics.add.collider(portal1, layer);
    this.physics.add.collider(portal2, layer);
    this.physics.add.collider(portal3, layer);
    this.physics.add.collider(portal4, layer);

    //Damage
    //this.physics.add.overlap(player, flurryEnemies, checkOverlapPlayer, null, this);
    this.physics.add.overlap(player, ghostEnemies, checkOverlapPlayer, null, this);
    this.physics.add.overlap(player, impEnemies, checkOverlapPlayer, null, this);
    this.physics.add.overlap(player, wraithEnemies, checkOverlapPlayer, null, this);
    this.physics.add.overlap(player, yetiEnemies, checkOverlapPlayer, null, this);
    this.physics.add.overlap(player, zombieEnemies, checkOverlapPlayer, null, this);

    //Hitbox/kill-able
    //this.physics.add.overlap(weaponHitBox, flurryEnemies, checkOverlapHitBox, null, this);
    this.physics.add.overlap(weaponHitBox, ghostEnemies, checkOverlapHitBox, null, this);
    this.physics.add.overlap(weaponHitBox, impEnemies, checkOverlapHitBox, null, this);
    this.physics.add.overlap(weaponHitBox, wraithEnemies, checkOverlapHitBox, null, this);
    this.physics.add.overlap(weaponHitBox, yetiEnemies, checkOverlapHitBox, null, this);
    this.physics.add.overlap(weaponHitBox, zombieEnemies, checkOverlapHitBox, null, this);
    this.physics.add.overlap(player, portal, checkOverlapPortal, null, this);
    this.physics.add.overlap(player, portal1, checkOverlapPortal1, null, this);
    this.physics.add.overlap(player, portal2, checkOverlapPortal2, null, this);
    this.physics.add.overlap(player, portal3, checkOverlapPortal3, null, this);
    this.physics.add.overlap(player, portal4, checkOverlapPortal4, null, this);
    



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
    this.anims.create({
        key: 'hurt',
        frames: this.anims.generateFrameNumbers('playerHurt', { start: 0, end: 6 }),
        frameRate: 60,
        repeat: 0
    });

    //Animations for ghostEnemies
    this.anims.create({
        key: 'ghost',
        frames: this.anims.generateFrameNumbers('enemyGhost', { start: 0, end: 15 }),
        frameRate: 20,
        repeat: 1
    });

    //Animations for flurryEnemies
    this.anims.create({
        key: 'flurry',
        frames: this.anims.generateFrameNumbers('enemyFlurry', { start: 0, end: 21 }),
        frameRate: 20,
        repeat: 1
    });

    //Animations for impEnemies
    this.anims.create({
        key: 'imp',
        frames: this.anims.generateFrameNumbers('enemyImp', { start: 0, end: 10 }),
        frameRate: 20,
        repeat: 1
    });

    //Animations for wraithEnemies
    this.anims.create({
        key: 'wraith',
        frames: this.anims.generateFrameNumbers('enemyWraith', { start: 0, end: 19 }),
        frameRate: 20,
        repeat: 1
    });

    //Animations for yetiEnemies
    this.anims.create({
        key: 'yeti',
        frames: this.anims.generateFrameNumbers('enemyYeti', { start: 0, end: 14 }),
        frameRate: 20,
        repeat: 1
    });

    //Animations for zombieEnemies
    this.anims.create({
        key: 'zombie',
        frames: this.anims.generateFrameNumbers('enemyZombie', { start: 0, end: 11 }),
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

    document.getElementById('Health').innerHTML = 'Health:' + health;
    healthText.x = player.x - 550;
    healthText.y = player.y - 275;

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
        case 'hurt':
            player.anims.play('hurt', true);
            break;
        default:
            player.anims.play('idle', true);
    }

    //Enemy animations and movement

    //Flurry
    var flurryEnemy = flurryEnemies.getChildren();
    for (child of flurryEnemy) {
        child.anims.play('flurry', true);
        if (child.body.x < player.body.x) {
            child.flipX = true;
            child.setVelocityX(75);
        }
        else {
            child.flipX = false;
            child.setVelocityX(-75);
        }
        
    }

    //Ghost
    var ghostEnemy = ghostEnemies.getChildren();
    for (child of ghostEnemy) {
        child.anims.play('ghost', true);
        if (child.body.x < player.body.x) {
            child.flipX = true;
            child.setVelocityX(200);
        }
        else {
            child.flipX = false;
            child.setVelocityX(-200);
        }

        if (child.body.y < player.body.y + 30) {
            child.setVelocityY(50);
        }
        else {
            child.setVelocityY(-50);
        }
    }

    //Imp
    var impEnemy = impEnemies.getChildren();
    for (child of impEnemy) {
        child.anims.play('imp', true);
        if (child.body.x < player.body.x) {
            child.flipX = false;
            child.setVelocityX(90);
        }
        else {
            child.flipX = true;
            child.setVelocityX(-90);
        }
    }

    //Wraith
    var wraithEnemy = wraithEnemies.getChildren();
    for (child of wraithEnemy) {
        child.anims.play('wraith', true);
        if (child.body.x < player.body.x) {
            child.flipX = false;
            child.setVelocityX(175);
        }
        else {
            child.flipX = true;
            child.setVelocityX(-175);
        }
    }

    //Yeti
    var yetiEnemy = yetiEnemies.getChildren();
    for (child of yetiEnemy) {
        child.anims.play('yeti', true);
        if (child.body.x < player.body.x) {
            child.flipX = true;
            child.setVelocityX(600);
        }
        else {
            child.flipX = false;
            child.setVelocityX(-600);
        }
    }

    //Zombie
    var zombieEnemy = zombieEnemies.getChildren();
    for (child of zombieEnemy) {
        child.anims.play('zombie', true);
        if (child.body.x < player.body.x) {
            child.flipX = true;
            child.setVelocityX(120);
        }
        else {
            child.flipX = false;
            child.setVelocityX(-120);
        }
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
            player.originX = 0.7;
        } else {
            player.originX = 0.3;
        }
        timedEvent = this.time.addEvent({
            delay: 0, callback: onEvent,
            callbackScope: this, repeat: 0, startAt: 0
        });
        states = 'lightAttack';
    }

    if (key_X.isDown && !cursors.down.isDown) {
        player.originY = 0.62;
        if (player.flipX) {
            player.originX = 0.7;
        } else {
            player.originX = 0.3;
        }
        timedEvent = this.time.addEvent({
            delay: 0, callback: onEvent,
            callbackScope: this, repeat: 0, startAt: 0
        });
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
            }, 250);

        } else {
            setTimeout(function () {
                weaponHitBox.create(player.body.x + 105, player.body.y + 110, 'weaponHitBox');
            }, 100);
            setTimeout(function () {
                weaponHitBox.create(player.body.x + 130, player.body.y + 65, 'weaponHitBox');
            }, 160);
            setTimeout(function () {
                weaponHitBox.clear(true);
            }, 250);
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
            }, 350);

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
            }, 350);

        }

    }
    
}
function checkOverlapPortal(player, portal) {
    if(cursors.up.isDown){
    player.body.x = 7680;
    player.body.y = 120;
    }
}
function checkOverlapPortal1(player, portal1) {
    if(cursors.up.isDown){
    player.body.x = 13120;
    player.body.y = 250;
    }
}
function checkOverlapPortal2(player, portal2) {
    if(cursors.up.isDown){
    player.body.x = 27328;
    player.body.y = 380;
    }
}
function checkOverlapPortal3(player, portal3) {
    if(cursors.up.isDown){
    player.body.x = 8192;
    player.body.y = 310;
    }
}
function checkOverlapPortal4(player, portal4) {
    if(cursors.up.isDown){
    player.body.x = 7680;
    player.body.y = 120;
    }
}
function checkOverlapHitBox(weaponHitBox, enemy) {
    enemy.disableBody(true, true);
}
function checkOverlapPlayer(player, enemy) {
    
    states = 'hurt';
    player.setVelocityX(100);
    health -=1;
    healthText.setText('Health:' + health)
    setTimeout(function() {
    }, 3500);
    console.log(health);
    if(health <= 0) {
        player.disableBody(true, true);
    }
    document.getElementById('Health').innerHTML = 'Health:' + health;
}
