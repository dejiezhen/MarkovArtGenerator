// Setting up canvas 
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
canvas.width = 800
canvas.height = 500
canvas.classList.add('canvas')
document.body.appendChild(canvas)
// Fill canvas with blue
// context.fillStyle = "blue"
context.fillRect(0, 0, canvas.width, canvas.height)

// Square
context.fillStyle = "white";
context.fillRect(300, 200, 10, 10);


const drawParticle = (posX, posY) => {
    // Particle
    context.beginPath()
    context.fillStyle = "white"
    context.arc(posX, posY, 10, 0, Math.PI*2, true)
    context.closePath()
    context.fill()
}

let vx = 10
let vy = -10
let gravity = 1

let posX = 20
let posY = 100

setInterval(function() {
    // Erase canvas, but maybe don't erase if we want the trail
    context.fillStyle = "black"
    context.fillRect(0, 0, canvas.width, canvas.height)

    
    posX += vx
    posY += vy
    vy += 1

    drawParticle(posX, posY)

    if (posY > canvas.height * 0.75) {
        vy *= -0.6;
        vx *= 0.75;
        posY = canvas.height * 0.75;
    }

}, 30)