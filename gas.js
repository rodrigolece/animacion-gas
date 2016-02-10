
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var numParticles = 100;
var radiusParticle = 1/50;
var Dt = 1/200;
var minD = 2*radiusParticle;
var lx = 1;
var ly = 1;

var gas = new Gas(numParticles, lx - minD, ly - minD);
// drawParticles(gas);
setInterval(function () { gas.move(); }, 33);

function Gas(numParticles, lx, ly) {
    this.numParticles = numParticles;
    this.particles = [];
    this.size = {lx: lx, ly: ly};
    this.move = moveGas;

    for (var i = 0; i < numParticles; i++) {
        var pos = newPos(this);
        var part = new Particle(pos.x, pos.y, Math.random()*2-1,
        Math.random()*2-1, i);

        this.particles.push(part);
    }
}

function moveGas() {
    // checkColision(this);
    for (var i = 0; i < this.numParticles; i++){
        this.particles[i].move();
    }
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawParticles(gas);
}

function drawParticles(gas) {
    for (var i = 0; i < gas.numParticles; i++) {
        part = gas.particles[i];

        ctx.beginPath();
        ctx.arc(canvas.width * part.pos.x, canvas.height * part.pos.y,
            Math.min(canvas.width, canvas.height)*radiusParticle, 0, 2*Math.PI);
        ctx.stroke();
    }
}

function newPos(gas) {
    var n = gas.particles.length;
    do {
        var overlap = false;
        var x = gas.size.lx * Math.random() + radiusParticle;
        var y = gas.size.ly * Math.random() + radiusParticle;
        if (n == 0) {
            return { x: x, y: y };
        }
        for (var i = 0; i < n; i++){
            var part = gas.particles[i];
            var dx = part.pos.x - x;
            var dy = part.pos.y - y;
            var norm = Math.sqrt( dx*dx + dy*dy );
            if (norm <= minD) { overlap = true; }
        }
    } while (overlap) ;
    return { x: x, y: y };
}

function Particle(posx, posy, velx, vely, i) {
    this.pos = {x: posx, y: posy};
    this.vel = {vx: velx, vy: vely};
    this.move = moveParticle;
    this.index = i;
}

function moveParticle() {
    var futurex = this.pos.x + this.vel.vx * Dt;
    var futurey = this.pos.y + this.vel.vy * Dt;

    // Una colisión tiene precedencia sobre rebotar en la pared
    checkColision(this, futurex, futurey);
    futurex = this.pos.x + this.vel.vx * Dt;
    futurey = this.pos.y + this.vel.vy * Dt;

    if (futurex + radiusParticle > lx || futurex - radiusParticle < 0) {
        this.vel.vx *= -1;
    }
    if (futurey + radiusParticle > ly || futurey - radiusParticle < 0) {
        this.vel.vy *= -1;
    }
    this.pos = {
        x: this.pos.x + this.vel.vx * Dt,
        y: this.pos.y + this.vel.vy * Dt
    };
}

function checkColision(a, futurex, futurey) {
    for (var j = a.index+1; j < numParticles; j++) {
        b = gas.particles[j];
        var bfuturex = b.pos.x + b.vel.vx * Dt;
        var bfuturey = b.pos.y + b.vel.vy * Dt;
        // var dist = distParticles(a, b);
        var dx = bfuturex - futurex;
        var dy = bfuturey - futurey;
        var norm = Math.sqrt( dx*dx + dy*dy );
        if (norm < minD) {
        // Si hay colisión:
            rx = dx / norm;
            ry = dy / norm;

            dvx = b.vel.vx - a.vel.vx;
            dvy = b.vel.vy - a.vel.vy;

            //(vb - va)·r
            var projection = rx * dvx + ry * dvy;
            a.vel.vx += projection * rx;
            a.vel.vy += projection * ry;

            b.vel.vx -= projection * rx;
            b.vel.vy -= projection * ry;
        }
    }
}

// function distParticles(a, b) {
//     var dx = b.pos.x - a.pos.x;
//     var dy = b.pos.y - a.pos.y;
//     return {
//         norm: Math.sqrt( dx*dx + dy*dy ),
//         dx: dx,
//         dy: dy
//     }
// }
