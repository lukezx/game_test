
class Game extends Phaser.Scene{
    constructor()
    {
        super({key: "Game"});
    }

    preload()
    {
        
    }

    create()
    {
        this.add.text(50, 50, "Game");
        this.display_typing = this.add.text(this.game.renderer.width / 2, 30, "", {font: "40px Impact"}).setOrigin(0.5);

        let cache = this.cache.text;
        let words = cache.get('dict');
        this.word_arr = words.split('\n');
        console.log(this.word_arr.length);

        this.used_words = [];
        this.currentWord = '';

        /*
        //load a json tilemap from tiled
        const map = this.make.tilemap({ key: "map1" });
        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage("floor", "floortiles");

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = map.createStaticLayer("below", tileset, 0, 0);
        const worldLayer = map.createStaticLayer("world", tileset, 0, 0);
        // const aboveLayer = map.createStaticLayer("above", tileset, 0, 0);

        worldLayer.setCollisionByProperty({ collides: true });

            // const debugGraphics = this.add.graphics().setAlpha(0.75);
            // worldLayer.renderDebug(debugGraphics, {
            //     tileColor: null, // Color of non-colliding tiles
            //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
            // });

        // player = this.physics.add.sprite(400, 350, "atlas", "misa-front");

        //Genearate innards of level
        let level = [];
        // for (let r = 2; r < dungeon_height-2; r++){
        //     let row = [];
        //     for (let c = 1; c < dungeon_width-1; c++){
        //         row.push(439);
        //     }
        //     level.push(row);
        // }

        const inner_map = this.make.tilemap({data: level, tileWidth: 16, tileHeight: 16});
        const tiles = inner_map.addTilesetImage('floortiles');
        const layer = inner_map.createStaticLayer(0, tiles, 16, 2*16);
        */

        this.floor = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "floor")

        this.player = this.physics.add.sprite(20, this.game.renderer.height / 2, "slime_run");
        this.player.setScale(2);
        this.player.setCollideWorldBounds();

        this.anims.create({
            key: "player_anim",
            frameRate: 6,
            repeat: -1,
            frames: this.anims.generateFrameNames("slime_run", {
                frames: [0,1,2,3,4,5]
            })
        });
        this.player.play("player_anim");
        this.physics.world.enableBody(this.player);

        this.makeEnemy();

        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.keyboard = this.input.keyboard.addKeys("A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,Backspace");

        this.input.keyboard.on("keydown", event => {
            if (event.keyCode > 36 && event.keyCode < 41) //ignore arrow keys ` 
                return;
            console.log(event);
            let key = event.key;
            if (key == "Backspace" && this.currentWord.length > 0)
            {
                this.currentWord = this.currentWord.slice(0, -1);
            }
            else if (key != "Backspace")
            {
                this.currentWord += key;
            }
            this.display_typing.text = this.currentWord;
            if (this.used_words.indexOf(this.currentWord) != -1) //word has been typed
            {
                this.enemyKilled();
            }
            
        });
        
    }

    enemyKilled()
    {
        console.log("killed");
    }

    makeEnemy()
    {
        let goblin = this.add.sprite(0,0,"goblin_idle").setScale(2);
        let word = this.selectWord();
        this.used_words.push(word);
        let enemy_txt = this.add.text(0,-10,word).setOrigin(0.5);
        this.enemy = this.add.container(200,200, [goblin, enemy_txt]);
        this.enemy.setSize(16,20);
        this.physics.world.enableBody(this.enemy);

        this.physics.world.addCollider(this.player, this.enemy, (player, enemy) => {
            console.log("Collision!!!");
        });
    }

    selectWord()
    {
        let wordLen = 5;
        let word = this.word_arr[Math.floor(Math.random() * this.word_arr.length)];
        word = word.slice(0,-1);
        if (this.used_words.indexOf(word) != -1 || word.length != wordLen)    
            word = this.selectWord();
        return word;
    }

    update()
    {
        // this.physics.accelerateToObject(this.enemy, this.player);

        let right = this.cursorKeys.right.isDown;
        let left = this.cursorKeys.left.isDown;
        let up = this.cursorKeys.up.isDown
        let down = this.cursorKeys.down.isDown
        if (right)
        {
            this.player.setVelocityX(64);
            this.player.setFlipX(false);
        }
        if (left)
        {
            this.player.setVelocityX(-64);
            this.player.setFlipX(true);
        }
        if (up)
        {
            console.log(this.game.renderer.height / 2 - this.floor.height);
            if (this.player.y > this.game.renderer.height / 2 - this.floor.height)
                this.player.setVelocityY(-64);
        }
        if (down)
        {
            this.player.setVelocityY(64);
        }
        if (!left && !right)
        {
            this.player.setVelocityX(0);
        }
        if (!up && !down)
        {
            this.player.setVelocityY(0);
        }

        // if (this.keyboard.D.isDown === true) {
        //     console.log("right");
        //     this.player.setVelocityX(128);

        // }
        // if (this.key_A.isDown)
        // {
        //     console.log("adidjapsij");
        // }
    }
}