
const MapType = {
    NULL: {maxScale: 1},
    SQUARE: {maxScale: 1.1},
    OCT: {maxScale: 1.2},
    HEX: {maxScale: 1.3},
    HEX_ONE_SQUARE: {maxScale: 1.5}
}
for (const key in MapType) MapType[key].name = key

function mapTypeToMap(mapType) {
    if (mapType == MapType.SQUARE) return MapSquare()
    if (mapType == MapType.HEX) return MapHex()
    if (mapType == MapType.HEX_ONE_SQUARE) return MapHexSquare()
    if (mapType == MapType.OCT) return MapOct()
    return MapSquare()
}

function FinishCheck(){
    const r = {}
    r.passed = false
    r.rowPassed = []
    r.startStop = []
    r.scores = []
    r.indexMap = []
    r.getNumScores = FinishCheck_getNumScores
    r.addToScores = FinishCheck_addToScores
    r.show = FinishCheck_show
    return r
}

function FinishCheck_getNumScores() {
    let rtn = 0
    for (let i = 0; i < this.scores.length; i++) {
        for (let j = 0; j < this.scores[i].length; j++) {
            rtn += 1
        }
    }
    return rtn
}

function FinishCheck_addToScores(i, allCards, visited, colorPassed, shapePassed) {
    let hasCounterfeitCard = false
    for (const cardI of visited) {
        if (cardI == -1) continue
        hasCounterfeitCard = hasCounterfeitCard || allCards[cardI].cardType == CardType.GEM_COUNTERFEIT
    }
    for (let j = 0; j < visited.length; j++) {
        let score = 0
        if (colorPassed) score += 1
        if (shapePassed) score += 1
        if (score > 0) {
            if (hasCounterfeitCard) score = 1
            if (allCards[visited[j]].cardType == CardType.GEM_COUNTERFEIT) score = 0
            if (allCards[visited[j]].cardType == CardType.GEM_PLATED) score *= 2
        }
        this.scores[i][j] = score
    }
}

function FinishCheck_show() {
    let passedArrStr = ""
    for (const el of this.rowPassed) passedArrStr += `${el}, `
    for (const scoreRow of this.scores) {
        let s = ""
        for (el of scoreRow) {
            s += `${el}, `
        }
        passedArrStr += `\n${s}`
    }
}

function doNothing() {}
function doNothingOneArg(a) {}
function doNothingTwoArgs(a, b) {}
function doNothingFourArgs(a, b, c, d) {}

function MapM () {
    const r = {}
    r.mapType = MapType.NULL
    r.SPOT_SPACE_R = 0.0
    r.setNextXY = doNothingFourArgs
    r.addCorners = doNothingTwoArgs
    r.loadMap = MapM_loadMap
    r.drawStage = doNothingOneArg
    r.checkRowForColor = MapM_checkRowForColor
    r.checkRowForShape = MapM_checkRowForShape
    r.check = doNothingTwoArgs
    r.prepCheck = doNothing
    r.finishCheck = FinishCheck()
    r.loadArrs = MapM_loadArrs
    r.adjString = ""
    r.adj = []
    r.hesqTypes = []
    r.corners = []
    r.gemCorners = []
    r.spots = []
    r.gemSpots = []
    r.minXYMaxXY = [0, 0, 0, 0]
    r.mmScale = 0
    r.gemMinXYMaxXY = [0, 0, 0, 0]
    r.gmmScale = 0
    return r
}

function MapM_loadArrs(s, mapType) {
    this.adjString = s
    let currS = ""
    let inBrackets = false
    for (let i = 1; i < s.length - 1; i++) {
        if (s[i] == '[') {
            this.adj.push([])
            inBrackets = true
        } else if (s[i] == ']') {
            this.adj[this.adj.length-1].push(parseInt(currS))
            currS = ""
            inBrackets = false
        } else if (s[i] == ',' && inBrackets) {
            this.adj[this.adj.length-1].push(parseInt(currS))
            currS = ""
        } else if (s[i] != ','){
            currS += s[i]
        }
    }
    while (this.hesqTypes.length > 0) this.hesqTypes.pop()
    if (mapType == MapType.HEX_ONE_SQUARE) {
        for (const el of this.adj) {
            this.hesqTypes.push(el.pop())
        }
    }
}

