const durations = []
for (let i = 0; i < 50; i++) durations.push(0)
const subDurations = []
const scoreProgress = []
for (let i = 0; i < 20; i++) {
    subDurations.push(i * 0.05)
    scoreProgress.push(0)
}
const dobScore = DisplayObject()
const mapTypeToScale = {}
mapTypeToScale[MapType.SQUARE.name] = 1
mapTypeToScale[MapType.HEX.name] = 1
mapTypeToScale[MapType.HEX_ONE_SQUARE.name] = 0.7
mapTypeToScale[MapType.OCT.name] = 1.5
mapTypeToScale[MapType.NULL.name] = 1


const FIVE_THIRDS = 5 / 3
function scoreScaler(r) {
    if (r < 0.6) {
        const x = r * FIVE_THIRDS
        return -4 * x * x + 5 * x
    } else {
        return 1
    }
}

function animateScores(map, _r) {
    const r = Math.min(1, _r)
    let rtn = 0
    let numScores = map.finishCheck.scores.reduce((acc, curr) => acc + curr.length, 0)
    for (let i = 0; i < map.finishCheck.scores.length; i++) {
        const ratio = map.finishCheck.scores[i].length / numScores
        durations[i] = ratio + (i > 0 ? durations[i-1] : 0)
    }
    let startStopI = map.finishCheck.startStop.length - 1
    for (let i = 0; i < map.finishCheck.scores.length - 1; i++) {
        if (r < durations[i]) {
            startStopI = i
            break
        }
        rtn += map.finishCheck.scores[i].reduce((acc, curr) => acc + curr, 0)
    }
    DrawerRowCheck.draw(
        map.finishCheck.startStop[startStopI],
        map.spots[0].scale,
        PosNormIndTexs.square,
        2) // 1 for green
    const durationStart = startStopI == 0 ? 0 : durations[startStopI - 1]
    const durationT = map.finishCheck.scores[startStopI].length
    subDurations[0] = durationStart
    //const scoreScale = map.spots.fold(0) {acc, curr -> max(acc, curr.scale)}
    const scoreScale = map.spots.reduce((acc, curr) => Math.max(acc, curr.scale), 0)
    for (let gemI = 0; gemI < map.finishCheck.scores[startStopI].length; gemI++) {
        const subDurStart = durationStart + 0.5 * (subDurations[gemI] - durationStart)
        const animT = (r - subDurStart) / (subDurations[gemI + 1] - subDurations[gemI])
        subDurations[gemI + 1] = durationStart + (durations[startStopI] - durationStart) * (gemI + 1) / durationT
        if (r < subDurStart) {
            continue
        }
        const sparksAnimT = (_r - subDurStart/*subDurations[gemI]*/) / (subDurations[gemI + 1] - subDurations[gemI])
        const animR = Math.min(1, Math.max(0, animT))
        if (animR > 0.7) rtn += map.finishCheck.scores[startStopI][gemI]
        dobScore.x = map.spots[map.finishCheck.indexMap[startStopI][gemI]].x
        dobScore.y = map.spots[map.finishCheck.indexMap[startStopI][gemI]].y
        dobScore.z = GEM_Z + 1.5
        dobScore.scale = 2.2 * map.spots[map.finishCheck.indexMap[startStopI][gemI]].scale
        const pppp = GOLD_LARGE_PPPP
        if (map.finishCheck.scores[startStopI][gemI] > 0) {
            //DrawerSparks.draw(dobScore, pppp, 2 * sparksAnimT - 0.85, GOLD_COLOR)
        }
        let scale = 0.3 * scoreScale * (mapTypeToScale[map.mapType.name])
        scale *= scoreScaler(animR)
        dobScore.sx = scale
        dobScore.sy = dobScore.sx * 125 / 95
        dobScore.x -= dobScore.sx
        DrawerVanilla.draw(dobScore, "plus", PosNormIndTexs.square)
        dobScore.x += 2 * dobScore.sx
        const png = map.finishCheck.scores[startStopI][gemI] < 10 ? map.finishCheck.scores[startStopI][gemI] + "" : "plus"
        DrawerVanilla.draw(dobScore, png, PosNormIndTexs.square)
    }
    return rtn
}
