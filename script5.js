let canvas, context, screenWidth, screenHeight


let fireworks = []
let particles = []
let fireworksMax = 50;
let fireworksChance = 0.2;
let hue = 0;



const windowResizeAdjustment = () => {
    screenWidth = canvas.width = window.innerWidth
    screenHeight = canvas.height = window.innerHeight
    context.fillStyle = 'black'
    context.fillRect(0, 0, screenWidth, screenHeight)
}

const setupInitialization = () => {
    canvas = document.createElement('canvas')
    context = canvas.getContext('2d')
    windowResizeAdjustment()
    canvas.classList.add('canvas')
    document.body.appendChild(canvas)    
    frameAnimation()
}


function getRandomInt(min, max) {
	return Math.round(Math.random() * (max - min)) + min;
}

function easeOutQuart(x) {
	return 1 - Math.pow(1 - x, 4);
}
const createNewFireWorks = () => {
    for (let i = 0; i < 0; i++) {
        fireworks.push(new FireWork())
    }
}

const explode = (posX, posY, hue) => {
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle(posX, posY, hue, i))
    }
    console.log('exploding')
}
const cleanFireWorksAndParticles = () => {
    let fireworkDump = []
    let particleDump = []
    fireworks.map(val => {
        val.alpha > 0 
            ? fireworkDump.push(val)
            : explode(val.posX, val.posY, val.hue)
    })
    fireworks = fireworkDump

    particles.map(val => {
        if (val.size > 0) particleDump.push(val)
    })
    particles = particleDump
}

const createScene = () => {
    fireworks.map(val => {
        val.update()
        val.draw()
    })
    particles.map(val => {
        val.update()
        val.draw()
    })
}

const frameAnimation = () => {
    if (fireworks.length < fireworksMax && Math.random() < fireworksChance) {
		fireworks.push(new FireWork());
		hue += 10;
	}
	context.fillStyle = "rgba(0, 0, 0, .1)";
	context.fillRect(0, 0, screenWidth, screenHeight);

	createScene();
    cleanFireWorksAndParticles();
    requestAnimationFrame(frameAnimation);

}

class FireWork {
    constructor() {
        this.posX = getRandomInt(screenWidth * .3, screenWidth * .7)
        this.posY = screenHeight

        this.targetHeight = getRandomInt(screenHeight * .2, screenHeight * .4)
		this.hue = hue;
		this.alpha = 1;
		this.particleLife = 0;
		this.lifeSpan = getRandomInt(120, 180);
    }

    draw() {
        // Circle
        if (this.particleLife <= this.lifeSpan) {
            context.beginPath();
            context.arc(this.posX, this.posY, 3, 0, Math.PI * 2);
            context.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
            context.fill();
            context.closePath();
		}
    }
    update() {
		let progress = 1 - (this.lifeSpan - this.particleLife) / this.lifeSpan;
		this.posY = canvas.height - (canvas.height - this.targetHeight) * easeOutQuart(progress);
		this.alpha = 1 - easeOutQuart(progress);
		this.particleLife++;

	}
}

class Particle {
	constructor(posX, posY, hue, i) {
		this.posX = posX;
		this.posY = posY;
		this.hue = hue;
		this.size = getRandomInt(2, 3)
		this.speed = getRandomInt(30, 40) / 10
		this.angle = getRandomInt(0, 36) + 36 * i
	}
	draw() {
        // Square 
        // Circle
        // Triangle
        // Semi Circle
        let randomShape = ''
        const randomNumber = Math.floor(Math.random() * 4)
        if (randomNumber == 0) randomShape = 'Triangle'
        if (randomNumber == 1) randomShape = 'Circle'
        if (randomNumber == 2) randomShape = 'SemiCircle'
        if (randomNumber == 3) randomShape = 'Square'
		if (this.size > 0) {
			context.beginPath();
            if (randomShape == 'Triangle') {
                context.moveTo(this.posX, this.posY);
                context.lineTo(this.posX + 5, this.posY + 5);
                context.lineTo(this.posX + 5, this.posY - 5);          
                console.log('t')  
            }
            if (randomShape == 'Circle') {
                context.arc(this.posX, this.posY, this.size, 0, Math.PI * 2);
                console.log('circle')
            }
            if (randomShape == 'SemiCircle') {
                context.arc(this.posX, this.posY, this.size, 0, Math.PI);
                console.log('semi')
            }
            if (randomShape == 'Square') {
                context.rect(this.posX, this.posY, 5, 5)
                
            }
            // Markov Colors
            context.fillStyle = `hsla(${this.hue}, 100%, 50%, 1)`;
			context.fill();
			context.closePath();
		}
	}
	update() {
		this.radian = (Math.PI / 180) * this.angle;
		this.posX += this.speed * Math.sin(this.radian);
		this.posY += this.speed * Math.cos(this.radian);
		this.size -= 0.05;
	}
}

window.addEventListener("DOMContentLoaded", setupInitialization())
window.addEventListener('resize', windowResizeAdjustment)
