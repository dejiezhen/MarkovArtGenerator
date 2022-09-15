let canvas, 
    context, 
    screenWidth, 
    screenHeight,
    background

let fireworks = []
let particles = []
let maxFireWorks
let fireworksChance = 0.75;
let hue = 0;
let currentHueLevel = 'A'

const windowResizeAdjustment = () => {
    screenWidth = canvas.width = window.innerWidth * .8
    screenHeight = canvas.height = window.innerHeight * .8
    context.fillStyle = 'blue'
    context.fillRect(0, 0, screenWidth, screenHeight)
}

const canvasInitialization = () => {
    // background = new Image()
    backgroundNumber = Math.floor(Math.random() * 4)
    // background.src = `./images/Mid-Autumn_Festival-beijing.jpg`
    backgroundImg = document.getElementById("background")
    console.log(backgroundNumber)
    backgroundImg.style.backgroundImage = `url(./images/background${backgroundNumber}.jpg)`

    canvas = document.createElement('canvas')
    context = canvas.getContext('2d')
    canvas.classList.add('canvas')
    document.body.appendChild(canvas)

    // background.onload = () => {
    //     context.drawImage(background, 0, 0, screenWidth, screenHeight)
    // }
}

const setupInitialization = () => {
    canvasInitialization()
    windowResizeAdjustment()
    frameAnimation()
}


// https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// https://easings.net/#easeInCirc
const easeInCirc = (x) => {
    return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

const createNewFireWorks = () => {
    for (let i = 0; i < 10; i++) {
        fireworks.push(new FireWork())
    }
}

const explodeParticles = (posX, posY, hue) => {
    const randomParticleAmount = Math.random() * 50 + 1
    for (let i = 0; i < randomParticleAmount; i++) {
        const markov = new MarkovChain(transitionMatrix)
        newHue = markov.getNextColor()
        particles.push(new Particle(posX, posY, hue, i))
    }
}
const cleanFireWorksAndParticles = () => {
    let currFireWorks = []
    let currParticles = []
    fireworks.forEach(val => {
        val.alpha > 0 
            ? currFireWorks.push(val)
            : explodeParticles(val.posX, val.posY, val.hue)
    })
    fireworks = currFireWorks

    particles.map(val => {
        if (val.size > 0) currParticles.push(val)
    })
    particles = currParticles
}

const createScene = () => {
    
    fireworks.forEach(val => {
        val.update()
        val.draw()
    })
    particles.forEach(val => {
        val.update()
        val.draw()
    })
}
const markovTransitionMatrix = () => {
    // A is red, B is blue, C is green
    transitionMatrix = {
        "A": {  "A": .2, 
                "B": .4, 
                "C": .4},
        "B": {  "A": .4, 
                "B": .2, 
                "C": .4},
        "C": {  "A":.4, 
                "B":.4, 
                "C":.2},
    }

    return transitionMatrix
}

const frameAnimation = () => {
    if (fireworks.length < fireworksMax && Math.random() < fireworksChance) {
		fireworks.push(new FireWork());
        transition = markovTransitionMatrix()
        const markov = new MarkovChain(transitionMatrix)
        newHue = markov.getNextColor()
        console.log(newHue, currentHueLevel)
        hue = newHue
	}
    // commenting this out is cool
    // globalCompositeOperation='source-over'
    // context.drawImage(background, 0, 0, screenWidth, screenHeight)
    // context.drawImage(background, 0, 0, screenWidth, screenHeight)
	context.fillStyle = "rgba(4, 0, 0, 0.05)";
	context.fillRect(0, 0, screenWidth, screenHeight);

	createScene();
    cleanFireWorksAndParticles();
    requestAnimationFrame(frameAnimation);
    

}

class MarkovChain {
    constructor(transitionMatrix, currHueLevel) {
        this.transitionMatrix = transitionMatrix
        this.currHueLevel = currHueLevel
    }
    randomChoice() {
        const getHueMatrix = Object.entries(this.transitionMatrix[currentHueLevel])
        let distribution = []
        getHueMatrix.forEach(v => {
            const possibleColor = v[0]
            const possibility = v[1] * 10
            let newPossibilities = Array(possibility).fill(possibleColor)
            distribution = [...distribution, ...newPossibilities]
        })        
        const nextColor = distribution[Math.floor((Math.random() * distribution.length))]
        return nextColor
    }
    getNextColor () {
        currentHueLevel = this.randomChoice()
        if(currentHueLevel == 'A') {
            const redHue = getRandomInt(0, 119)

            return redHue
        }
        if(currentHueLevel == 'B') {
            const blueHue = getRandomInt(241, 359) 
            return blueHue
        }
        if(currentHueLevel == 'C') {
            const greenHue = getRandomInt(120, 240) 

            return greenHue
        }
        console.log(currentHueLevel)
    }
}

class FireWork {
    constructor() {
        this.posX = getRandomInt(screenWidth * .2, screenWidth * .8)
        this.posY = screenHeight
        this.targetHeight = getRandomInt(screenHeight * .2, screenHeight * .4)
	
        this.hue = hue;
		this.alpha = 1;
		this.particleLife = 0;
		this.lifeSpan = getRandomInt(50, 100);
    }

    draw() {
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
		this.posY = canvas.height - (canvas.height - this.targetHeight) * easeInCirc(progress);
		this.alpha = 1 - easeInCirc(progress);
		this.particleLife++;

	}
}

class Particle {
	constructor(posX, posY, hue, i, directionX, directionY) {
		this.posX = posX;
		this.posY = posY;
		this.hue = hue;
		this.size = getRandomInt(2, 3)
		this.speed = getRandomInt(30, 40) / 10
		this.angle = getRandomInt(0, 36) + 36 * i
        this.directionX = directionX
        this.directionY = directionY
    
	}
	draw() {
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
            }
            if (randomShape == 'Circle') {
                context.arc(this.posX, this.posY, this.size, 0, Math.PI * 2);
            }
            if (randomShape == 'SemiCircle') {
                context.arc(this.posX, this.posY, this.size, 0, Math.PI);
            }
            if (randomShape == 'Square') {
                context.rect(this.posX, this.posY, 5, 5)
                
            }
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

const btn = document.getElementById('boom-button')
const restart = document.getElementById('restart-button')
const input = document.getElementById('input-field')

restart.addEventListener('click', () => {
    location.reload()
})

btn.addEventListener('click', function() {
    const inputValue = input.value
    input.disabled = true
    btn.disabled = true
    fireworksMax = inputValue ? inputValue : 5;
    if(!inputValue) {
        document.getElementById('input-field').value = 5
    }
    setupInitialization()
})

window.addEventListener('resize', windowResizeAdjustment)
