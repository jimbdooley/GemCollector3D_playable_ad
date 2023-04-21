
const CardType = {
    NULL: {usesColorArr: 0, i: 0},
    GEM_REGULAR: {usesColorArr: 1, i: 1},
    GEM_PLATED: {usesColorArr: 1, i: 2},
    GEM_PLASMA: {usesColorArr: 1, i: 3},
    GEM_SHAPESHIFT: {usesColorArr: 1, i: 4},
    GEM_RAINBOW: {usesColorArr: 0, i: 5},
    GEM_DUO: {usesColorArr: 1, i: 6},
    GEM_COUNTERFEIT: {usesColorArr: 0, i: 7},
    PICKAXE: {usesColorArr: 0, i: 8},
    GOLD_NUGGET: {usesColorArr: 0, i: 9},
    INVENTORY: {usesColorArr: 0, i: 10},
} 
CardType_values = [
    CardType.NULL, 
    CardType.GEM_REGULAR, 
    CardType.GEM_PLATED, 
    CardType.GEM_PLASMA, 
    CardType.GEM_SHAPESHIFT, 
    CardType.GEM_RAINBOW, 
    CardType.GEM_DUO, 
    CardType.GEM_COUNTERFEIT, 
    CardType.PICKAXE, 
    CardType.GOLD_NUGGET,
    CardType.INVENTORY
]

const BezierSetter = {
    DECK_TO_HAND: {i: 0},
    BOARD_TO_DECK: {i: 1},
    TIME_ONLY: {i: 2},
    SWAP_FIRST_CLICKED: {i: 3},
    SWAP_SECOND_CLICKED: {i: 4},
    HAND_SWAP: {i: 5},
}

function cardFromCode(code, levelShapes) {
    const cardType = CardType_values[code % 16]
    const codeDetail = Math.floor(code / 16)
    if (cardType == CardType.NULL) return Card(codeDetail)
    if (cardType == CardType.GEM_REGULAR) return CardGem(codeDetail, levelShapes)
    if (cardType == CardType.GEM_PLATED) return CardPlateGem(codeDetail, levelShapes)
    if (cardType == CardType.GEM_PLASMA) return CardGem(codeDetail, levelShapes)
    if (cardType == CardType.GEM_SHAPESHIFT) return CardShapeshiftGem(codeDetail, levelShapes)
    if (cardType == CardType.GEM_RAINBOW) return CardRainbowGem(codeDetail, levelShapes)
    if (cardType == CardType.GEM_DUO) return CardDuoGem(codeDetail, levelShapes)
    if (cardType == CardType.GEM_COUNTERFEIT) return CardCounterfeit()
    if (cardType == CardType.PICKAXE) return CardPickaxe(codeDetail)
    if (cardType == CardType.GOLD_NUGGET) return CardNugget()
    if (cardType == CardType.INVENTORY) return CardInventory()
    return CardNugget()
}

function Card(codeDetail, levelShapes=null) {
    const rtn = { codeDetail: codeDetail }
    rtn.gemShape = levelShapes == null ? GemShape.NULL : levelShapes[codeDetail % 8]
    rtn.gemColorArrI = Math.floor(codeDetail / 8) % 8
    rtn.gemColorI = Math.floor(codeDetail / 64) % 8
    rtn.gemColorI2 = Math.floor(codeDetail / 512) % 8
    rtn.isBoardPlaceable = false
    rtn.cardType = CardType.NULL
    rtn.o = DisplayObject()
    rtn.currXYZScaleArr = [0, 0, 0, 1]
    rtn.prevXYZScaleArr = [0, 0, 0, 1]

    rtn.displayCenterMode = false
    rtn.displayLeftMode = false
    rtn.displayRightMode = false
    rtn.displayWithoutText = false

    rtn.spinT_ms = Math.random() * 314159
    rtn.gemRotR = 1
    rtn.useBezier = false
    rtn.rStart = 0
    rtn.rDur = 0.5 // TODO : use Setter
    rtn.rDurSet = Card_rDurSet
    rtn.BezierSetter = BezierSetter.DECK_TO_HAND
    rtn.tOffsets_s = [314.159 * Math.random(), 314.159 * Math.random(), 314.159 * Math.random(), 314.159 * Math.random()]
    rtn.t_ms = World.t_ms + 1000 * rtn.tOffsets_s[0]
    rtn.t_s = rtn.tOffsets_s.map((e, i) => World.t_s + rtn.tOffsets_s[i])
    rtn.skipDrawInDisplay = false
    rtn.topLeft = [0, 0, 0]
    rtn.botRight = [0, 0, 0]
    rtn.onScreen = Card_onScreen
    rtn.onDrawFrame = Card_onDrawFrame
    rtn.bezierXYZ = [0, 0, 0]
    rtn.bezierCalcDummyXYZ = [0, 0, 0]
    rtn.mapTopLeft = [0, 0, 0]
    rtn.mapBotRight = [0, 0, 0]
    rtn.setBezierXYZ = Card_setBezierXYZ
    rtn.setDobVals = Card_setDobVals
    rtn.display = Card_display
    rtn.draw = Card_draw
    rtn.displayPositioned = Card_displayPositioned
    return rtn
} 

function Card_draw() {
    return 0
}

function Card_displayPositioned(loc) {}

function Card_rDurSet(value) {
    this.rDur = this.rStart + value > 1 ? 1 : value
    this.rStart = this.rStart + value > 1 ? 0 : this.rStart
}

