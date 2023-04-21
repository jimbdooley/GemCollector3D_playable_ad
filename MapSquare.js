
function MapSquare_setNextXY(curr, i, mapSpace, gemMapSpace) {
    const th = PIF * i * 0.5
    this.spots[this.adj[curr][i]].x = this.spots[curr].x + Math.cos(th) * mapSpace
    this.spots[this.adj[curr][i]].y = this.spots[curr].y + Math.sin(th) * mapSpace
    this.gemSpots[this.adj[curr][i]][0] = this.gemSpots[curr][0] + Math.cos(th) * gemMapSpace
    this.gemSpots[this.adj[curr][i]][1] = this.gemSpots[curr][1] + Math.sin(th) * gemMapSpace
}

function MapSquare_prepCheck() {
    while (this.lefts.length > 0) this.lefts.pop()
    while (this.bots.length > 0) this.bots.pop()
    for (let i = 0; i < this.adj.length; i++) {
        if (this.adj[i][2] == -1 && this.adj[i][0] != -1) this.lefts.push(i)
        if (this.adj[i][3] == -1 && this.adj[i][1] != -1) this.bots.push(i)
    }
    while (this.finishCheck.rowPassed.length > 0) this.finishCheck.rowPassed.pop() 
    while (this.finishCheck.startStop.length > 0) this.finishCheck.startStop.pop() 
    while (this.finishCheck.indexMap.length > 0) this.finishCheck.indexMap.pop() 
    while (this.finishCheck.scores.length > 0) this.finishCheck.scores.pop()
    for (let i = 0; i < this.lefts.length + this.bots.length; i++) this.finishCheck.rowPassed.push(0)
    for (let i = 0; i < this.lefts.length + this.bots.length; i++) this.finishCheck.startStop.push([-999, -999, -999, -999])
    for (let i = 0; i < this.lefts.length + this.bots.length; i++) this.finishCheck.indexMap.push([])
    for (let i = 0; i < this.lefts.length + this.bots.length; i++) this.finishCheck.scores.push([])
    for (let i = this.lefts.length-1; i >= 1; i--) {
        for (let j = 0; j < i; j++) {
            const temp = this.lefts[j]
            this.lefts[j] = this.lefts[j+1]
            this.lefts[j+1] = temp
        }
    }
    for (let i = this.bots.length-1; i >= 1; i--) {
        for (let j = 0; j < i; j++) {
            const temp = this.bots[j]
            this.bots[j] = this.bots[j+1]
            this.bots[j+1] = temp
        }
    }
    for (let i = 0; i < this.lefts.length; i++) {
        let curr = this.lefts[i]
        this.finishCheck.indexMap[i].push(curr)
        this.finishCheck.scores[i].push(0)
        while (this.adj[curr][0] != -1) {
            curr = this.adj[curr][0]
            this.finishCheck.indexMap[i].push(curr)
            this.finishCheck.scores[i].push(0)
        }
    }
    for (let i = 0; i < this.bots.length; i++) {
        let curr = this.bots[i]
        this.finishCheck.indexMap[this.lefts.length + i].push(curr)
        this.finishCheck.scores[this.lefts.length + i].push(0)
        while (this.adj[curr][1] != -1) {
            curr = this.adj[curr][1]
            this.finishCheck.indexMap[this.lefts.length + i].push(curr)
            this.finishCheck.scores[this.lefts.length + i].push(0)
        }
    }
}

function MapSquare_check(allCards, boardArr) {
    this.finishCheck.passed = true
    let count = 0
    const visited = []
    for (let h = 0; h < this.arrs.length; h++) {
        for (i of this.arrs[h]) {
            while (visited.length > 0) visited.pop()
            let curr = i
            while (true) {
                visited.push(boardArr[curr])
                if (this.adj[curr][h] != -1) {
                    curr = this.adj[curr][h]
                } else {
                    break
                }
            }
            const colorPassed = this.checkRowForColor(allCards, visited)
            const shapePassed = this.checkRowForShape(allCards, visited)
            this.finishCheck.addToScores(count, allCards, visited, colorPassed, shapePassed)
            this.finishCheck.passed &= colorPassed || shapePassed
            this.finishCheck.rowPassed[count] = (colorPassed ? 2 : 0) + (shapePassed ? 1 : 0)
            this.finishCheck.startStop[count][0] = this.spots[i].x
            this.finishCheck.startStop[count][1] = this.spots[i].y
            this.finishCheck.startStop[count][2] = this.spots[curr].x
            this.finishCheck.startStop[count][3] = this.spots[curr].y
            count += 1
        }
    }
}

function MapSquare_addCorners(mapUnit, gemMapUnit) {
    for (let i = 0; i < this.spots.length; i++) {
        this.corners.push([
            [this.spots[i].x + mapUnit, this.spots[i].y + mapUnit, BOARD_Z],
            [this.spots[i].x - mapUnit, this.spots[i].y + mapUnit, BOARD_Z],
            [this.spots[i].x - mapUnit, this.spots[i].y - mapUnit, BOARD_Z],
            [this.spots[i].x + mapUnit, this.spots[i].y - mapUnit, BOARD_Z],
        ])
        this.gemCorners.push([
            [this.gemSpots[i][0] + gemMapUnit, this.gemSpots[i][1] + gemMapUnit, GEM_Z],
            [this.gemSpots[i][0] - gemMapUnit, this.gemSpots[i][1] + gemMapUnit, GEM_Z],
            [this.gemSpots[i][0] - gemMapUnit, this.gemSpots[i][1] - gemMapUnit, GEM_Z],
            [this.gemSpots[i][0] + gemMapUnit, this.gemSpots[i][1] - gemMapUnit, GEM_Z],
        ])
    }
}

function MapSquare_drawState(dx) {
    const screenWorldX = xDistFromZAndDeviceRegion(BOARD_Z, World.regionMap)
    for (let i = 0; i < this.spots.length; i++) {
        const temp = this.spots[i].x
        this.spots[i].x -= dx * screenWorldX
        //this.spots[i].sx = 1
        //this.spots[i].sy = 1
        DrawerVanilla.draw(this.spots[i], "shade", PosNormIndTexs.map_square)
        const tempZ = this.spots[i].z
        const tempSX = this.spots[i].sx
        const tempSY = this.spots[i].sy
        this.spots[i].z += 0.1
        this.spots[i].sx *= 0.85
        this.spots[i].sy *= 0.85
        DrawerVanilla.draw(this.spots[i], "map_square", PosNormIndTexs.map_square)
        this.spots[i].z = tempZ
        this.spots[i].sx = tempSX
        this.spots[i].sy = tempSY
        this.spots[i].x = temp
    }
}

function MapSquare() {
    const r = MapM()
    r.mapType = MapType.SQUARE
    r.SPOT_SPACE_R = 0
    r.lefts = []
    r.bots = []
    r.arrs = [r.lefts, r.bots]
    r.prepCheck = MapSquare_prepCheck
    r.check = MapSquare_check
    r.setNextXY = MapSquare_setNextXY
    r.addCorners = MapSquare_addCorners
    r.drawStage = MapSquare_drawState
    return r
}