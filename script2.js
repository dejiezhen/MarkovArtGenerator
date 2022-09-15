// Setting up canvas 
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 100

// Fill canvas with blue
context.fillStyle = "black"
context.fillRect(0, 0, canvas.width, canvas.height)

canvas.classList.add('canvas')
document.body.appendChild(canvas)
let particles

class Particle {
  constructor(posX, posY, directionX, directionY, size, color) {
    this.posX = posX
    this.posY = posY
    this.directionX = directionX
    this.directionY = directionY
    this.size = size
    this.color = color
  }
  draw() {
    context.fillStyle = this.color
    context.beginPath()
    context.arc(this.posX, this.posY, this.size, 0, Math.PI*2, true)
    context.fill()
    context.closePath()
  }
  update() {
    if(this.posX + this.size > canvas.width || this.x - this.size < 0) {
      this.directionX = -this.directionX
    }
    if (this.posY + this.size > canvas.height || this.posY - this.size < 0) {
      this.directionY = -this.dierctionY
    }
    this.posX += this.directionX
    this.posY += this.directionY
  }
}

const init = () => {
  particles = []
  for (let i = 0; i<200; i++) {
    let size = Math.random() * 20
    let posX = Math.random() * (innerWidth - size * 2)
    let posY = Math.random() * (innerHeight - size * 2)
    let directionX = (Math.random() * .4 ) - .2
    let directionY = (Math.random() * .4 ) - .2
    let color = 'red'
    particles.push(new Particle(posX, posY, directionX, directionY, size, color))

  }
}

const particleAnimation = () => {
  particle.forEach((_, i) => {
      particles[i].update()
      particles[i].draw()

  })    
}

const frameAnimation = () => {
  context.clearRect(0,0,innerWidth, innerHeight)
  for (let i = 0; i<particles.length; i++) {
    particles[i].update()
    particles[i].draw()
  }
  requestAnimationFrame(frameAnimation)
}
console.log(particles)
init()
frameAnimation()