const HAND_SPACE_R = 0.17
const handXYZScalesCurr = []
const handXYScalesScreenCurr = []
const handXYZScalesPrev = []
const handXYScalesScreenPrev = []
function setHandXYs(hand, keepNum, currNotPrev) {
    const handXYZScales = currNotPrev ? handXYZScalesCurr : handXYZScalesPrev
    const handXYScalesScreen = currNotPrev ? handXYScalesScreenCurr : handXYScalesScreenPrev
    const spotsNeeded = Math.max(keepNum, hand.length)

    const targetWToH = World.regionHand[2] / World.regionHand[3]
    var bestWToHScore = 1000000
    var constrainedByHeight = false
    var rows = 1
    for (let rowCountToCheck = 1; rowCountToCheck < spotsNeeded; rowCountToCheck ++) {
        const colsToCheck = Math.ceil(spotsNeeded / rowCountToCheck)
        const currWToH = colsToCheck / rowCountToCheck
        const currWToHScore = Math.max(currWToH, targetWToH) / Math.min( currWToH, targetWToH)
        rows = currWToHScore < bestWToHScore ? rowCountToCheck : rows
        constrainedByHeight = currWToHScore < bestWToHScore ? currWToH < targetWToH : constrainedByHeight
        bestWToHScore = currWToHScore < bestWToHScore ? currWToHScore : bestWToHScore
    }
    const rowLen = Math.ceil(spotsNeeded / rows)
    if (constrainedByHeight) {
        const gemUnitScreen = World.regionHand[3] / (2 * rows + HAND_SPACE_R * (rows - 1))
        const gemSpace = gemUnitScreen * (2 + HAND_SPACE_R)
        const x0Screen = World.regionHand[0] + 0.5 * World.regionHand[2] - 0.5 * (rowLen - 1) * (2 + HAND_SPACE_R) * gemUnitScreen
        const y0Screen = World.regionHand[1] + gemUnitScreen
        var i = 0
        for (let _i = 0; _i < rows * rowLen; _i++) {
            if ((_i % rowLen == rowLen - 1) && ((rowLen * rows - spotsNeeded) > (rows - 1 - Math.floor(_i / rowLen)))) continue
            handXYScalesScreen[i][0] = x0Screen + gemSpace * (_i % rowLen)
            handXYScalesScreen[i][1] = y0Screen + gemSpace * Math.floor(_i / rowLen)
            handXYScalesScreen[i][2] = 2 * gemUnitScreen
            setWorldXYZFromDeviceXY(handXYZScales[i], handXYScalesScreen[i][0], handXYScalesScreen[i][1], GEM_Z)
            i += 1
        }
    } else {
        const gemUnitScreen = World.regionHand[2] / (2 * rowLen + HAND_SPACE_R * (rowLen - 1))
        const gemSpace = gemUnitScreen * (2 + HAND_SPACE_R)
        const x0Screen = World.regionHand[0] + gemUnitScreen
        const y0Screen = World.regionHand[1] + 0.5 * World.regionHand[3] - 0.5 * (rows - 1) * (2 + HAND_SPACE_R) * gemUnitScreen
        var i = 0
        for (let _i = 0; _i < rows * rowLen; _i++) {
            if ((_i % rowLen == rowLen - 1) && ((rowLen * rows - spotsNeeded) > (rows - 1 - Math.floor(_i / rowLen)))) continue
            handXYScalesScreen[i][0] = x0Screen + gemSpace * (_i % rowLen)
            handXYScalesScreen[i][1] = y0Screen + gemSpace * Math.floor(_i / rowLen)
            handXYScalesScreen[i][2] = 2 * gemUnitScreen
            setWorldXYZFromDeviceXY(handXYZScales[i], handXYScalesScreen[i][0], handXYScalesScreen[i][1], GEM_Z)
            i += 1
        }
    }
    const screenScale = hand.length == 0 && keepNum == 0 ? 1 :
        0.5 * Math.min( handXYScalesScreen[0][2], 0.48 * Math.min( World.regionHand[2], World.regionHand[3]))
    const scale = distFromZAndScreenDist(GEM_Z, screenScale)
    for (let i = 0; i < Math.max(hand.length, keepNum); i++) {
        handXYScalesScreen[i][2] = screenScale
        handXYZScales[i][3] = scale
    }

}
const mapTypeToDBoardScale = {}
mapTypeToDBoardScale[MapType.HEX.name] = 0.62
mapTypeToDBoardScale[MapType.HEX_ONE_SQUARE.name] = 0.5
mapTypeToDBoardScale[MapType.SQUARE.name] = 0.7
mapTypeToDBoardScale[MapType.OCT.name] = 0.86
mapTypeToDBoardScale[MapType.NULL.name] = 1
function setPositions(
    allCards,
    gameState,
    currNotPrev,
    spots,
    gemSpots,
    mapType
) {
    const handXYZScales = currNotPrev ? handXYZScalesCurr : handXYZScalesPrev
    const handXYScalesScreen = currNotPrev ? handXYScalesScreenCurr : handXYScalesScreenPrev
    for (const cardI of gameState.deck) {
        const card = allCards[cardI]
        const xyzScaleArr = currNotPrev ? card.currXYZScaleArr : card.prevXYZScaleArr
        xyzScaleArr[0] = World.offscreenXYZ[0]
        xyzScaleArr[1] = World.offscreenXYZ[1]
        xyzScaleArr[2] = GEM_Z
        xyzScaleArr[3] = 1
    }
    while (handXYZScalesCurr.length < Math.max(gameState.keepNum, gameState.hand.length)){
        handXYZScalesCurr.push([0, 0, 0, 1])
        handXYScalesScreenCurr.push([0, 0, 0])
    }
    while (handXYZScalesPrev.length < Math.max(gameState.keepNum, gameState.hand.length)){
        handXYZScalesPrev.push([0, 0, 0, 1])
        handXYScalesScreenPrev.push([0, 0, 0])
    }
    setHandXYs(gameState.hand, gameState.keepNum, currNotPrev)
    for (let i = 0; i < gameState.hand.length; i++) {
        const card = allCards[gameState.hand[i]]
        const xyzScaleArr = currNotPrev ? card.currXYZScaleArr : card.prevXYZScaleArr
        xyzScaleArr[0] = handXYZScales[i][0]
        xyzScaleArr[1] = handXYZScales[i][1]
        xyzScaleArr[2] = handXYZScales[i][2]
        xyzScaleArr[3] = handXYZScales[i][3]
    }
    const boardScale = spots.reduce((acc, curr) => Math.max(acc, curr.scale), 0)
    for (let i = 0; i < gameState.board.length; i++) {
        if (gameState.board[i] == -1) continue
        const card = allCards[gameState.board[i]]
        const xyzScaleArr = currNotPrev ? card.currXYZScaleArr : card.prevXYZScaleArr
        xyzScaleArr[0] = gemSpots[i][0]
        xyzScaleArr[1] = gemSpots[i][1]
        xyzScaleArr[2] = gemSpots[i][2]
        xyzScaleArr[3] = boardScale * mapTypeToDBoardScale[mapType.name]
    }
    if (gameState.pick.length > 0) {
        const card = allCards[gameState.pick[0]]
        const xyzScaleArr = currNotPrev ? card.currXYZScaleArr : card.prevXYZScaleArr
        xyzScaleArr[0] = 0
        xyzScaleArr[1] = 0
        xyzScaleArr[2] = 0
        xyzScaleArr[3] = 0
    }

}