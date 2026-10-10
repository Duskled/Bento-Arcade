const reactionCanvas = document.createElement('canvas')
const reactionCtx = reactionCanvas.getContext('2d')

let targetX = 0
let targetY = 0
let targetRadius = 30
let reactionScore = 0
let timeLeft = 30
let reactionGameState = 'INIT'
let reactionTimer
let reactionLoop

function initReaction() {
    reactionScore = 0
    timeLeft = 30
    spawnTarget()
}

function startReactionGame() {
    const container = document.querySelector('.games-container')
    container.innerHTML = '<header class="page-header"><h1>REACTION</h1></header>'
    
    reactionCanvas.width = 600
    reactionCanvas.height = 600
    reactionCanvas.style.display = 'block'
    reactionCanvas.style.margin = '0 auto'
    reactionCanvas.style.border = '4px solid var(--accent-primary)'
    reactionCanvas.style.boxShadow = '10px 10px 0px var(--accent-dark)'
    reactionCanvas.style.background = '#0f0f0f'
    reactionCanvas.style.cursor = 'crosshair'
    
    container.appendChild(reactionCanvas)
    
    document.addEventListener('keydown', handleReactionKeyDown, { passive: false })
    reactionCanvas.addEventListener('mousedown', handleReactionClick)
    
    reactionGameState = 'INIT'
    initReaction()
    drawReactionStartScreen()
}

function drawReactionStartScreen() {
    reactionCtx.fillStyle = '#0f0f0f'
    reactionCtx.fillRect(0, 0, reactionCanvas.width, reactionCanvas.height)
    
    reactionCtx.fillStyle = '#ffffff'
    reactionCtx.font = '40px VT323'
    reactionCtx.textAlign = 'center'
    reactionCtx.fillText('PRESS SPACE TO START', reactionCanvas.width/2, reactionCanvas.height/2)
    reactionCtx.font = '24px VT323'
    reactionCtx.fillText('CLICK THE TARGETS BEFORE TIME RUNS OUT', reactionCanvas.width/2, reactionCanvas.height/2 + 40)
}

function drawReactionGameOverScreen() {
    reactionCtx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    reactionCtx.fillRect(0, 0, reactionCanvas.width, reactionCanvas.height)
    
    reactionCtx.fillStyle = '#e62b2b'
    reactionCtx.font = '60px VT323'
    reactionCtx.textAlign = 'center'
    reactionCtx.fillText('TIME UP!', reactionCanvas.width/2, reactionCanvas.height/2 - 20)
    
    reactionCtx.fillStyle = '#ffffff'
    reactionCtx.font = '30px VT323'
    reactionCtx.fillText('FINAL SCORE: ' + reactionScore, reactionCanvas.width/2, reactionCanvas.height/2 + 30)
    
    reactionCtx.fillStyle = '#aaaaaa'
    reactionCtx.font = '24px VT323'
    reactionCtx.fillText('PRESS SPACE TO RESTART', reactionCanvas.width/2, reactionCanvas.height/2 + 80)
}

function spawnTarget() {
    let padding = 50
    targetX = Math.floor(Math.random() * (reactionCanvas.width - padding * 2)) + padding
    targetY = Math.floor(Math.random() * (reactionCanvas.height - padding * 2)) + padding
}

function startTimer() {
    if(reactionTimer) clearInterval(reactionTimer)
    reactionTimer = setInterval(() => {
        timeLeft--
        if(timeLeft <= 0) {
            clearInterval(reactionTimer)
            reactionGameState = 'OVER'
            cancelAnimationFrame(reactionLoop)
            drawReactionGameOverScreen()
        }
    }, 1000)
}

function tickReaction() {
    if(reactionGameState !== 'PLAYING') return
    
    reactionCtx.clearRect(0, 0, reactionCanvas.width, reactionCanvas.height)
    
    reactionCtx.beginPath()
    reactionCtx.arc(targetX, targetY, targetRadius, 0, Math.PI * 2)
    reactionCtx.fillStyle = '#e62b2b'
    reactionCtx.fill()
    
    reactionCtx.beginPath()
    reactionCtx.arc(targetX, targetY, targetRadius - 10, 0, Math.PI * 2)
    reactionCtx.fillStyle = '#ffffff'
    reactionCtx.fill()
    
    reactionCtx.beginPath()
    reactionCtx.arc(targetX, targetY, targetRadius - 20, 0, Math.PI * 2)
    reactionCtx.fillStyle = '#e62b2b'
    reactionCtx.fill()
    
    reactionCtx.fillStyle = '#ffffff'
    reactionCtx.font = '28px VT323'
    reactionCtx.textAlign = 'left'
    reactionCtx.fillText('SCORE: ' + reactionScore, 15, 30)
    
    reactionCtx.textAlign = 'right'
    reactionCtx.fillText('TIME: ' + timeLeft, reactionCanvas.width - 15, 30)
    
    reactionLoop = requestAnimationFrame(tickReaction)
}

function handleReactionClick(e) {
    if(reactionGameState !== 'PLAYING') return
    
    const rect = reactionCanvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const dist = Math.sqrt(Math.pow(mouseX - targetX, 2) + Math.pow(mouseY - targetY, 2))
    
    if(dist <= targetRadius) {
        reactionScore += 10
        spawnTarget()
    }
}

function handleReactionKeyDown(e) {
    if(e.keyCode === 32) {
        e.preventDefault()
        if(reactionGameState === 'INIT' || reactionGameState === 'OVER') {
            initReaction()
            reactionGameState = 'PLAYING'
            startTimer()
            if(reactionLoop) cancelAnimationFrame(reactionLoop)
            tickReaction()
        }
    }
}

const reactionBtn = document.querySelector('a[href="#play-reaction"]')
if (reactionBtn) {
    reactionBtn.addEventListener('click', function(e) {
        e.preventDefault()
        startReactionGame()
    })
}