function Card_setDobVals(prevR) {
    const  animR = sCurve(prevR)
    if (!this.useBezier) {
        this.o.x = bezier2V(this.prevXYZScaleArr[0], this.currXYZScaleArr[0], animR)
        this.o.y = bezier2V(this.prevXYZScaleArr[1], this.currXYZScaleArr[1], animR)
        this.o.z = bezier2V(this.prevXYZScaleArr[2], this.currXYZScaleArr[2], animR)
        this.o.scale = bezier2V(this.prevXYZScaleArr[3], this.currXYZScaleArr[3], animR)
    } else {
        this.setBezierXYZ()
        const br = 1 - Math.min(1, Math.max(0, (1 - animR - this.rStart) / this.rDur))
        this.o.x = bezier3V(this.prevXYZScaleArr[0], this.bezierXYZ[0], this.currXYZScaleArr[0], br)
        this.o.y = bezier3V(this.prevXYZScaleArr[1], this.bezierXYZ[1], this.currXYZScaleArr[1], br)
        this.o.z = bezier3V(this.prevXYZScaleArr[2], this.bezierXYZ[2], this.currXYZScaleArr[2], br)
        this.o.scale = bezier2V(this.prevXYZScaleArr[3], this.currXYZScaleArr[3], br)
    }
}

function Card_display() {
    if (this.displayCenterMode) this.displayPositioned(1)
    if (this.displayLeftMode) this.displayPositioned(0)
    if (this.displayRightMode) this.displayPositioned(2)
}

function Card_onScreen() {
    const r = 1.7 * this.o.sx
    setWorldXYZFromDeviceXY(this.topLeft, 0, 0, this.o.z)
    setWorldXYZFromDeviceXY(this.botRight, World.viewWidth, World.viewHeight, this.o.z)
    const under = this.botRight[1] - r > this.o.y
    const over = this.topLeft[1] + r < this.o.y
    const left = this.topLeft[0] - r > this.o.x
    const right = this.botRight[0] + r < this.o.x
    return !(under || over || left || right)
}

function Card_onDrawFrame() {
    const anyDisplayMode = this.displayCenterMode || this.displayLeftMode || this.displayRightMode
    this.gemRotR = anyDisplayMode ? Math.min(this.gemRotR + 0.01, 1) : Math.max(this.gemRotR - 0.01, 0.79)
    this.spinT_ms += World.dT_ms * this.gemRotR
    this.t_ms = World.t_ms + 1000 * this.tOffsets_s[0]
    for (let i = 0; i < this.t_s.length; i++) this.t_s[i] = World.t_s + this.tOffsets_s[i]
    return this.draw()
}

function Card_setBezierXYZ() {
    for (let i = 0; i < 3; i++) {
        this.bezierXYZ[i] = 0.5 * (this.prevXYZScaleArr[i] + this.currXYZScaleArr[i])
    }
    if (this.bezierSetter == BezierSetter.SWAP_FIRST_CLICKED) {
        this.bezierXYZ[0] = 0.5 * (this.currXYZScaleArr[0] + this.prevXYZScaleArr[0])
        this.bezierXYZ[1] = 0.5 * (this.currXYZScaleArr[1] + this.prevXYZScaleArr[1])
        const dx = this.currXYZScaleArr[0] - this.prevXYZScaleArr[0]
        const dy = this.currXYZScaleArr[1] - this.prevXYZScaleArr[1]
        const dist = Math.sqrt(dx * dx + dy * dy)
        this.bezierXYZ[2] += Math.min(31, 7.5 * dist)
        this.rStart = 0
        this.rDur = 1
    }
    if (this.bezierSetter == BezierSetter.BOARD_TO_DECK) {
        setWorldXYZFromDeviceXY(this.mapTopLeft, World.regionMap[0], World.regionMap[1], GEM_Z)
        setWorldXYZFromDeviceXY(this.mapBotRight, World.regionMap[0] + World.regionMap[2],
            World.regionMap[1] + World.regionMap[3], GEM_Z)
        const xR = (this.mapBotRight[0] - this.prevXYZScaleArr[0]) / (this.mapBotRight[0] - this.mapTopLeft[0])
        const yR = (this.mapTopLeft[1] - this.prevXYZScaleArr[1]) / (this.mapTopLeft[1] - this.mapBotRight[1])
        this.rStart = 0.5 * (0.67 * xR + 0.33 * (1-yR))
        this.rDur = 0.5
    }
    if (this.bezierSetter == BezierSetter.DECK_TO_HAND) {
        this.bezierXYZ[2] = 0.5 * (this.prevXYZScaleArr[1] + this.currXYZScaleArr[1])
        setWorldXYZFromDeviceXY(
            this.bezierCalcDummyXYZ,
            World.regionHand[0] + 0.35 * World.regionHand[2],
            World.regionHand[1] - (isVerticalMode() ? 2.5 : 0.6) * World.regionHand[3],
            this.bezierXYZ[2]
        )
        this.bezierXYZ[0] = this.bezierCalcDummyXYZ[0]
        this.bezierXYZ[1] = this.bezierCalcDummyXYZ[1]
        const dx = this.prevXYZScaleArr[0] - this.currXYZScaleArr[0]
        const dy = this.prevXYZScaleArr[1] - this.currXYZScaleArr[1]
        this.bezierXYZ[2] += 2 * Math.sqrt(dx*dx + dy*dy)
    }
}