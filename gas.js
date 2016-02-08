
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var radiusParticle = canvas.height/50;
var numParticles = 100;
var Dt = 1;
var minD = 2*radiusParticle;

var gas = new Gas(numParticles, canvas.width - minD, canvas.height - minD);
// drawParticles(gas, ctx, radiusParticle);
setInterval(function () { gas.move(); }, 10);

function drawParticles(gas, ctx, rad) {
    for (var i = 0; i < gas.numParticles; i++) {
        part = gas.particles[i];
        // ctx.translate(part.pos.x, part.pos.y);
        ctx.beginPath();
        ctx.arc(part.pos.x, part.pos.y, rad, 0, 2*Math.PI);
        ctx.stroke();
        // ctx.translate(-part.pos.x, -part.pos.y);
    }
}

function Particle(posx, posy, velx, vely) {
    this.pos = {x: posx, y: posy};
    this.vel = {vx: velx, vy: vely};
    this.move = moveParticle;
}

function moveParticle() {
    var posx = this.pos.x;
    var posy = this.pos.y;
    if (posx + radiusParticle > canvas.width || posx - radiusParticle < 0) {
        this.vel.vx *= -1;
    }
    if (posy + radiusParticle > canvas.height || posy - radiusParticle < 0) {
        this.vel.vy *= -1;
    }
    this.pos = {
        x: posx + this.vel.vx*Dt,
        y: posy + this.vel.vy*Dt
    };
}


function Gas(numParticles, lx, ly) {
    this.numParticles = numParticles;
    this.particles = [];
    this.size = {lx: lx, ly: ly};
    this.move = moveGas;

    for (var i = 0; i < numParticles; i++) {
        var pos = newPos(lx, ly);
        var part = new Particle(pos.x, pos.y, Math.random()*2-1, Math.random()*2-1);

        this.particles.push(part);
    }
}

function newPos(lx, ly) {
    return {
        x: lx * Math.random() + radiusParticle,
        y: ly * Math.random() + radiusParticle
    };
}

function distParticles(a, b) {
    dx = b.pos.x - a.pos.x;
    dy = b.pos.y - a.pos.y;
    return {
        norm: Math.sqrt(dx*dx + dy*dy),
        dx: dx,
        dy: dy
    }
}

function checkColision(gas) {
    for (var i = 0; i < gas.numParticles; i++) {
        a = gas.particles[i];

        for (var j = i+1; j < this.numParticles; j++) {
            b = gas.particles[j];
            var dist = distParticles(a, b);
            if (dist.norm > 2 && dist.norm < minD) {
            // if (dist.norm < minD) {
                // Si hay colisión:
                rx = dist.dx / dist.norm;
                ry = dist.dy / dist.norm;

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
}

function moveGas() {
    checkColision(this);
    for (var i = 0; i < this.numParticles; i++){
        this.particles[i].move();
    }
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawParticles(gas, ctx, radiusParticle);
}