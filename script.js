let canvas, 
    context, 
    screenWidth, 
    screenHeight,
    maxFireWorks

let fireworks = []
let particles = []
let markovHue = 0;
let currentHueLevel = 'R'

const windowResizeAdjustment = () => {
    /**
     * Sets default canvas width and height and also 
     * dynamically adjusts the width and height such as when 
     * shrinking and expanding
     * 
     * Args:
     *      None
     */
    screenWidth = canvas.width = window.innerWidth * .8
    screenHeight = canvas.height = window.innerHeight * .8
    context.fillStyle = 'white'
    context.fillRect(0, 0, screenWidth, screenHeight)
}

const changeBackground = () => {
    /**
     * Randomly choose 1 out of the 4 backgrounds
     * 
     * Args:
     *      None
     */
    const backgroundNumber = Math.floor(Math.random() * 4)
    const backgroundImg = document.getElementById("background")
    backgroundImg.style.backgroundImage = `url(./images/background${backgroundNumber}.jpg)`
}

const canvasInitialization = () => {
    /**
     * Initialize the canvas and add it into DOM
     * 
     * Args:
     *      None
     */
    canvas = document.createElement('canvas')
    context = canvas.getContext('2d')
    canvas.classList.add('canvas')
    document.body.appendChild(canvas)
}

const setupInitialization = () => {
    /**
     * Sets up the background, canvas, windowSize. 
     * Starts firework animation
     * 
     * Args:
     *      None
     */
    changeBackground()
    canvasInitialization()
    windowResizeAdjustment()
    frameAnimation()
}


