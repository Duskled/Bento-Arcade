const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
const mainView = document.querySelector('.games-container')

let snake = []
let food = {}
let dx = 20
let dy = 0
let score = 0
let gameLoop
let gameState = 'INIT'

function initSnake() {
    snake = [{x: 300, y: 300}, {x: 280, y: 300}, {x: 260, y: 300}]
    dx = 20
    dy = 0
    score = 0
    placeFood()
}

function startSnakeGame() {
    mainView.innerHTML = '<header class="page-header"><h1>SNAKE</h1></header>'
    
    canvas.width = 600
    canvas.height = 600
    canvas.style.display = 'block'
    canvas.style.margin = '0 auto'
    canvas.style.border = '4px solid var(--accent-primary)'
    canvas.style.boxShadow = '10px 10px 0px var(--accent-dark)'
    
    mainView.appendChild(canvas)
    
    document.addEventListener('keydown', handleKeys, { passive: false })
    
    gameState = 'INIT'
    initSnake()
    drawStartScreen()
}

function drawGrass() {
    for(let i = 0; i < canvas.width; i += 20) {
        for(let j = 0; j < canvas.height; j += 20) {
            if ((i / 20 + j / 20) % 2 === 0) {
                ctx.fillStyle = '#a2d149'
            } else {
                ctx.fillStyle = '#aad751'
            }
            ctx.fillRect(i, j, 20, 20)
        }
    }
}

function drawStartScreen() {
    drawGrass()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = '#ffffff'
    ctx.font = '40px VT323'
    ctx.textAlign = 'center'
    ctx.fillText('PRESS SPACE TO START', canvas.width/2, canvas.height/2)
}

function drawGameOverScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = '#e62b2b'
    ctx.font = '60px VT323'
    ctx.textAlign = 'center'
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 20)
    
    ctx.fillStyle = '#ffffff'
    ctx.font = '30px VT323'
    ctx.fillText('SCORE: ' + score, canvas.width/2, canvas.height/2 + 30)
    
    ctx.fillStyle = '#aaaaaa'
    ctx.font = '24px VT323'
    ctx.fillText('PRESS SPACE TO RESTART', canvas.width/2, canvas.height/2 + 80)
}

function tick() {
    if (gameState !== 'PLAYING') return

    let head = {x: snake[0].x + dx, y: snake[0].y + dy}
    
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || checkSelfCollision(head)) {
        gameState = 'OVER'
        clearInterval(gameLoop)
        drawGameOverScreen()
        return
    }
    
    snake.unshift(head)
    
    if (head.x === food.x && head.y === food.y) {
        score += 10
        placeFood()
    } else {
        snake.pop()
    }
    
    render()
}

function drawApple(x, y) {
    let cx = x + 10
    let cy = y + 10
    
    ctx.fillStyle = '#e7471d'
    ctx.beginPath()
    ctx.arc(cx, cy, 8, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.fillStyle = '#4c3222'
    ctx.fillRect(cx - 1, cy - 10, 2, 5)
    
    ctx.fillStyle = '#409c34'
    ctx.beginPath()
    ctx.arc(cx + 4, cy - 7, 4, 0, Math.PI * 2)
    ctx.fill()
}

function drawSnake() {
    snake.forEach((part, index) => {
        let cx = part.x + 10
        let cy = part.y + 10
        
        if (index === 0) {
            ctx.fillStyle = '#408226'
            ctx.beginPath()
            ctx.arc(cx, cy, 10, 0, Math.PI * 2)
            ctx.fill()
            
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            
            let eyeOffsetX = dx === 0 ? 4 : (dx > 0 ? 4 : -4)
            let eyeOffsetY = dy === 0 ? 4 : (dy > 0 ? 4 : -4)
            
            if (dx !== 0) {
                ctx.arc(cx + eyeOffsetX, cy - 4, 3, 0, Math.PI * 2)
                ctx.fill()
                ctx.beginPath()
                ctx.arc(cx + eyeOffsetX, cy + 4, 3, 0, Math.PI * 2)
                ctx.fill()
                
                ctx.fillStyle = '#000000'
                ctx.beginPath()
                ctx.arc(cx + eyeOffsetX + (dx > 0 ? 1 : -1), cy - 4, 1.5, 0, Math.PI * 2)
                ctx.fill()
                ctx.beginPath()
                ctx.arc(cx + eyeOffsetX + (dx > 0 ? 1 : -1), cy + 4, 1.5, 0, Math.PI * 2)
                ctx.fill()
            } else {
                ctx.arc(cx - 4, cy + eyeOffsetY, 3, 0, Math.PI * 2)
                ctx.fill()
                ctx.beginPath()
                ctx.arc(cx + 4, cy + eyeOffsetY, 3, 0, Math.PI * 2)
                ctx.fill()
                
                ctx.fillStyle = '#000000'
                ctx.beginPath()
                ctx.arc(cx - 4, cy + eyeOffsetY + (dy > 0 ? 1 : -1), 1.5, 0, Math.PI * 2)
                ctx.fill()
                ctx.beginPath()
                ctx.arc(cx + 4, cy + eyeOffsetY + (dy > 0 ? 1 : -1), 1.5, 0, Math.PI * 2)
                ctx.fill()
            }
        } else {
            ctx.fillStyle = '#489c2a'
            ctx.beginPath()
            ctx.arc(cx, cy, 9, 0, Math.PI * 2)
            ctx.fill()
        }
    })
}

function render() {
    drawGrass()
    drawApple(food.x, food.y)
    drawSnake()
    
    ctx.fillStyle = '#ffffff'
    ctx.font = '28px VT323'
    ctx.textAlign = 'left'
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(5, 5, 120, 35)
    
    ctx.fillStyle = '#ffffff'
    ctx.fillText('SCORE: ' + score, 15, 30)
}

function handleKeys(e) {
    const key = e.keyCode
    
    if ([32, 37, 38, 39, 40].includes(key)) {
        e.preventDefault()
    }

    if (key === 32) {
        if (gameState === 'INIT' || gameState === 'OVER') {
            initSnake()
            gameState = 'PLAYING'
            if (gameLoop) clearInterval(gameLoop)
            gameLoop = setInterval(tick, 100)
        }
    }
    
    if (gameState !== 'PLAYING') return

    if (key === 37 && dx !== 20) {
        dx = -20
        dy = 0
    }
    if (key === 38 && dy !== 20) {
        dx = 0
        dy = -20
    }
    if (key === 39 && dx !== -20) {
        dx = 20
        dy = 0
    }
    if (key === 40 && dy !== -20) {
        dx = 0
        dy = 20
    }
}

function checkSelfCollision(head) {
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true
        }
    }
    return false
}

function placeFood() {
    let validPosition = false
    while (!validPosition) {
        food.x = Math.floor(Math.random() * (canvas.width / 20)) * 20
        food.y = Math.floor(Math.random() * (canvas.height / 20)) * 20
        
        validPosition = true
        for (let i = 0; i < snake.length; i++) {
            if (food.x === snake[i].x && food.y === snake[i].y) {
                validPosition = false
                break
            }
        }
    }
}

const snakeBtn = document.querySelector('a[href="#play-snake"]')
if (snakeBtn) {
    snakeBtn.addEventListener('click', function(e) {
        e.preventDefault()
        startSnakeGame()
    })
}