function MapM_loadMap(mapUnit, gemMapUnit) {
    const mapSpace = mapUnit * (2 + this.SPOT_SPACE_R)
    const gemMapSpace = gemMapUnit * (2 + this.SPOT_SPACE_R)
    const visited = []
    while (this.spots.length > 0) this.spots.pop()
    while (this.gemSpots.length > 0) this.gemSpots.pop()
    while (this.corners.length > 0) this.corners.pop()
    while (this.gemCorners.length > 0) this.gemCorners.pop()
    for (let i = 0; i < this.adj.length; i++) {
        visited.push(false)
        if (this.mapType == MapType.HEX_ONE_SQUARE) {
            if (this.adj[i].length == 6) {
                this.spots.push(DisplayObject([0, 0, 0], [mapUnit, mapUnit, mapUnit]))
            } else {
                const halfUnit = 0.5 * mapUnit
                this.spots.push(DisplayObject([0, 0, 0], [halfUnit, halfUnit, halfUnit]))
            }
        } else {
            this.spots.push(DisplayObject([0, 0, 0], [mapUnit, mapUnit, mapUnit]))
        }
        this.gemSpots.push([0, 0, 0])
    }
    const queue = [0]
    visited[0] = true
    this.spots[0].x = 0
    this.spots[0].y = 0
    this.spots[0].thZ = 0

    while (queue.length > 0) {
        const curr = queue.pop()
        for (let i = 0; i < this.adj[curr].length; i++) {
            if (this.adj[curr][i] == -1 || visited[this.adj[curr][i]]) continue
            visited[this.adj[curr][i]] = true
            queue.push(this.adj[curr][i])
            this.setNextXY(curr, i, mapSpace, gemMapSpace)
        }
    }

    this.addCorners(mapUnit, gemMapUnit)

    this.minXYMaxXY[0] = 10000
    this.minXYMaxXY[1] = 10000
    this.minXYMaxXY[2] = -10000
    this.minXYMaxXY[3] = -10000
    this.gemMinXYMaxXY[0] = 10000
    this.gemMinXYMaxXY[1] = 10000
    this.gemMinXYMaxXY[2] = -10000
    this.gemMinXYMaxXY[3] = -10000
    for (let i = 0; i < this.corners.length; i++) {
        for (let j = 0; j < this.corners[i].length; j++) {
            this.minXYMaxXY[0] = Math.min(this.minXYMaxXY[0], this.corners[i][j][0])
            this.minXYMaxXY[1] = Math.min(this.minXYMaxXY[1], this.corners[i][j][1])
            this.minXYMaxXY[2] = Math.max(this.minXYMaxXY[2], this.corners[i][j][0])
            this.minXYMaxXY[3] = Math.max(this.minXYMaxXY[3], this.corners[i][j][1])
            this.gemMinXYMaxXY[0] = Math.min(this.gemMinXYMaxXY[0], this.gemCorners[i][j][0])
            this.gemMinXYMaxXY[1] = Math.min(this.gemMinXYMaxXY[1], this.gemCorners[i][j][1])
            this.gemMinXYMaxXY[2] = Math.max(this.gemMinXYMaxXY[2], this.gemCorners[i][j][0])
            this.gemMinXYMaxXY[3] = Math.max(this.gemMinXYMaxXY[3], this.gemCorners[i][j][1])
        }
    }
    this.mmScale = mapUnit
    this.gmmScale = gemMapUnit
    this.prepCheck()
}

function MapM_checkRowForColor(allCards, visited) {
    let rtn = true
    for (let i = 0; i < visited.length - 1; i++) {
        for (let j = i + 1; j < visited.length; j++) {
            const empty = visited[i] == -1 || visited[j] == -1
            const colorMatch = (empty) ? false : gemColorEquals(allCards[visited[i]], allCards[visited[j]])
            rtn = rtn && colorMatch
        }
    }
    return rtn
}

function MapM_checkRowForShape(allCards, visited) {
    let rtn = true
    for (let i = 0; i < visited.length - 1; i++) {
        for (let j = i + 1; j < visited.length; j++) {
            const empty = visited[i] == -1 || visited[j] == -1
            const colorMatch = (empty) ? false : gemShapeEquals(allCards[visited[i]], allCards[visited[j]])
            rtn = rtn && colorMatch
        }
    }
    return rtn
}