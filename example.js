
// Particle.prototype.draw = function() {
//     this.x += this.vx;
//     this.y += this.vy;

//     // Adjust for gravity
//     this.vy += this.gravity;

//     // Age the particle
//     this.life++;
//     // Bounce off the ground
//     if ((this.y + this.particleSize) > this.groundLevel) {
//         this.vy *= -0.6;
//         this.vx *= 0.75;
//         this.y = this.groundLevel - this.particleSize;
//     }

//     // Determine whether to bounce the particle off a wall
//     if (this.x - (this.particleSize) <= this.leftWall) {
//         this.vx *= -1;
//         this.x = this.leftWall + (this.particleSize);
//     }

//     if (this.x + (this.particleSize) >= this.rightWall) {
//         this.vx *= -1;
//         this.x = this.rightWall - this.particleSize;
//     }

//     // Adjust for gravity
//     this.vy += this.gravity;

//     // If Particle is old, remove it
//     if (this.life >= this.maxLife) {
//         console.log('deleted')
//         delete particles[this.id];
//     }

//     // Create the shapes
//     context.clearRect(this.leftWall, this.groundLevel, canvas.width, canvas.height);
//     context.beginPath();
//     context.fillStyle="red";
//     context.arc(this.x, this.y, this.particleSize, 0, Math.PI*2, true); 
//     context.closePath();
//     context.fill();
// }



sprayIntegration() {
    let velocity = this.getVelocity
    this.oldX = this.posX
    this.oldY = this.posY
    this.posX = velocity.x * .9999
    this.posY = velocity.y * .9999
}

getVelocity() {
    newVelocity = { 
        x: this.x - this.oldX,
        y: this.y - this.oldY
    }
    return newVelocity
}