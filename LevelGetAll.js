
function LevelDefinition_cardCodeFromStr(s) {
    const nf = s.split("-").map(el => parseInt(el))
    if (nf[0] == 1 || nf[0] == 2 || nf[0] == 3) {
        return nf[0] + 16 * nf[1] + 16 * 64 * nf[2]
    } else if (nf[0] == 4) {
        return nf[0] + 16 * 64 * nf[1]
    } else if (nf[0] == 5) {
        return nf[0] + 16 * nf[1]
    } else if (nf[0] == 6) {
        return nf[0] + 16 * nf[1] + 16 * 64 * nf[2] + 16 * 64 * 8 * nf[3]
    } else if (nf[0] == 7 || nf[0] == 9 || nf[0] == 10) {
        return nf[0]
    } else if (nf[0] == 8){
        return nf[0] + 16 * nf[1]
    }
    return -1
}

const pickaxeChoice = {
    1700: 0,
    1701: 0,
    1702: 0,
    1703: 0,
    1704: 0,
    1705: 0,
    1706: 0,
    1707: 1,
    2000: 0,
    2001: 0,
    2002: 1,
    2003: 0,
    2004: 0,
    2005: 1,
    2006: 0,
    2007: 1,
    3000: 1,
    3001: 1,
    3003: -1,
    3005: 0,
    3100: 1,
    3108: 1,
    3303: 1
}

function LevelDefinition(_s, levelI) {
    const r = {
        n: (levelI + 1).toString(),
        drawCards: false,
        colorArrI: 0,
        shapeArr: [GemShape.BRIOLETTE, GemShape.HEART, GemShape.PRINCESS, GemShape.MARQUISE],
        mapTypes: [],
        adj: [],
        pickArrs: [],
        cardsAndHands: [],
        starThresholds: [1, 30, 60, 100, 150],
        gened: [],
        cardCodeFromStr: LevelDefinition_cardCodeFromStr,
        correctSpelling: 0,
    }
    const s = _s.replace("\r\n", "\n")
    const arr = s.split("\n")
    r.drawCards = arr[0] == "true"
    r.colorArrI = parseInt(arr[1])
    const shapeStrings = arr[2].split("-")
    for (const gemShape of GemShape_values) {
        for (let i = 0; i < 4; i++) {
            if (shapeStrings[i] == gemShape.name) {
                r.shapeArr[i] = gemShape
                r.correctSpelling += 1
            }
        }
    }
    const starThresholdStrings = arr[3].split("-")
    for (let i = 0; i < 5; i++) {
        r.starThresholds[i] = parseInt(starThresholdStrings[i])
    }
    let cardCodeCount = 0
    const cardCodes = []
    let usesRainbow = false
    let usesShapeshift = false
    let usesDuo = false
    for (let i = 4; i < arr.length; i++) {
        if (!arr[i] || arr[i] == "") continue
        if (arr[i][0] == "c") continue
        if (MapType.SQUARE.name == arr[i]
            || MapType.HEX.name == arr[i]
            || MapType.HEX_ONE_SQUARE.name == arr[i]
            || MapType.OCT.name == arr[i]) {
            r.gened[r.gened.length-1] += arr[i] + "\n"
            let mapType = MapType.SQUARE
            if (arr[i] == MapType.HEX.name) mapType = MapType.HEX
            if (arr[i] == MapType.OCT.name) mapType = MapType.OCT
            if (arr[i] == MapType.HEX_ONE_SQUARE.name) mapType = MapType.HEX_ONE_SQUARE
            r.mapTypes.push(mapType)
            continue
        }
        if (arr[i][0] == '[') {
            r.gened.push(`${arr[i]}\n`)
            r.adj.push(arr[i])
            continue
        }
        r.gened[r.gened.length -1] += arr[i] + "\n"
        if (arr[i][0] == '-') {
            const cardCodesCopy = []
            for (const el of cardCodes) cardCodesCopy.push(el)
            r.cardsAndHands.push([cardCodesCopy, [parseInt(arr[i])]])
            while (cardCodes.length > 0) cardCodes.pop()
            continue
        }
        if(arr[i][0] == 'p') {
            //console.log()
            const pickaxeOptions = arr[i].split(':')
            const key = levelI * 100 + r.adj.length - 1
            if (key in pickaxeChoice && pickaxeChoice[key] == -1) continue
            const grab = 2 + (key in pickaxeChoice ? pickaxeChoice[key] : 0)
            const firstIsNugget = pickaxeOptions[2][0] == "9"
            arr[i] = firstIsNugget ? pickaxeOptions[3] : pickaxeOptions[grab]
            //console.log(arr[i])
            /*
            r.pickArrs[cardCodeCount] = []
            for (let j = 0; j < pickaxeOptions.length - 2; j++) {
                r.pickArrs[cardCodeCount].push(r.cardCodeFromStr(pickaxeOptions[j+2]))
            }
            cardCodes.push(r.cardCodeFromStr(pickaxeOptions[1]))
            cardCodeCount += 1
            continue
            */
        }
        if (arr[i].length >=2 && arr[i][1] == '-') {
            usesShapeshift = usesShapeshift || arr[i][0] == '4'
            usesRainbow = usesRainbow || arr[i][0] == '5'
            usesDuo = usesDuo || arr[i][0] == '6'
            if (['1', '2', '3', '6'].indexOf(arr[i][0]) != -1) {
                const intArr = arr[i].split("-").map ( el => parseInt(el) )
                const col = Settings.colors[Settings.sightType.i][r.colorArrI][intArr[2]]
                const shp = r.shapeArr[intArr[1]].name
                const card = CardType_values[intArr[0]].name
                r.gened[r.gened.length -1] += `c ${card} ${col.name} ${shp}\n`
            }
        }
        const cardCode = r.cardCodeFromStr(arr[i])
        if (cardCode != -1 && cardCode != 9) cardCodes.push(cardCode)
        cardCodeCount += 1
    }
    LEVEL_USES_RAINBOW[levelI] = usesRainbow
    LEVEL_USES_SHAPESHIFT[levelI] = usesShapeshift
    LEVEL_USES_DUO[levelI] = usesDuo
    for (let i = 0; i < r.cardsAndHands.length; i++) {
        for (let j = 0; j < r.cardsAndHands[i][0].length; j++) {
            if (CardType_values[r.cardsAndHands[i][0][j] % 16].usesColorArr == 0) continue
            r.cardsAndHands[i][0][j] += 16 * 8 * r.colorArrI
        }
    }
    r.toLevel = function(oldMaps=null) {
        const cards = []
        const hands = []
        for (let i = 0; i < r.cardsAndHands.length; i++) {
            if (r.cardsAndHands[i][1][0] == -2 || r.cardsAndHands[i][1][0] == -3) { // point to all cards in the hand,
                const newHand = []
                for (let j = 0; j < r.cardsAndHands[i][0].length; j++) {
                    newHand.push(j + cards.length)
                }
                hands.push(newHand)
                if (r.cardsAndHands[i][1][0] == -3) shuffle(hands[hands.length  - 1])
            }
            for (const cardCode of r.cardsAndHands[i][0]) {
                cards.push(cardCode)
            }
        }
        return Level(r.n, r.drawCards, r.colorArrI, r.shapeArr, r.mapTypes, r.adj, r.pickArrs, cards, hands, r.starThresholds, oldMaps)
    }
    return r
}

