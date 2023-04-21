
function fingerLoopNormal() {
    const solved = MyGLRenderer.levels[0].currState.hand.length == 0
    if (solved) {
        tapGem(Textname.finishButton.btn.topDO)
    }
    else if (MyGLRenderer.levels[0].lastClick[0] == -1) {
        handGemI = MyGLRenderer.levels[0].currState.hand[0]
        tapGem(MyGLRenderer.levels[0].allCards[handGemI].o)
    }
    else if (MyGLRenderer.levels[0].lastClick[0] == 0) {
        const spotToTap = MyGLRenderer.levels[0].currState.board[0] == -1 
            ? 0
            : (MyGLRenderer.levels[0].currState.board[1] == -1 ? 1 : 2)
        tapGem(MyGLRenderer.levels[0].maps[0].spots[spotToTap], true)
    }
    else if (MyGLRenderer.levels[0].lastClick[0] == 2) {
        const spotToTap = (1 + MyGLRenderer.levels[0].lastClick[1]) % 3
        const dobToTap = MyGLRenderer.levels[0].currState.board[spotToTap] == -1 
            ? MyGLRenderer.levels[0].maps[0].spots[spotToTap]
            : MyGLRenderer.levels[0].allCards[MyGLRenderer.levels[0].currState.board[spotToTap]].o
        tapGem(dobToTap, MyGLRenderer.levels[0].currState.board[spotToTap] == -1 )
    }
}

function fingerLoopCustom() {
    const solved = MyGLRenderer.levels[0].currState.board[1] == 1 && MyGLRenderer.levels[0].currState.hand.length == 0
    if (solved) {
        tapGem(Textname.finishButton.btn.topDO)
    }
    else if (MyGLRenderer.levels[0].lastClick[0] == -1) {
        if (MyGLRenderer.levels[0].currState.hand.length == 0) {
            const middleI = MyGLRenderer.levels[0].currState.board[1]
            tapGem(MyGLRenderer.levels[0].allCards[middleI].o)
        } else {
            const handGemI = MyGLRenderer.levels[0].currState.hand[0]
            tapGem(MyGLRenderer.levels[0].allCards[handGemI].o)
        }
    }
    else if (MyGLRenderer.levels[0].lastClick[0] == 0) {
        const tappedGemI = MyGLRenderer.levels[0].currState.hand[MyGLRenderer.levels[0].lastClick[1]]
        if (tappedGemI == 1) {
            if (MyGLRenderer.levels[0].currState.board[1] == -1) {
                tapGem(MyGLRenderer.levels[0].maps[0].spots[1], true)
            } else {
                tapGem(MyGLRenderer.levels[0].allCards[MyGLRenderer.levels[0].currState.board[1]].o)
            }
        } else {
            if (MyGLRenderer.levels[0].currState.board[0] != -1
                && MyGLRenderer.levels[0].currState.board[1] == -1
                && MyGLRenderer.levels[0].currState.board[2] != -1 ) {
                tapGem(MyGLRenderer.levels[0].maps[0].spots[1], true)
            } else if (MyGLRenderer.levels[0].currState.board[0] == -1) {
                tapGem(MyGLRenderer.levels[0].maps[0].spots[0], true)
            } else {
                tapGem(MyGLRenderer.levels[0].maps[0].spots[2], true)
            }
        }
    }
    else if (MyGLRenderer.levels[0].lastClick[0] == 2) {
        const tappedGemI = MyGLRenderer.levels[0].currState.board[MyGLRenderer.levels[0].lastClick[1]]
        let nextSpot = -1
        if (tappedGemI != 1 && MyGLRenderer.levels[0].lastClick[1] != 1) {
            nextSpot = 2 - MyGLRenderer.levels[0].lastClick[1]
        }
        if (tappedGemI == 1 && MyGLRenderer.levels[0].lastClick[1] != 1) {
            nextSpot = 1
        }
        if (tappedGemI != 1 && MyGLRenderer.levels[0].lastClick[1] == 1) {
            if (MyGLRenderer.levels[0].currState.board[0] == 1) {
                nextSpot = 0
            } else if (MyGLRenderer.levels[0].currState.board[2] == 1) {
                nextSpot = 2
            } else if (MyGLRenderer.levels[0].currState.board[0] == -1) {
                nextSpot = 0
            } else if (MyGLRenderer.levels[0].currState.board[2] == -1) {
                nextSpot = 2
            } else {
                nextSpot = 0
            }
        }
        if (nextSpot != -1) {
            if (MyGLRenderer.levels[0].currState.board[nextSpot] == -1) {
                tapGem(MyGLRenderer.levels[0].maps[0].spots[nextSpot], true)
            } else {
                const nextGem = MyGLRenderer.levels[0].currState.board[nextSpot]
                tapGem(MyGLRenderer.levels[0].allCards[nextGem].o)
            }
        }
    }
}

function fingerLoop() {
    let fingerEnable = Settings.playingLevel == 0
    fingerEnable &= !Settings.intro
    fingerEnable &= MyGLRenderer.levels[0].currState.levelState == LevelState.WAITING_FOR_PLAY
    fingerEnable &= MyGLRenderer.levels[0].animationCtr[0] == 0
    if (MyGLRenderer.levels[0].animationCtr[0] == 0 && prevAnimationCtr0 != 0) {
        lastFingerReset = World.t_s
    }
    fingerEnable &= World.t_s - lastFingerReset > 2
    fingerEnable &= MyGLRenderer.levels[0].currState.mapI == 0
    if (fingerEnable) {
        if (CUSTOM_LEVELS) {
            fingerLoopCustom()
        } else {
            fingerLoopNormal()
        }
    }
    prevAnimationCtr0 = MyGLRenderer.levels[0].animationCtr[0]
}

let prevAnimationCtr0 = -1
let lastFingerReset = -10
const tiltT = 3
function tapGem(dob, spot) {
    let t = World.t_s % tiltT
    t = t > tiltT * 0.5 ? tiltT - t : t

    fingerDOB.x = dob.x + 1.2 * dob.sx
    fingerDOB.y = dob.y - 0.3 * dob.sx
    fingerDOB.z = spot ? GEM_Z + 2 : dob.z + dob.sx
    fingerDOB.sx = dob.sx
    fingerDOB.sy = dob.sx
    fingerDOB.sz = dob.sx

    fingerDOB.thZ = 0.25 * (t*t)
    DrawerVanilla.draw(fingerDOB, "finger", PosNormIndTexs.square)
}