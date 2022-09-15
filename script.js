// Setting up canvas 
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 100

// Fill canvas with blue
context.fillStyle = "white"
context.fillRect(0, 0, canvas.width, canvas.height)

canvas.classList.add('canvas')
document.body.appendChild(canvas)

// Initialize global variables
let particles = []
let radius = window.innerWidth/5;
let angle = 0;
let hue = 0

class Particle {
    constructor(posX, posY) {
        this.posX = posX
        this.posY = posY
        this.vx = Math.random() * 2 - 1
        this.vy = Math.random() * -10 - 10
        this.gravity = .5
        this.color = 'hsl(' + hue + ',100%, 50%)'
        // this.color = 'red'
        this.particleLife = 0
        // this.particleIndex = particleIndex
        this.particleSize = Math.random() * 16
        this.radius = 2

        // Use markov to determine size
        this.weight = 2
        this.directionX = Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1)
 
        // Wall Properties
        this.leftWall = canvas.width * .25
        this.rightWall = canvas.width * .75 
        this.ground = canvas.height * .95
        
    }
    drawParticle(){
        // Particle
        context.fillStyle = this.color
        context.beginPath()
        context.arc(this.posX, this.posY, this.particleSize, 0, Math.PI*2, true)
        context.fill()
        context.closePath()
    }

    updateParticle() {
        if(this.posY > canvas.height) {
            this.posY = 0 - this.particleSize
            this.weight = Math.random() * 1 + 1
            this.posX = Math.random() * canvas.width * 1.3
        }
        this.weight += 0.01
        this.posX += this.directionX
        this.posY += this.weight
        hue += 5
        // if (this.particleSize > 0.2) this.particleSize -= .1

        // out of bounds, reset
        // if (this.posX - this.radius > canvas.width ||
        //     this.posX + this.radius < 0 ||
        //     this.posY - this.radius > canvas.height ||
        //     this.posY + this.radius < canvas.height) {
        //         this.posY -= 3
        //         this.weight *= -0.5
        //     }

        if ((this.posY + this.particleSize) > this.ground) {
            this.posY -= 3
            this.weight *= -0.5
            
        }

//     // Determine whether to bounce the particle off a wall
//     if (this.x - (this.particleSize) <= this.leftWall) {
//         this.vx *= -1;
//         this.x = this.leftWall + (this.particleSize);
//     }

        if (this.posX + (this.particleSize) >= this.rightWall) {
            this.posX = Math.random() * canvas.width / 2
            this.posY = Math.random() * canvas.height / 2
            this.weight = Math.random() * 1 + 1

        }
        // this.weight += this.gravity;
    }


}

const particleInit = () => {
    particles = []
    // change color via markov
    const particleProperties = {
        gravity: 0.5,
        particleLife: 0,
        color: 'red' 
    }
    for (let i = 0; i < 200; i++) {
        const particleX = Math.random() * canvas.width / 2
        const particleY = Math.random() * canvas.height / 2
        particles.push(new Particle(
                                    particleX,
                                    particleY,
        ))
    }
}

particleInit()

const particleAnimation = () => {
    particles.forEach((_, i) => {
        particles[i].updateParticle()
        particles[i].drawParticle()
        // if(particles[i].size <= 0.3) {
        //     particles.splice(i, 1)
        // }
    })    
}

const frameAnimation = () => {
    context.fillStyle = 'rgba(255,255,255,0.01)'
    context.fillRect(0,0,canvas.width,canvas.height)
    // context.clearRect(0, 0, canvas.width, canvas.height)
    // particleInit()
    particleAnimation()
    hue++
    requestAnimationFrame(frameAnimation)
}
frameAnimation()

// setInterval(function() {
//     // particleInit()
//     frameAnimation()
// })
