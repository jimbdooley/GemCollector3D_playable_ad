const FONT_INDENT_R = 1.2
const VERT_SPACE_R = 0.5
const MIN_SPACE_R = 0.3
const MIN_FONT_SIZE = 5
const FONT_R_TEXT = 0.75
const DEFAULT_FONT_SIZE = 45

const b16chars = "0123456789ABCDEF"
let tutorialTextnames = null
function ARGB_to_CSS(ARGB) {
    let rtn = "#"
    rtn += b16chars[Math.floor(ARGB[1]/16)] +  b16chars[ARGB[1] % 16]
    rtn += b16chars[Math.floor(ARGB[2]/16)] +  b16chars[ARGB[2] % 16]
    rtn += b16chars[Math.floor(ARGB[3]/16)] +  b16chars[ARGB[3] % 16]
    rtn += b16chars[Math.floor(ARGB[0]/16)] +  b16chars[ARGB[0] % 16]
    return rtn
}

function setFontSize(ctx, _size, is_italic) {
    const italic = is_italic ? "italic " : ""
    const size = _size * window.devicePixelRatio
    const i = ctx.font.indexOf("px")
    if (i == -1) {
        ctx.font = `${italic}${size}px sans-serif`
        return
    }
    ctx.font = `${italic}${size}${ctx.font.substring(i, ctx.font.length)}`
}

const tnCanvas = document.createElement("canvas")
const tnCtx = tnCanvas.getContext("2d")
const sqCanvas = document.createElement("canvas")
const sqCtx = sqCanvas.getContext("2d", {willReadFrequently: true})


function getFitR(ctx, arr, wArr, lineTB, spaceH, spaceW, vertSpaceR) {
    let textW = 0
    const res = ctx.measureText(arr[0])
    lineTB[0] = res.fontBoundingBoxAscent || res.actualBoundingBoxAscent
    lineTB[1] = res.fontBoundingBoxDescent || res.actualBoundingBoxDescent
    const fontH = lineTB[0] + lineTB[1]
    const textH = fontH * (vertSpaceR * (arr.length - 1) + arr.length)
    for (let i = 0; i < arr.length; i++) {
        wArr[i] = ctx.measureText(arr[i]).width
        textW = Math.max(textW, wArr[i])
    }
    return Math.max(textW / spaceW, textH / spaceH)
}

function setBmpBorder(ctx, canvas, peremiter_thickness) {
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, peremiter_thickness)
    ctx.fillRect(0, canvas.height - peremiter_thickness, canvas.width, peremiter_thickness)
    ctx.fillRect(0, 0, peremiter_thickness, canvas.height)
    ctx.fillRect(canvas.width-peremiter_thickness, 0, peremiter_thickness, canvas.height)
}

