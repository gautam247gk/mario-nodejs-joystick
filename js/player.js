(function() {
	if (typeof Mario === 'undefined')
		window.Mario = {};

	var Player = Mario.Player = function(pos) {
		this.power = 0;
		this.powering = [];
		this.jumping = 0;
		this.canJump = true;

		Mario.Entity.call(this, {
			pos: pos,
			sprite: new Mario.Sprite('sprites/player.png',[80,32],[16,16],0),
			hitbox: [0,0,16,16]
		});
	}

	Mario.Util.inherits(Player, Mario.Entity);

	Player.prototype.moveRight = function() {
		//we're on the ground
		if (this.vel[1] === 0) {
			this.acc[0] = .1;
		} else {
			this.acc[0] = 0.05;
		}
	}

	Player.prototype.moveLeft = function() {
		if (this.vel[1] === 0) {
			this.acc[0] = -.1
		} else {
			this.acc[0] = -0.05;
		}
	}

	Player.prototype.noWalk = function() {
		this.acc[0] = 0;

		if (this.left) {
			this.vel[0] += 0.2;
		} else {
			this.vel[0] -= 0.2;
		}

		if (Math.abs(this.vel[0]) <= 0.3)
			this.vel[0] = 0;
	}

	Player.prototype.jump = function() {
		if (this.jumping) {
			this.jumping -= 10;
		} else if (this.standing && this.canJump) {
			this.jumping = 150;
			this.canJump = false;
			this.standing = false;
			this.acc[1] = -.2;
		}

		if (this.jumping <= 0) {
			this.jumping = 0;
		}
	}

	Player.prototype.noJump = function() {
		this.canJump = true;
		this.jumping = 0;
	}

  Player.prototype.setAnimation = function() {
    //compute changes to the sprite based on movement
		if (this.left) {
			this.sprite.img = 'sprites/playerl.png'
		} else {
			this.sprite.img = 'sprites/player.png'
		}
    // this.sprite.pos[0] = 96;
    // this.sprite.frames = [0,1,2];
    // this.sprite.speed = 10;
  }

	Player.prototype.update = function(dt) {
		if (this.powering.length !== 0) {
			switch (this.powering.shift()) {
				case 0: this.sprite.pos[0] = 80;
								this.startSprite = this.sprite;
								break;
				case 1: this.sprite = this.startSprite;
								this.pos[1] += 16;
								break;
				case 2: this.sprite = this.midSprite;
								this.pos[1] -= 16;
								break;
				case 3: this.sprite = this.bigSprite;
								break;
				case 4: this.sprite = this.endSprite;
								this.pos[1] -= 16;
								break;
			}
			if (this.powering.length === 0) {
				delete items[this.touchedItem];
			}
			return;
		}

		if (Math.abs(this.vel[0]) > 2) {
			this.vel[0] = 2 * this.vel[0] / Math.abs(this.vel[0]);
			this.acc[0] = 0;
		}
		if (this.vel[0] < 0) {
			this.left = true
		} else if (this.vel[0] > 0){
			this.left = false;
		}

		if (!this.jumping)
			this.acc[1] = .2

		//approximate acceleration
		this.vel[0] += this.acc[0];
		this.vel[1] += this.acc[1];
		this.pos[0] += this.vel[0];
		this.pos[1] += this.vel[1];
    this.setAnimation();
		this.sprite.update(dt);
	}

	Player.prototype.checkCollisions = function() {
		//x-axis first!
		var h = this.power > 0 ? 2 : 1;
		var w = 1;
		if (this.pos[1] % 16 != 0) {
			h += 1;
		}
		if (this.pos[0] % 16 != 0) {
			w += 1;
		}
		var baseX = Math.floor(this.pos[0] / 16);
		var baseY = Math.floor(this.pos[1] / 16);

		for (var i = 0; i < h; i++) {
			for (var j = 0; j < w; j++) {
				if (statics[baseY + i][baseX + j]) {
					statics[baseY + i][baseX + j].isCollideWith(this);
				}
				if (blocks[baseY + i][baseX + j]) {
					blocks[baseY + i][baseX + j].isCollideWith(this);
				}
			}
		}
	}

	Player.prototype.powerUp = function(idx) {
		//TODO: This animation still plays too fast, need to work on it a bit.
	  this.powering = [0,2,1,2,1,2,3,1,2,3,1,4];
		this.touchedItem = idx;

		if (this.power === 0) {
			this.midSprite = new Mario.Sprite('sprites/player.png', [320, this.sprite.pos[1] - 32], [16, 32], 0);
			this.bigSprite = new Mario.Sprite('sprites/player.png', [80, this.sprite.pos[1] - 32], [16, 32], 0);
			this.endSprite = new Mario.Sprite('sprites/player.png', [128, this.sprite.pos[1]- 32], [16,32], 0);
			this.power = 1;
			this.hitbox = [0,0,16,32];
		}
	}
})();