const getRandomInt = (min, max) => {
    /**
     * Gets a random interger between min and max (MIN AND MAX INCLUSIVE)
     * 
     * Credits: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
     * 
     * Args:
     *      min(number): minimum number 
     *      max(number): maximum number
     * 
     */
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const easeInCirc = (x) => {
    /**
     * Ease animation function
     * 
     * Credits: https://easings.net/#easeInCirc
     * 
     * Args:
     *      x: current x position
     */
    return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

const explodeParticles = (posX, posY, markovHue) => {
    /**
     * Creates a random number amount of particles
     * to release at explosion 
     * 
     * Args:
     *      posX: current x position of the firework instance
     *      posY: current y position of the firework instance
     *      markovHue: current hue value of the firework instance
     */
    const randomParticleAmount = Math.random() * 50 + 1
    for (let i = 0; i < randomParticleAmount; i++) {
        particles.push(new Particle(posX, posY, markovHue, i))
    }
}
const cleanFireWorksAndParticles = () => {
    /**
     * Keeps track of fireworks and particles on the screen 
     * by checking alpha value and size respectively.
     * 
     * Args:
     *      None
     */

    let currFireWorks = []
    let currParticles = []
    fireworks.forEach(val => {
        val.alpha > 0 
            ? currFireWorks.push(val)
            : explodeParticles(val.posX, val.posY, val.markovHue)
    })
    fireworks = currFireWorks

    particles.forEach(val => {
        if (val.size > 0) { 
            currParticles.push(val) 
        }
    })
    particles = currParticles
}

const createScene = () => {
    /**
     * Per animation frame, we will update 
     * and draw each firework and particle instance
     * 
     * Args:
     *      None
     */
    fireworks.forEach(val => {
        val.update()
        val.draw()
    })
    particles.forEach(val => {
        val.update()
        val.draw()
    })
}

const setNewHue = () => {
    /**
     * Sets the new hue using Markov Chains. 
     * Calls getNextColor function in the Markov Chain Class
     * that will generate us a new random hue value within 
     * either R/G/B spectrum value that markov chose for us
     * 
     * Transition Matrix:
     *      A: Red-like Hue
     *      B: Green-like Hue
     *      C: Blue-like Hue
     * 
     * Args: 
     *      None
     */

     const transitionMatrix = {
        "R": {  "R": .2, 
                "G": .4, 
                "B": .4},
        "G": {  "R": .4, 
                "G": .2, 
                "B": .4},
        "B": {  "R":.4, 
                "G":.4, 
                "B":.2},
    }

    const markov = new MarkovChain(transitionMatrix)
    const newHue = markov.getNextColor()
    markovHue = newHue
}

const frameAnimation = () => {
    /**
     * Create the frame animations on the canvas
     * Launch the firework 75% of the time and
     * create new instances of the firework
     * We will also update the new hue for 
     * the next firework using markov chain
     * 
     */

    const readyToLaunch = Math.random() < .75
    if (readyToLaunch && fireworks.length < maxFireWorks) {
		fireworks.push(new FireWork());
        setNewHue()
        console.log(markovHue, currentHueLevel)
	}

    // Reset canvas to remove trails of the particles
	context.fillStyle = "rgba(240, 240, 240, 0.05)";
	context.fillRect(0, 0, screenWidth, screenHeight);

	createScene();
    cleanFireWorksAndParticles();

    // Continues frame animations
    requestAnimationFrame(frameAnimation);
}

class MarkovChain {
    constructor(transitionMatrix) {
        /**
         * Use markov chains to determine the next hue value within the RGB spectrum
         * 
         * Args:
         *      transitionMatrix (object): RGB transition probabilities
         */
        this.transitionMatrix = transitionMatrix
    }
    randomChoice() {
        /**
         * Gets either R/G/B based on probability of our current RGB hue value
         * 
         * Calculated random choice by multiplying probability by 10 and 
         * filling the distribution array with letter frequency
         * 
         * If we are currently on R value, the distribution array will be
         * [R,R,G,G,G,G,B,B,B,B]. We will use random to choose next letter
         * 
         * Args:
         *      None
         */

        const getHueMatrix = Object.entries(this.transitionMatrix[currentHueLevel])
        let distribution = []
        getHueMatrix.forEach(v => {
            const possibleColor = v[0]
            const possibility = v[1] * 10
            let newPossibilities = Array(possibility).fill(possibleColor)
            distribution = [...distribution, ...newPossibilities]
        })        
        const nextRGBValue = distribution[Math.floor((Math.random() * distribution.length))]
        return nextRGBValue
    }
    getNextColor () {
        /**
         * Using the next R/G/B value we got from markov chains,
         * we will generate a random hue based on the value we got
         * 
         * Args:
         *      None
         */
        const nextRGBValue = this.randomChoice()
        currentHueLevel = nextRGBValue
        if(nextRGBValue == 'R') {
            const redHue = getRandomInt(0, 119)
            return redHue
        }
        if(nextRGBValue == 'G') {
            const greenHue = getRandomInt(120, 240) 
            return greenHue
        }
        if(nextRGBValue == 'B') {
            const blueHue = getRandomInt(241, 359) 
            return blueHue
        }
    }
}

class FireWork {
    constructor() {
        /**
         * Create a firework with different properties
         * 
         * Class inspiration and credits to: 
         * https://codepen.io/MinzCode/pen/KKNKVGM
         * 
         * Args: 
         *      None
         */
        this.posX = getRandomInt(screenWidth * .2, screenWidth * .8)
        this.posY = screenHeight
        this.targetHeight = getRandomInt(screenHeight * .2, screenHeight * .4)
        this.markovHue = markovHue;
		this.alpha = 1;
		this.particleLife = 0;
		this.lifeSpan = getRandomInt(50, 100);
        this.randomShape = ''
    }
    setRandomShape() {
        /**
         * Pick a random shape between Triangle, Circle, SemiCircle, and Square
         * 
         * Args:
         *      None
         */
        const randomNumber = Math.floor(Math.random() * 4)
        if (randomNumber == 0) this.randomShape = 'Triangle'
        if (randomNumber == 1) this.randomShape = 'Circle'
        if (randomNumber == 2) this.randomShape = 'SemiCircle'
        if (randomNumber == 3) this.randomShape = 'Square'
    }

    drawShape() {
        /**
         * Draw corresponding shape based on randomShape
         * 
         * Args: 
         *      None
         */
        if (this.randomShape == 'Triangle') {
            context.moveTo(this.posX, this.posY);
            context.lineTo(this.posX + 5, this.posY + 5);
            context.lineTo(this.posX + 5, this.posY - 5);    
        }
        if (this.randomShape == 'Circle') {
            context.arc(this.posX, this.posY, this.size, 0, Math.PI * 2);
        }
        if (this.randomShape == 'SemiCircle') {
            context.arc(this.posX, this.posY, this.size, 0, Math.PI);
        }
        if (this.randomShape == 'Square') {
            context.rect(this.posX, this.posY, 5, 5)
            
        }            
    }
    draw() {
        /**
         * Continue to draw the shape as life as it hasn't reached its lifespan
         * 
         * Args: 
         *      None
         */
        if (this.particleLife <= this.lifeSpan) {
            context.beginPath();
            this.setRandomShape()
            this.drawShape()
            context.fillStyle = `hsla(${this.markovHue}, 100%, 50%, ${this.alpha})`;
            context.fill();
            context.closePath();
		}
    }
    update() {
        /**
         * Updates the current firework particle by launching it
         * upwards 
         * 
         * Args:
         *      None
         */

        this.particleLife++;
		let progress = 1 - (this.lifeSpan - this.particleLife) / this.lifeSpan;
        this.posX += Math.sin(Math.floor(Math.random()*(360)))
		this.posY = canvas.height - (canvas.height - this.targetHeight) * easeInCirc(progress);
		this.alpha = 1 - easeInCirc(progress);
	}
}

class Particle {
	constructor(posX, posY, markovHue, i, directionX, directionY) {
        /**
         * Create a particle with different properties
         * 
         * Class inspiration and credits to: 
         * https://codepen.io/MinzCode/pen/KKNKVGM
         * 
         * Args: None
         */
		this.posX = posX;
		this.posY = posY;
		this.markovHue = markovHue;
		this.size = getRandomInt(2, 3)
		this.speed = getRandomInt(30, 40) / 10
		this.angle = getRandomInt(0, 36) + 36 * i
        this.randomShape = ''
	}
    setRandomShape() {
        /**
         * Pick a random shape between Triangle, Circle, SemiCircle, and Square
         * 
         * Args:
         *      None
         */
        const randomNumber = Math.floor(Math.random() * 4)
        if (randomNumber == 0) this.randomShape = 'Triangle'
        if (randomNumber == 1) this.randomShape = 'Circle'
        if (randomNumber == 2) this.randomShape = 'SemiCircle'
        if (randomNumber == 3) this.randomShape = 'Square'
    }
    drawShape() {
        /**
         * Draw corresponding shape based on randomShape
         * 
         * Args: 
         *      None
         */
        if (this.randomShape == 'Triangle') {
            context.moveTo(this.posX, this.posY);
            context.lineTo(this.posX + 5, this.posY + 5);
            context.lineTo(this.posX + 5, this.posY - 5);    
        }
        if (this.randomShape == 'Circle') {
            context.arc(this.posX, this.posY, this.size, 0, Math.PI * 2);
        }
        if (this.randomShape == 'SemiCircle') {
            context.arc(this.posX, this.posY, this.size, 0, Math.PI);
        }
        if (this.randomShape == 'Square') {
            context.rect(this.posX, this.posY, 5, 5)
            
        }            
    }

	draw() {
        /**
         * Continue to draw the particle
         * 
         * Args: 
         *      None
         */
		if (this.size > 0) {
			context.beginPath();
            this.setRandomShape()
            this.drawShape()
            context.fillStyle = `hsla(${this.markovHue}, 100%, 50%, 1)`;
			context.fill();
			context.closePath();
		}
	}

	update() {
        /**
         * Explosion physics, 
         * 
         * Args:
         *      None
         * 
         */
		this.radian = (Math.PI / 180) * this.angle;
		this.posX += this.speed * Math.sin(this.radian);
		this.posY += this.speed * Math.cos(this.radian);
		this.size -= 0.05;
    }
}


const boomBtn = document.getElementById('boom-button')
const restartBtn = document.getElementById('restart-button')
const input = document.getElementById('input-field')

restartBtn.addEventListener('click', () => {
    /**
     * Reload page if user presses restart
     * 
     * Args:
     *      None
     */
    location.reload()
})

boomBtn.addEventListener('click', function() {
    /**
     * If the user presses the boom button, it will
     * check for any value in the input and start the show!
     * 
     * If there is no value in the input, it will default
     * to 5 fireworks for the show
     * 
     * Args:
     *      None
     */
    const inputValue = input.value
    input.disabled = true
    boomBtn.disabled = true
    maxFireWorks = inputValue ? inputValue : 5;
    if(!inputValue) {
        document.getElementById('input-field').value = 5
    }
    setupInitialization()
})

window.addEventListener('resize', windowResizeAdjustment)