function _bitmapFromTextnameLanguageAndDXDY(textname, lines, dx, dy,
                                       background_rgb, skipOutline, curved, 
                                       smallSpace, bMode) {

    if (tutorialTextnames == null) tutorialTextnames = ["firstTap", "firstColor", "firstFinish", "firstShape", "firstSwap", "firstDouble", "rainbowTut", "shapeshiftTut", "match1", "match2"]
    const italic = false && tutorialTextnames.indexOf(textname.name) != -1
    
    const lineTB = [0, 0]
    const lineWs = []
    for (let i = 0; i < lines.length; i++) {
        const next = []
        for (let j = 0; j < i + 1; j++) {
            next.push(0)
        }
        lineWs.push(next)
    }

    const vertSpaceR = smallSpace ? 0.15 : VERT_SPACE_R
    const fontRText = smallSpace ? 0.86 : FONT_R_TEXT
    const cols = Math.floor(dx)
    const rows = Math.floor(dy)
    const spaceH = rows * fontRText
    const spaceW = cols - rows * (1 - fontRText)
    let fontSize = DEFAULT_FONT_SIZE + 1
    let fitsI = -1
    let loops = 0
    let bestFitR = 1
    do {
        loops ++
        if (loops == 2) {
            fontSize = Math.floor(fontSize / bestFitR)
        } else {
            fontSize -= 1
        }
        setFontSize(tnCtx, fontSize, italic)
        bestFitR = 999999
        for (let i = 0; i < lines.length; i++) {
            const fitR = getFitR(tnCtx, lines[i], lineWs[i], lineTB, spaceH, spaceW, vertSpaceR)
            if ( fitR <= 1) {
                fitsI = i
                break
            }
            bestFitR = Math.min(bestFitR, fitR)
        }
    } while (fitsI == -1 && fontSize > 10)
    const fontH = lineTB[0] + lineTB[1]
    const textH = lines[fitsI].length * fontH + (lines[fitsI].length - 1) * fontH * vertSpaceR
    const textW = lineWs[fitsI].reduce((a, c) => Math.max(a, c), 0)
    tnCanvas.height = Math.ceil(textH / fontRText)
    tnCanvas.width = Math.ceil(textW + tnCanvas.height - textH)
    tnCanvas.style.width = tnCanvas.width + "px"
    tnCanvas.style.height = tnCanvas.height + "px"
    TEXT_D_SCALES[textname.ordinal*2] = tnCanvas.width
    TEXT_D_SCALES[textname.ordinal*2 + 1] = tnCanvas.height
    const y0 = 0.5*(tnCanvas.height - textH) + fontH - lineTB[1]

    tnCtx.fillStyle = ARGB_to_CSS(background_rgb)
    tnCtx.fillRect(0, 0, tnCanvas.width, tnCanvas.height)
    if (!skipOutline) setBmpBorder(tnCtx, tnCanvas, 0.17 * (tnCanvas.height - textH))
    
    tnCtx.fillStyle = "#000000FF"
    setFontSize(tnCtx, fontSize, italic)
    for (let i = 0; i < lines[fitsI].length; i++) {
        tnCtx.fillText(lines[fitsI][i], 
            0.5 * (tnCanvas.width - lineWs[fitsI][i]), 
            y0 + i * fontH * (1+vertSpaceR))
    }
    
    return  tnCtx.getImageData(0, 0, tnCanvas.width, tnCanvas.height)
}

function getSplits(_s) {
    const MAX_SPLITS = 3
    let s = _s
    while (s.indexOf("  ") != -1) s = s.replace("  ", " ")
    const rtn = [[s]]
    let spaces = 0
    for (char of s) spaces += char == ' ' ? 1 : 0
    for (let h = 0; h < Math.min(spaces, MAX_SPLITS); h++) {
        const bestSplitIs = []
        for (let i = 0; i < h + 1; i++) bestSplitIs.push(-1)
        let prevI = 0
        for (let i = 0; i < s.length; i++) {
            if (s[i] == ' ' && prevI < bestSplitIs.length) {
                bestSplitIs[prevI++] = i
            }
        }
        for (let i = h; i >= 0; i--) {
            const targetR = (i + 1) / (h + 2)
            let bestR = (bestSplitIs[i] - i) / (s.length - Math.min(spaces, MAX_SPLITS))
            const stop = i == h ? s.length : bestSplitIs[i + 1]
            for (let j = bestSplitIs[i]; j < stop; j++) {
                if (s[j] != ' ') continue
                const newR = (j - i) / (s.length - Math.min(spaces, MAX_SPLITS))
                if (Math.abs(newR - targetR) < Math.abs(bestR - targetR)) {
                    bestR = newR
                    bestSplitIs[i] = j
                }
            }
        }
        const newLine = []
        for (let i = 0; i < h+2; i++) newLine.push("")
        for (let i = 0; i < h+2; i++) {
            const start = i == 0 ? 0 : bestSplitIs[i - 1] + 1
            const stop = i == h + 1 ? s.length : bestSplitIs[i]
            newLine[i] = s.substring(start, stop)
        }
        rtn.push(newLine)
    }
    return rtn
}

function bitmapFromTextnameLanguageAndDXDY(textname, dx, dy,
    background_rgb, skipOutline, curved, smallSpace,
    bMode) {
    const lines = getSplits(textname.vals[Settings.lang])
    return _bitmapFromTextnameLanguageAndDXDY(
        textname, lines, dx, dy, background_rgb, skipOutline, curved, smallSpace, bMode
    )
}