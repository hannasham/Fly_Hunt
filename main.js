const gameState = {
  counterFlyKilled: 0,
  isRunning: false,
  showTime: 1000,
  timerTime: 20,
}

const cellCount = 20
let cellArray = []

function createElement(type, text, className) {
  let newEl = document.createElement(type)
  newEl.textContent = text
  if (className) {
    newEl.classList.add(className)
  }
  return newEl
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

function resetCell(cellEl, ...classNames) {
  cellEl.classList.remove(...classNames)
}

function updateTimerCounter() {
  counterSpanEl.timerNumberSpan.textContent = gameState.timerTime
}

function updateFlyCounter() {
  counterSpanEl.flyNumberSpan.textContent = gameState.counterFlyKilled
}

const elements = {
  counterText: createElement("div", "", "counter_text"),
  field: createElement("div", "", "window"),
  // timerText: createElement("div", `Timer for ${gameState.timerTime} sec.`, "timer_text"),
  timerText: createElement("div", "", "timer_text"),

  startBtnEl: createElement("button", "Start new game", "startBtn"),
}

const counterSpanEl = {
  flyNumberSpan: createElement("span", gameState.counterFlyKilled, "number_highlight"),
  timerNumberSpan: createElement("span", gameState.timerTime, "number_highlight"),

}
elements.counterText.append("You killed ", counterSpanEl.flyNumberSpan, " Flies!")


for (let i = 0; i < cellCount; i++) {
  let cellEl = createElement("div", "", "cell")
  cellArray.push(cellEl)
  elements.field.append(cellEl)

  cellEl.onclick = function () {
    if (gameState.isRunning) {
      if (cellEl.classList.contains("fly")) {
        gameState.counterFlyKilled++
        resetCell(cellEl, "fly")
        cellEl.classList.add("dead")
        updateFlyCounter()
      }
      else if (cellEl.classList.contains("cat")) {
        cellEl.classList.add("hit")
        gameOver()
      }
    }
  }
}


let timer

function startTimer() {
  clearInterval(timer)

  elements.timerText.textContent = ""
  elements.timerText.append("Timer stops in ", counterSpanEl.timerNumberSpan, " sec.")
  updateTimerCounter()


  gameState.isRunning = true
  timer = setInterval(() => {
    gameState.timerTime--
    updateTimerCounter()
    if (gameState.timerTime === 0) {
      gameOver()
    }
  }, 1000);
}

function newAimal() {
  if (gameState.isRunning) {
    setTimeout(() => {
      let cellActive = cellArray[getRandomNumber(0, cellCount)]

      if (getRandomNumber(0, 10) > 3) {
        cellActive.classList.add("fly")
      }
      else {
        cellActive.classList.add("cat")
      }

      setTimeout(() => {
        resetCell(cellActive, "fly", "cat", "dead")
        newAimal()
        gameState.showTime = Math.max(500, gameState.showTime - 100)
      }, gameState.showTime);

    }, getRandomNumber(500, 1000));
  }
}


function startGame() {
  elements.startBtnEl.onclick = () => {
    updateFlyCounter()

    elements.startBtnEl.disabled = true
    startTimer()
    newAimal()
  }
}

function startGameAgain() {
  elements.timerText.classList.add("game_over")


  elements.startBtnEl.textContent = "Start game again"
  elements.startBtnEl.onclick = function () {
    elements.timerText.classList.remove("game_over")
    elements.startBtnEl.disabled = true
    gameState.counterFlyKilled = 0

    updateFlyCounter()

    gameState.isRunning = false
    gameState.showTime = 1000
    gameState.timerTime = 20

    startTimer()
    newAimal()

  }
}


function gameOver() {
  gameState.isRunning = false
  elements.startBtnEl.disabled = false
  elements.timerText.textContent = "Game over!"
  cellArray.forEach((cellEl) => {
    resetCell(cellEl, "fly", "cat", "dead")
  })
  startGameAgain()
  clearInterval(timer)
  alert(`Game over! You killed ${gameState.counterFlyKilled} Flies!`)
}

startGame()

// document.body.append(elements.counterText, elements.field, elements.startBtnEl, elements.timerText)
document.body.append(...Object.values(elements))