
const LevelState = {
    NEEDS_INITIATION: {i: 0},
    DEAL_HAND: {i: 1},
    WAITING_FOR_PLAY: {i: 2},
    DISPLAYING: {i: 3},
    PICKAXE_CHOOSING: {i: 4},
    FINISH_FAIL: {i: 5},
    FINISHED: {i: 6},
    FINISHED_FINAL: {i: 7},
    FORFEITING: {i: 8},
    DISPLAYING_NUGGET: {i: 9},
    END_SCREEN: {i: 10},
}
for (const key in LevelState) LevelState[key].name = key
LevelState_values = [LevelState.NEEDS_INITIATION, LevelState.DEAL_HAND, LevelState.WAITING_FOR_PLAY,
LevelState.DISPLAYING, LevelState.PICKAXE_CHOOSING, LevelState.FINISH_FAIL, 
LevelState.FINISHED, LevelState.FINISHED_FINAL, LevelState.FORFEITING,
LevelState.DISPLAYING_NUGGET, LevelState.END_SCREEN]


function GameState() {
    const r = {
        iterable: [],
        hand: [],
        deck: [],
        board: [],
        pick: [],
    }
    r.setupIterable = GameState_setupIterable
    r.keepNum = 0
    r.score = 0
    r.levelState = LevelState.NEEDS_INITIATION
    r.mapI = 0
    r.rebuildFromSaveString = GameState_rebuildFromSaveString
    r.getSaveString = GameState_getSaveString
    r.shuffleDeck = GameState_shuffleDeck
    r.moveDeckToHand = GameState_moveDeckToHand
    r.copyTo = GameState_copyTo
    return r
}

function GameState_setupIterable() {
    while (this.iterable.length > 0) this.iterable.pop()
    for (const el of this.hand) this.iterable.push(el)
    for (const el of this.deck) this.iterable.push(el)
    for (const el of this.board) this.iterable.push(el)
    for (const el of this.pick) this.iterable.push(el)
}

function GameState_rebuildFromSaveString(s) {
    if (s != "") {
        const info = s.split("@")
        if (info[0].length > 0) {
            for (const handInfo of info[0].split("!")) this.hand.push(parseInt(handInfo))
        }
        if (info[1].length > 0) {
            for (const deckInfo of info[1].split("!")) this.deck.push(parseInt(deckInfo))
        }
        if (info[2].length > 0) {
            for (const boardInfo of info[2].split("!")) this.board.push(parseInt(boardInfo))
        }
        if (info[3].length > 0) {
            for (const pickInfo of info[3].split("!")) this.pick.push(parseInt(pickInfo))
        }
        keepNum = parseInt(info[4])
        score = parseInt(info[5])
        mapI = parseInt(info[6])

    }
}

function GameState_getSaveString() {
    let arrStr = ""
    for (const arr of [this.hand, this.deck, this.board, this.pick]) {
        for (let i = 0; i < arr.length; i++) {
            arrStr += `${arr[i]}` + (i < arr.length - 1 ? "!" : "")
        }
        arrStr += "@"
    }
    arrStr += `${this.keepNum}@${this.score}@${this.mapI}`
    return arrStr
}

function GameState_shuffleDeck() {
    for (let i = 0; i < this.deck.length - 1; i++) {
        const swapI = Math.floor(i + (this.deck.length-1) * Math.random())
        const temp = this.deck[i]
        this.deck[i] = this.deck[swapI]
        this.deck[swapI] = temp
    }
}

function GameState_moveDeckToHand(cardI) {
    const deckI = this.deck.indexOf(cardI)
    this.hand.push(cardI)
    for (let i = deckI; i < this.deck.length - 1; i++) {
        this.deck[i] = this.deck[i + 1]
    }
    this.deck.pop()
}

function GameState_copyTo(_gameState) {
    clear(_gameState.hand)
    clear(_gameState.deck)
    clear(_gameState.board)
    clear(_gameState.pick)
    for (el of this.hand) _gameState.hand.push(el)
    for (el of this.deck) _gameState.deck.push(el)
    for (el of this.board) _gameState.board.push(el)
    for (el of this.pick) _gameState.pick.push(el)
    _gameState.keepNum = this.keepNum
    _gameState.levelState = this.levelState
    _gameState.score = this.score
    _gameState.mapI = this.mapI
}