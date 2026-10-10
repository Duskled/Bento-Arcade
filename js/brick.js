const brickCanvas = document.createElement('canvas')
const brickCtx = brickCanvas.getContext('2d')

let paddleWidth = 100
let paddleHeight = 15
let paddleX
let ballX
let ballY
let ballDX = 5
let ballDY = -5
let ballRadius = 8
let rightPressed = false
let leftPressed = false
let brickScore = 0
let brickGameState = 'INIT'
let brickLoop

let brickRowCount = 5
let brickColumnCount = 7
let brickWidth = 65
let brickHeight = 20
let brickPadding = 12
let brickOffsetTop = 60
let brickOffsetLeft = 35
let bricks = []

function initBrick() {
    paddleX = (600 - paddleWidth) / 2
    ballX = 300
    ballY = 550
    ballDX = 5
    ballDY = -5
    brickScore = 0
    bricks = []
    
    for(let c = 0; c < brickColumnCount; c++) {
        bricks[c] = []
        for(let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 }
        }
    }
}

function startBrickGame() {
    const container = document.querySelector('.games-container')
    container.innerHTML = '<header class="page-header"><h1>BRICK BREAKER</h1></header>'
    
    brickCanvas.width = 600
    brickCanvas.height = 600
    brickCanvas.style.display = 'block'
    brickCanvas.style.margin = '0 auto'
    brickCanvas.style.border = '4px solid var(--accent-primary)'
    brickCanvas.style.boxShadow = '10px 10px 0px var(--accent-dark)'
    brickCanvas.style.background = '#0f0f0f'
    
    container.appendChild(brickCanvas)
    
    document.addEventListener('keydown', handleBrickKeyDown, { passive: false })
    document.addEventListener('keyup', handleBrickKeyUp)
    
    brickGameState = 'INIT'
    initBrick()
    drawBrickStartScreen()
}

function drawBrickStartScreen() {
    brickCtx.fillStyle = '#0f0f0f'
    brickCtx.fillRect(0, 0, brickCanvas.width, brickCanvas.height)
    
    brickCtx.fillStyle = '#ffffff'
    brickCtx.font = '40px VT323'
    brickCtx.textAlign = 'center'
    brickCtx.fillText('PRESS SPACE TO START', brickCanvas.width/2, brickCanvas.height/2)
    brickCtx.font = '24px VT323'
    brickCtx.fillText('USE LEFT & RIGHT ARROWS', brickCanvas.width/2, brickCanvas.height/2 + 40)
}

function drawBrickGameOverScreen(won) {
    brickCtx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    brickCtx.fillRect(0, 0, brickCanvas.width, brickCanvas.height)
    
    brickCtx.fillStyle = won ? '#a2d149' : '#e62b2b'
    brickCtx.font = '60px VT323'
    brickCtx.textAlign = 'center'
    brickCtx.fillText(won ? 'YOU WIN!' : 'GAME OVER', brickCanvas.width/2, brickCanvas.height/2 - 20)
    
    brickCtx.fillStyle = '#ffffff'
    brickCtx.font = '30px VT323'
    brickCtx.fillText('SCORE: ' + brickScore, brickCanvas.width/2, brickCanvas.height/2 + 30)
    
    brickCtx.fillStyle = '#aaaaaa'
    brickCtx.font = '24px VT323'
    brickCtx.fillText('PRESS SPACE TO RESTART', brickCanvas.width/2, brickCanvas.height/2 + 80)
}

function drawBall() {
    brickCtx.beginPath()
    brickCtx.arc(ballX, ballY, ballRadius, 0, Math.PI*2)
    brickCtx.fillStyle = '#ffffff'
    brickCtx.fill()
    brickCtx.closePath()
}

function drawPaddle() {
    brickCtx.beginPath()
    brickCtx.rect(paddleX, brickCanvas.height - paddleHeight - 10, paddleWidth, paddleHeight)
    brickCtx.fillStyle = '#e62b2b'
    brickCtx.fill()
    brickCtx.closePath()
}

function drawBricks() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop
                bricks[c][r].x = brickX
                bricks[c][r].y = brickY
                brickCtx.beginPath()
                brickCtx.rect(brickX, brickY, brickWidth, brickHeight)
                brickCtx.fillStyle = r % 2 === 0 ? '#489c2a' : '#a2d149'
                brickCtx.fill()
                brickCtx.closePath()
            }
        }
    }
}

function collisionDetection() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r]
            if(b.status === 1) {
                if(ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
                    ballDY = -ballDY
                    b.status = 0
                    brickScore += 10
                    
                    if(brickScore === brickRowCount * brickColumnCount * 10) {
                        brickGameState = 'WIN'
                        cancelAnimationFrame(brickLoop)
                        drawBrickGameOverScreen(true)
                    }
                }
            }
        }
    }
}

function tickBrick() {
    if(brickGameState !== 'PLAYING') return
    
    brickCtx.clearRect(0, 0, brickCanvas.width, brickCanvas.height)
    
    drawBricks()
    drawBall()
    drawPaddle()
    collisionDetection()
    
    brickCtx.fillStyle = '#ffffff'
    brickCtx.font = '24px VT323'
    brickCtx.textAlign = 'left'
    brickCtx.fillText('SCORE: ' + brickScore, 15, 30)
    
    if(ballX + ballDX > brickCanvas.width - ballRadius || ballX + ballDX < ballRadius) {
        ballDX = -ballDX
    }
    if(ballY + ballDY < ballRadius) {
        ballDY = -ballDY
    } else if(ballY + ballDY > brickCanvas.height - ballRadius - paddleHeight - 10) {
        if(ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballDY = -ballDY
            ballDX = ballDX + (ballX - (paddleX + paddleWidth/2)) * 0.1
        } else if(ballY + ballDY > brickCanvas.height - ballRadius) {
            brickGameState = 'OVER'
            cancelAnimationFrame(brickLoop)
            drawBrickGameOverScreen(false)
            return
        }
    }
    
    if(rightPressed && paddleX < brickCanvas.width - paddleWidth) {
        paddleX += 7
    } else if(leftPressed && paddleX > 0) {
        paddleX -= 7
    }
    
    ballX += ballDX
    ballY += ballDY
    
    brickLoop = requestAnimationFrame(tickBrick)
}

function handleBrickKeyDown(e) {
    if(e.keyCode === 39) {
        rightPressed = true
    } else if(e.keyCode === 37) {
        leftPressed = true
    }
    
    if(e.keyCode === 32) {
        e.preventDefault()
        if(brickGameState === 'INIT' || brickGameState === 'OVER' || brickGameState === 'WIN') {
            initBrick()
            brickGameState = 'PLAYING'
            if(brickLoop) cancelAnimationFrame(brickLoop)
            tickBrick()
        }
    }
    
    if([32, 37, 38, 39, 40].includes(e.keyCode) && brickGameState === 'PLAYING') {
        e.preventDefault()
    }
}

function handleBrickKeyUp(e) {
    if(e.keyCode === 39) {
        rightPressed = false
    } else if(e.keyCode === 37) {
        leftPressed = false
    }
}

const brickBtn = document.querySelector('a[href="#play-brick"]')
if (brickBtn) {
    brickBtn.addEventListener('click', function(e) {
        e.preventDefault()
        startBrickGame()
    })
}