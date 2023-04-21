
function Level_draw() {
    if (CUSTOM_LEVELS) {
        if (this.n == "1") {
            const latchReady = this.animationCtr[0] == 0 && this.currState.levelState == LevelState.WAITING_FOR_PLAY
            for (let i = 0; i < this.latchs_n1.length; i++) {
                if (this.currState.mapI == i && latchReady) this.latchs_n1[i] = true
                if (this.currState.mapI != i) this.latchs_n1[i] = false
                this.timers_n1[i] = this.latchs_n1[i] ? Math.min(1, this.timers_n1[i] + 0.003*World.dT_ms) : 0
            }
            if (this.latchs_n1[0]) {
                let solved = this.currState.board[0] == 0 && this.currState.board[1] == 1 && this.currState.board[2] == 2
                solved |= (this.currState.board[0] == 2 && this.currState.board[1] == 1 && this.currState.board[2] == 0)
                if (this.currState.board[0] == -1 && this.currState.board[1] == -1 && this.currState.board[2] == -1) {
                    for (let i = 1; i < 4; i++) this.tutRegShifted[i] = textnameToRegion[Textname.firstTap.name][i]
                    if (this.prev_1_0 != 0) this.timers_n1[0] = 0
                    this.tutRegShifted[0] = textnameToRegion[Textname.firstTap.name][0] - sCurve(1-this.timers_n1[0]) * World.regionMap[2]*0.25
                    DrawerText.draw(Textname.firstTap, BOARD_Z, this.tutRegShifted)
                    this.prev_1_0 = 0
                } else if (solved) {
                    for (let i = 1; i < 4; i++) this.tutRegShifted[i] = textnameToRegion[Textname.firstFinish.name][i]
                    if (this.prev_1_0 != 1) this.timers_n1[0] = 0
                    this.tutRegShifted[0] = textnameToRegion[Textname.firstFinish.name][0] - sCurve(1-this.timers_n1[0]) * World.regionMap[2]*0.25
                    DrawerText.draw(Textname.firstFinish, BOARD_Z, this.tutRegShifted)
                    this.prev_1_0 = 1
                } else {
                    if (this.prev_1_0 != 2) this.timers_n1[0] = 0
                    for (let i = 1; i < 4; i++) this.tutRegShifted[i] = textnameToRegion[Textname.match1.name][i]
                    this.tutRegShifted[0] = textnameToRegion[Textname.match1.name][0] - sCurve(1-this.timers_n1[0]) * World.regionMap[2]*0.25
                    DrawerText.draw(Textname.match1, BOARD_Z, this.tutRegShifted)
                    this.prev_1_0 = 2
                }
            }
            
            if (this.latchs_n1[1]) {
                for (let i = 1; i < 4; i++) this.tutRegShifted[i] = textnameToRegion[Textname.match2.name][i]
                this.tutRegShifted[0] = textnameToRegion[Textname.match2.name][0] - sCurve(1-this.timers_n1[1]) * World.regionMap[2]*0.25
                DrawerText.draw(Textname.match2, BOARD_Z, this.tutRegShifted)
            }
            if (this.latchs_n1[3]) {
                for (let i = 1; i < 4; i++) this.tutRegShifted[i] = textnameToRegion[Textname.firstDouble.name][i]
                this.tutRegShifted[0] = textnameToRegion[Textname.firstDouble.name][0] - sCurve(1-this.timers_n1[3]) * World.regionMap[2]*0.25
                DrawerText.draw(Textname.firstDouble, BOARD_Z, this.tutRegShifted)
            }
        }
    } else {
        if (this.n == "1") {
            const latchReady = this.animationCtr[0] == 0 && this.currState.levelState == LevelState.WAITING_FOR_PLAY
            for (let i = 0; i < this.latchs_n1.length; i++) {
                if (this.currState.mapI == i && latchReady) this.latchs_n1[i] = true
                if (this.currState.mapI != i) this.latchs_n1[i] = false
                this.timers_n1[i] = this.latchs_n1[i] ? Math.min(1, this.timers_n1[i] + 0.003*World.dT_ms) : 0
            }
            if (this.latchs_n1[0]) {
                if (this.currState.board[0] == -1 && this.currState.board[1] == -1 && this.currState.board[2] == -1) {
                    for (let i = 1; i < 4; i++) this.tutRegShifted[i] = textnameToRegion[Textname.firstTap.name][i]
                    if (this.prev_1_0 != 0) this.timers_n1[0] = 0
                    this.tutRegShifted[0] = textnameToRegion[Textname.firstTap.name][0] - sCurve(1-this.timers_n1[0]) * World.regionMap[2]*0.25
                    DrawerText.draw(Textname.firstTap, BOARD_Z, this.tutRegShifted)
                    this.prev_1_0 = 0
                } else if (this.currState.board[0] != -1 && this.currState.board[1] != -1 && this.currState.board[2] != -1) {
                    for (let i = 1; i < 4; i++) this.tutRegShifted[i] = textnameToRegion[Textname.firstFinish.name][i]
                    if (this.prev_1_0 != 1) this.timers_n1[0] = 0
                    this.tutRegShifted[0] = textnameToRegion[Textname.firstFinish.name][0] - sCurve(1-this.timers_n1[0]) * World.regionMap[2]*0.25
                    DrawerText.draw(Textname.firstFinish, BOARD_Z, this.tutRegShifted)
                    this.prev_1_0 = 1
                } else {
                    if (this.prev_1_0 != 2) this.timers_n1[0] = 0
                    for (let i = 1; i < 4; i++) this.tutRegShifted[i] = textnameToRegion[Textname.firstColor.name][i]
                    this.tutRegShifted[0] = textnameToRegion[Textname.firstColor.name][0] - sCurve(1-this.timers_n1[0]) * World.regionMap[2]*0.25
                    DrawerText.draw(Textname.firstColor, BOARD_Z, this.tutRegShifted)
                    this.prev_1_0 = 2
                }
            }
            if (this.latchs_n1[1]) {
                for (let i = 1; i < 4; i++) this.tutRegShifted[i] = textnameToRegion[Textname.firstShape.name][i]
                this.tutRegShifted[0] = textnameToRegion[Textname.firstShape.name][0] - sCurve(1-this.timers_n1[1]) * World.regionMap[2]*0.25
                DrawerText.draw(Textname.firstShape, BOARD_Z, this.tutRegShifted)
            }
            if (this.latchs_n1[2]) {
                let boardEmpty = true
                for (const el of this.currState.board) if (el != -1) boardEmpty = false
                if (!boardEmpty && this.prev_1_2) this.timers_n1[2] = 0
                for (let i = 1; i < 4; i++) this.tutRegShifted[i] = textnameToRegion[Textname.firstSwap.name][i]
                this.tutRegShifted[0]  = textnameToRegion[Textname.firstSwap.name][0] - sCurve(1-this.timers_n1[2]) * World.regionMap[2]*0.25
                if (!boardEmpty) DrawerText.draw(Textname.firstSwap, BOARD_Z, this.tutRegShifted)
                this.prev_1_2 = boardEmpty
            }
            if (this.latchs_n1[4]) {
                for (let i = 1; i < 4; i++) this.tutRegShifted[i] = textnameToRegion[Textname.firstDouble.name][i]
                this.tutRegShifted[0] = textnameToRegion[Textname.firstDouble.name][0] - sCurve(1-this.timers_n1[4]) * World.regionMap[2]*0.25
                DrawerText.draw(Textname.firstDouble, BOARD_Z, this.tutRegShifted)
            }
        }
    }
    
    if (this.currState.levelState == LevelState.DEAL_HAND) {
        const dx = sCurve(1 - this.animationCtr[0] / this.animationCtr[1])
        this.maps[this.currState.mapI - 1].drawStage(dx)
    } else if (this.prevState.levelState == LevelState.DEAL_HAND) {
        const dx = sCurve(this.animationCtr[0] / this.animationCtr[1])
        this.maps[this.currState.mapI].drawStage(dx)
    } else {
        this.maps[this.currState.mapI].drawStage(0)
    }
    this.currState.setupIterable()
    this.prevState.setupIterable()
    setPositions(
        this.allCards, 
        this.currState, 
        true, 
        this.maps[this.currState.mapI].spots, 
        this.maps[this.currState.mapI].gemSpots, 
        this.mapTypes[this.currState.mapI]
    )
    if (this.animationCtr[0] > 0) {
        setPositions(
            this.allCards, 
            this.prevState, 
            false, 
            this.maps[this.prevState.mapI].spots, 
            this.maps[this.prevState.mapI].gemSpots, 
            this.mapTypes[this.prevState.mapI]
        )
    }
    const prevR = sCurve(this.animationCtr[0] / this.animationCtr[1])
    for (let i = 0; i < this.currState.keepNum; i++) {
        this.handSaveRegion[0] = handXYScalesScreenCurr[i][0] - handXYScalesScreenCurr[i][2]
        this.handSaveRegion[1] = handXYScalesScreenCurr[i][1] - handXYScalesScreenCurr[i][2]
        this.handSaveRegion[2] = 2 * handXYScalesScreenCurr[i][2]
        this.handSaveRegion[3] = 2 * handXYScalesScreenCurr[i][2]
        for (let i = 0; i < 4; i++) this.handSaveRegion[i] *= (1 - prevR)
        this.handSaveRegion[0] += prevR*(handXYScalesScreenPrev[i][0] - handXYScalesScreenPrev[i][2])
        this.handSaveRegion[1] += prevR*(handXYScalesScreenPrev[i][1] - handXYScalesScreenPrev[i][2])
        this.handSaveRegion[2] += prevR*(2 * handXYScalesScreenPrev[i][2])
        this.handSaveRegion[3] += prevR*(2 * handXYScalesScreenPrev[i][2])
        setXYZSXSYFromRegionAndZ(this.dobHandSave, this.handSaveRegion, BOARD_Z)
        if (i == this.currState.keepNum - 1 && this.currState.keepNum > this.prevState.keepNum) {
            this.dobHandSave.thZ = 5 * prevR * prevR
        } else {
            this.dobHandSave.thZ = 0
        }
        const q = this.dobHandSave
        DrawerVanilla.draw(this.dobHandSave, "crate_hand", PosNormIndTexs.square)
    }
    let ct = 0
    for (const cardI of this.currState.iterable) {
        if (cardI == -1) continue
        if (this.animationCtr[0] == 0) this.allCards[cardI].useBezier = false
        this.allCards[cardI].setDobVals(this.animationCtr[0] / this.animationCtr[1])
        ct += this.allCards[cardI].onDrawFrame()
    }

    const draggedToNewSpot = this.dragStartCurr[0] != this.dragStartCurr[2] || this.dragStartCurr[1] != this.dragStartCurr[3]
    const startedInRealSpot = this.dragStartCurr[0] != -1 && this.dragStartCurr[1] != -1
    const startedInEmptySpot = this.dragStartCurr[0] == 2 && this.currState.board[this.dragStartCurr[1]] == -1
    if (draggedToNewSpot && startedInRealSpot && !startedInEmptySpot) {
        if (this.dragStartCurr[2] == 2 
            && this.dragStartCurr[0] == 0 
            && !this.allCards[this.currState.hand[this.dragStartCurr[1]]].isBoardPlaceable
        ) {

        } else if (this.dragStartCurr[2] == 2) {
            const selectedSpot = this.maps[this.currState.mapI].spots[this.dragStartCurr[3]]
            this.dobSelected.x = selectedSpot.x
            this.dobSelected.y = selectedSpot.y
            this.dobSelected.z = selectedSpot.z + 0.9 * selectedSpot.scale
            this.dobSelected.scale = selectedSpot.scale
            DrawerIndicator.draw(this.dobSelected, PosNormIndTexs.clickedCirlce, 255/256, 255/256, 0/256)
        }
        const selectedArr = this.dragStartCurr[0] == 0 ? this.currState.hand : this.currState.board
        const selectedCard = this.allCards[selectedArr[this.dragStartCurr[1]]]
        this.dobSelected.x = selectedCard.o.x
        this.dobSelected.y = selectedCard.o.y
        this.dobSelected.z = selectedCard.o.z - 0.9 * selectedCard.o.scale
        this.dobSelected.scale = selectedCard.o.scale
        DrawerIndicator.draw(this.dobSelected, PosNormIndTexs.clickedCirlce, 255/256, 255/256, 0/256)
    }


    if ((this.lastClick[0] == 0 || this.lastClick[0] == 2) 
        && this.currState.levelState == LevelState.WAITING_FOR_PLAY 
        && this.animationCtr[0] == 0
    ) {
        const selectedArr = this.lastClick[0] == 0 ? this.currState.hand : this.currState.board
        const selectedCard = this.allCards[selectedArr[this.lastClick[1]]]
        this.dobSelected.x = selectedCard.o.x
        this.dobSelected.y = selectedCard.o.y
        this.dobSelected.z = selectedCard.o.z - 0.9 * selectedCard.o.scale
        this.dobSelected.scale = selectedCard.o.scale
        DrawerIndicator.draw(this.dobSelected, PosNormIndTexs.clickedCirlce, 255/256, 255/256, 0/256)
    } else if (
        (this.lastDownItem[0] == 0 || this.lastDownItem[0] == 2) 
        && this.currState.levelState== LevelState.WAITING_FOR_PLAY 
        && this.animationCtr[0] == 0
    ) {
        const selectedArr = this.lastDownItem[0] == 0 ? this.currState.hand : this.currState.board
        if (selectedArr[this.lastDownItem[1]] != -1) {
            const selectedCard = this.allCards[selectedArr[this.lastDownItem[1]]]
            this.dobSelected.x = selectedCard.o.x
            this.dobSelected.y = selectedCard.o.y
            this.dobSelected.z = selectedCard.o.z - 0.9 * selectedCard.o.scale
            this.dobSelected.scale = selectedCard.o.scale
            DrawerIndicator.draw(this.dobSelected, PosNormIndTexs.clickedCirlce, 0.1, 0.1, 0.1)
        }
    }


    if (this.currState.levelState== LevelState.FINISH_FAIL) {
        DrawerRowCheck.draw(
            this.maps[this.currState.mapI].finishCheck.startStop[this.rowShowI],
            this.maps[this.currState.mapI].spots[0].scale,
            PosNormIndTexs.square,
            0)
    }
    if (this.currState.levelState == LevelState.FINISH_FAIL) {
        DrawerVanilla.draw(World.dobDisplayMenuShade, "shade", PosNormIndTexs.square)
        DrawerText.draw(Textname.endCheckFailMsg, DISPLAY_Z)
        if (DrawerButton.draw(Textname.endCheckFail, "btnCloseColor")) {
            this.currState.levelState = LevelState.WAITING_FOR_PLAY
        }
    }

    for (const cardI of this.currState.iterable) {
        if (cardI == -1) continue
        this.allCards[cardI].display()
    }
    this.maps[this.currState.mapI].check(this.allCards, this.currState.board)
    if (this.currState.levelState == LevelState.END_SCREEN) {
        DrawerVanilla.draw(World.dobDisplayShade, "shade", PosNormIndTexs.square)
        DrawerVanilla.draw(World.dobDisplayMenuShade, "shade", PosNormIndTexs.square)
        //World.starGoldManager.update(World.t_ms)
        let starCount = 0
        for (let i = 0; i < 5; i++) {
            DrawerVanilla.draw(World.dobsStarShadow[i], "shade", PosNormIndTexs.starShadow)
            if (this.starThresholds[i] > this.currState.score) continue
            starCount += 1
            const starAnimT = ((World.t_s - i * 0.5) - this.tEndScreenStart) * 1.3
            const scale = Math.min(1, Math.max(0, starAnimT))
            World.dobsStar[i].thZ = 2 * (1 - 1 * Math.min(1, Math.max(0, starAnimT)))
            World.dobsStar[i].thTilt = 0.25 + 2 * (1 - 1 * Math.min(1, Math.max(0, starAnimT)))
            World.dobsStar[i].thK = World.t_s + i * 1.3
            World.dobsStar[i].scale = scale * World.dobsStarScaleOrig
            DrawerVanilla.draw(World.dobsStar[i], "thanksBGR", PosNormIndTexs.star)
            //DrawerGold.draw(World.dobsStar[i], PosNormIndTexs.star, World.starGoldManager.u_data)
            //DrawerSparks.draw(World.dobsStar[i], GOLD_MID_PPPP, starAnimT - 0.75, GOLD_COLOR)
        }
        const shiftT = ((World.t_s - (starCount) * 0.5) - this.tEndScreenStart) * 1.7
        const shiftR = sCurve(Math.min(1, Math.max(0, 1 - shiftT)))

        const endScreenTextname = Settings.askForRating ? Textname.rateAndReview : Textname.thanksForPlaying
        Settings.rateable = Settings.askForRating && shiftR == 0

        if (Settings.loc == Loc.BROWSER_GAME) {
            for (let i = 1; i < 4; i++) World.regionThanksShift[i] = World.regionPickaxeInstruction[i]
            World.regionThanksShift[0] = World.regionPickaxeInstruction[0] - World.viewWidth * shiftR
            setXYZSXSYFromRegionAndZ(this.dobIcon, World.regionThanksShift, DISPLAY_Z - 0.1)
            DrawerVanilla.draw(this.dobIcon, "thanksBGR", PosNormIndTexs.square)
    
            for (let i = 1; i < 4; i++) World.regionThanksShiftText[i] = textnameToRegion[Textname.thanksForPlaying.name][i]
            World.regionThanksShiftText[0] = textnameToRegion[Textname.thanksForPlaying.name][0] - World.viewWidth * shiftR
            //DrawerText.draw(Textname.firstFailable, this.tutRegShifted, BOARD_Z)
            DrawerText.draw(Textname.thanksForPlaying, DISPLAY_Z, World.regionThanksShiftText)
    
            for (let i = 1; i < 4; i++) World.regionThanksShift[i] = World.regionBranding[i]
            World.regionThanksShift[0] = World.regionBranding[0] - World.viewWidth * shiftR
            setXYZSXSYFromRegionAndZ(this.dobIcon, World.regionThanksShift, DISPLAY_Z)
            DrawerVanilla.draw(this.dobIcon, "icon", PosNormIndTexs.square)
    
            DrawerButton.draw(Textname.returnToLevels)
        }
        if (Settings.loc == Loc.PLAYABLE_AD_GOOGLE) {
            const nextLevelClicked = DrawerButton.draw(Textname.next_level)
            const downloadClicked = DrawerButton.draw(Textname.download)
            if (nextLevelClicked && Settings.playingLevel < LEVEL_DEFS.length - 1) {
                Settings.playingLevel += 1
            } else if (downloadClicked || (nextLevelClicked && Settings.playingLevel == LEVEL_DEFS.length -1)) {
                getTheGame()
            }
        }
    }
    if (this.maps[this.currState.mapI].finishCheck.passed
        && this.currState.levelState == LevelState.WAITING_FOR_PLAY
        && this.animationCtr[0] == 0
    ) {
        const prevZ = Textname.finishButton.btn.topDO.z
        Textname.finishButton.btn.topDO.z -= Textname.finishButton.btn.topDO.scale * 0.5 * BTN_THICKNESS_TO_HEIGHT
        DrawerIndicator.draw(Textname.finishButton.btn.topDO, PosNormIndTexs.finishClickable, 1, 1, 0)
        Textname.finishButton.btn.topDO.z = prevZ
    }
    if (DrawerButton.draw(Textname.finishButton) 
        && this.currState.levelState== LevelState.WAITING_FOR_PLAY 
        && this.animationCtr[0] == 0
    ) {
        if (this.maps[this.currState.mapI].finishCheck.passed == false) {
            this.currState.levelState= LevelState.FINISH_FAIL
            for (let i = 0; i < this.maps[this.currState.mapI].finishCheck.rowPassed.length; i++) {
                if (this.maps[this.currState.mapI].finishCheck.rowPassed[i] > 0) continue
                rowShowI = i
                break
            }
            rowShowTmr = ROW_SHOW_PERIOD_S
        } else if (this.currState.mapI < this.maps.length - 1) { // TODO: remove -5
            this.currState.levelState= LevelState.FINISHED
            this.finishCtr[0] = 590 * this.maps[this.currState.mapI].finishCheck.getNumScores()
            this.finishCtr[1] = this.finishCtr[0]
        } else {
            this.currState.levelState= LevelState.FINISHED_FINAL
            this.finishCtr[0] = 590 * this.maps[this.currState.mapI].finishCheck.getNumScores()
            this.finishCtr[1] = this.finishCtr[0]
        }
    
    }
    Settings.returnToLevelsEnable = this.currState.levelState == LevelState.END_SCREEN
    Settings.rateable = false

    const addedScores = this.currState.levelState == LevelState.FINISHED || this.currState.levelState == LevelState.FINISHED_FINAL
        ? animateScores(this.maps[this.currState.mapI], 1.1 * (1 - this.finishCtr[0] / this.finishCtr[1]))
        : 0 
    if (this.currState.levelState == LevelState.DISPLAYING_NUGGET || this.currState.levelState == LevelState.END_SCREEN) {
        DrawerScore.draw(DISPLAY_Z, this.n, 1 + this.currState.mapI, addedScores + this.currState.score)
    } else {
        const _i = 1 + (this.currState.levelState == LevelState.DEAL_HAND ? this.prevState.mapI : this.currState.mapI)
        DrawerScore.draw(GEM_Z, this.n, _i, addedScores + this.currState.score)
    }
}
