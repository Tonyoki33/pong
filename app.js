//class
class Vec {
    constructor(x = 0,y = 1){
        this.x = x;
        this.y = y;
    }
}

class Rect{
    constructor(w,h){
        this.pos = new Vec;
        this.size = new Vec(w,h);
    }
    get left(){
        return this.pos.x - this.size.x / 2;
    }
    get right(){
        return this.pos.x + this.size.x / 2;
    }
    get top(){
        return this.pos.y - this.size.y / 2;
    }
    get bottom(){
        return this.pos.y + this.size.y / 2;
    }
}

class Ball extends Rect{
    constructor(){
        super(10,10);
        this.vel = new Vec;
    }
}

class Player extends Rect{
    constructor(){
        super(20,100);
        this.scoreID = 0;
    }
}

class Score extends Rect{
    constructor(){
        super(10,800);
    }
}

class Pong{
    constructor(canvas){
        this._canvas = canvas;
        this._context = canvas.getContext("2d");

        this.stageLine = new Rect (20,80);

        this.ball = new Ball;
        this.ball.vel.x = 100;
        this.ball.vel.y = 100;

        this.players = [
            new Player,
            new Player,
        ];

        this.scores = [
            new Score,
            new Score,
        ];


        this.players[0].pos.x = 40;
        this.players[1].pos.x = this._canvas.width - 40;
        this.players.forEach(player => {
            player.pos.y = this._canvas.height / 2;
        });

        this.scores[0].pos.x = 0;
        this.scores[1].pos.x = this._canvas.width;

        let lastTime;
        const callback = (millis) => {
            if(lastTime){
            this.update((millis - lastTime) /1000);
            }
            lastTime = millis;
            requestAnimationFrame(callback);
        };
        callback();
    }
    collide(player, ball){
        if(player.left < ball.right && player.right > ball.left && 
            player.top < ball.bottom && player.bottom > ball.top){
                ball.vel.x = -ball.vel.x
            }
    }
    draw(){
        this._context.fillStyle = '#000';
        this._context.fillRect(0,0, 
            this._canvas.width,this._canvas.height);
            this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));
        this.scores.forEach(score => this.drawRect(score));
        
    }
    drawRect(rect){
        this._context.fillStyle = '#FFF';
        this._context.fillRect(rect.left,rect.top, 
                            rect.size.x, rect.size.y);
    }
    update(dt) {
        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt;
    
        if(this.ball.right < 0 ){
            this.ball.vel.x = -this.ball.vel.x;
            this.players[0].scoreID+=1;
        }

        if(this.ball.left > this._canvas.width){
            this.ball.vel.x = -this.ball.vel.x;
            this.players[1].scoreID+=1;
        }
        
       
        console.log(this.players[0].scoreID);


        // solucionar el tema de los scores

        this.ball.pos.y += this.ball.vel.y * dt;
    
        if(this.ball.bottom < 0 || this.ball.top > this._canvas.height){
            this.ball.vel.y = -this.ball.vel.y;
        }

        this.players[1].pos.y = this.ball.pos.y;

        this.players.forEach(player => this.collide(player,this.ball));

        this.draw();
    }
}


// Vars
const canvas = document.querySelector("#pong");
const pong = new Pong(canvas);



// Events

canvas.addEventListener('mousemove',event=>{
    pong.players[0].pos.y = event.offsetY;
    
});