const LEVEL_FILES = []
if  (SHORT_LEVELS) {
    if (CUSTOM_LEVELS) {
        LEVEL_FILES.push("levels/ad1_short.txt")
        if (!JUST_ONE) LEVEL_FILES.push("levels/ad2_short.txt")
    } else {
        LEVEL_FILES.push("levels/e1_short.txt")
        if (!JUST_ONE) LEVEL_FILES.push("levels/e3_short.txt")
    }
} else {
    if (CUSTOM_LEVELS) {
        LEVEL_FILES.push("levels/ad1.txt")
        if (!JUST_ONE) LEVEL_FILES.push("levels/ad2.txt")
    } else {
        LEVEL_FILES.push("levels/e1.txt")
        if (!JUST_ONE) LEVEL_FILES.push("levels/e3.txt")
    }
}

const LEVEL_DEFS = []
const LEVEL_USES_RAINBOW = []
const LEVEL_USES_SHAPESHIFT = []
const LEVEL_USES_DUO = []

for (let i = 0; i < LEVEL_FILES.length; i++) {
    LEVEL_USES_RAINBOW.push(false)
    LEVEL_USES_DUO.push(false)
    LEVEL_USES_SHAPESHIFT.push(false)
}

function getAllLevels() {
    if (LEVEL_DEFS.length == 0) {
        for (let i = 0; i < LEVEL_FILES.length; i++) {
            LEVEL_DEFS.push(LevelDefinition(assets[LEVEL_FILES[i]], i))
        }
    }
    const rtn = []
    for (const levelDef of LEVEL_DEFS) {
        rtn.push(levelDef.toLevel())
    }
    return rtn
}
