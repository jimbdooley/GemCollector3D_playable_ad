
function MapHex_prepCheck() {
    while (this.lefts.length > 0) this.lefts.pop()
    while (this.botLefts.length > 0) this.botLefts.pop()
    while (this.botRights.length > 0) this.botRights.pop()
    for (let i = 0; i < this.adj.length; i++) {
        if (this.adj[i][3] == -1 && this.adj[i][0] != -1) this.lefts.push(i)
        if (this.adj[i][4] == -1 && this.adj[i][1] != -1) this.botLefts.push(i)
        if (this.adj[i][5] == -1 && this.adj[i][2] != -1) this.botRights.push(i)
    }
    const nRows = this.lefts.length + this.botLefts.length + this.botRights.length
    this.finishCheck.rowPassed = Array(nRows).fill(0)
    this.finishCheck.startStop = []
    this.finishCheck.indexMap = []
    this.finishCheck.scores = []
    for (let i = 0; i < nRows; i++) {
        this.finishCheck.startStop.push([-999, -999, -999, -999])
        this.finishCheck.indexMap.push([])
        this.finishCheck.scores.push([])
    }
    for (let i = this.lefts.length -1; i >= 1; i--) {
        for (let j = 0; j < i; j++) {
            if (this.spots[this.lefts[j]].y > this.spots[this.lefts[j+1]].y) {
                const temp = this.lefts[j]
                this.lefts[j] = this.lefts[j+1]
                this.lefts[j+1] = temp
            }
        }
    }
    for (let i = this.botLefts.length -1; i >= 1; i--) {
        for (let j = 0; j < i; j++) {
            if (this.spots[this.botLefts[j]].x > this.spots[this.botLefts[j+1]].x) {
                const temp = this.botLefts[j]
                this.botLefts[j] = this.botLefts[j+1]
                this.botLefts[j+1] = temp
            }
        }
    }
    for (let i = this.botRights.length -1; i >= 1; i--) {
        for (let j = 0; j < i; j++) {
            if (this.spots[this.botRights[j]].x > this.spots[this.botRights[j+1]].x) {
                const temp = this.botRights[j]
                this.botRights[j] = this.botRights[j+1]
                this.botRights[j+1] = temp
            }
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
    for (let i = 0; i < this.botLefts.length; i++) {
        let curr = this.botLefts[i]
        this.finishCheck.indexMap[this.lefts.length + i].push(curr)
        this.finishCheck.scores[this.lefts.length + i].push(0)
        while (this.adj[curr][1] != -1) {
            curr = this.adj[curr][1]
            this.finishCheck.indexMap[this.lefts.length + i].push(curr)
            this.finishCheck.scores[this.lefts.length + i].push(0)
        }
    }
    for (let i = 0; i < this.botRights.length; i++) {
        let curr = this.botRights[i]
        this.finishCheck.indexMap[this.botLefts.length + this.lefts.length + i].push(curr)
        this.finishCheck.scores[this.botLefts.length + this.lefts.length + i].push(0)
        while (this.adj[curr][2] != -1) {
            curr = this.adj[curr][2]
            this.finishCheck.indexMap[this.botLefts.length + this.lefts.length + i].push(curr)
            this.finishCheck.scores[this.botLefts.length + this.lefts.length + i].push(0)
        }
    }
}

function MapHex_check(allCards, boardArr) {
    this.finishCheck.passed = true
    let count = 0
    const visited = []
    for (let h = 0; h < this.arrs.length; h++) {
        for (const i of this.arrs[h]) {
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
            this.finishCheck.passed = this.finishCheck.passed && (colorPassed || shapePassed)
            this.finishCheck.rowPassed[count] = (colorPassed ? 2 : 0) + (shapePassed ? 1 : 0)
            this.finishCheck.startStop[count][0] = this.spots[i].x
            this.finishCheck.startStop[count][1] = this.spots[i].y
            this.finishCheck.startStop[count][2] = this.spots[curr].x
            this.finishCheck.startStop[count][3] = this.spots[curr].y
            count += 1
        }
    }
}

function MapHex_setNextXY(curr, i, mapSpace, gemMapSpace) {
    const th = Math.PI * i * ONE_THIRD
    this.spots[this.adj[curr][i]].x = this.spots[curr].x + Math.cos(th) * mapSpace * Math.sqrt(0.75)
    this.spots[this.adj[curr][i]].y = this.spots[curr].y + Math.sin(th) * mapSpace * Math.sqrt(0.75)
    this.gemSpots[this.adj[curr][i]][0] = this.gemSpots[curr][0] + Math.cos(th) * gemMapSpace * Math.sqrt(0.75)
    this.gemSpots[this.adj[curr][i]][1] = this.gemSpots[curr][1] + Math.sin(th) * gemMapSpace * Math.sqrt(0.75)
}

function MapHex_addCorners(mapUnit, gemMapUnit) {
    for (let i = 0; i < this.spots.length; i++) {
        const cornersToAdd = []
        const gemCornersToAdd = []
        for (let j = 0; j < 6; j++) {
            const th = Math.PI/6 + j * Math.PI * ONE_THIRD
            cornersToAdd.push([
                this.spots[i].x + mapUnit * Math.cos(th),
                this.spots[i].y + mapUnit * Math.sin(th),
                BOARD_Z
            ])
            gemCornersToAdd.push([
                this.gemSpots[i][0] + gemMapUnit * Math.cos(th),
                this.gemSpots[i][1] + gemMapUnit * Math.sin(th),
                GEM_Z
            ])
        }
        this.corners.push(cornersToAdd)
        this.gemCorners.push(gemCornersToAdd)
    }
}

function MapHex_drawStage(dx) {
    const screenWorldX = xDistFromZAndDeviceRegion(BOARD_Z, World.regionMap)
    for (let i = 0; i < this.spots.length; i++) {
        const tempX = this.spots[i].x
        this.spots[i].x -= dx * screenWorldX
        DrawerVanilla.draw(this.spots[i], "shade", PosNormIndTexs.map_hexagon)

        const tempZ = this.spots[i].z
        const tempSX = this.spots[i].sx
        const tempSY = this.spots[i].sy
        this.spots[i].z += 0.1
        this.spots[i].sx *= 0.85
        this.spots[i].sy *= 0.85
        DrawerVanilla.draw(this.spots[i], "map_hexagon", PosNormIndTexs.map_hexagon)
        this.spots[i].z = tempZ
        this.spots[i].sx = tempSX
        this.spots[i].sy = tempSY

        this.spots[i].x = tempX
    }
}

function MapHex() {
    const r = MapM()
    r.mapType = MapType.HEX
    r.lefts = []
    r.botLefts = []
    r.botRights = []
    r.arrs = [r.lefts, r.botLefts, r.botRights]
    r.prepCheck = MapHex_prepCheck
    r.check = MapHex_check
    r.setNextXY = MapHex_setNextXY
    r.addCorners = MapHex_addCorners
    r.drawStage = MapHex_drawStage
    return r
}