function resize_canvas(){
    console.log("resizing")
    let _canvas = document.getElementById("canvas");
    setCanvasWH()
    swapSS_real(window.innerWidth, window.innerHeight)
}
document.getElementById("container").style.display = "none"
const JUMPING_INTRO = true
const SHORT_LEVELS = true
const CUSTOM_LEVELS = true
const JUST_ONE = false
const SHOW_SCENE = true
const assets = {}
const drawable = {}
const drawableArrs = {}
const canvas = document.getElementById("canvas");
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
const img_generating_canvas = document.createElement("canvas")
const img_generating_ctx = img_generating_canvas.getContext("2d")
const PI = Math.PI
const Random = {
    nextInt(start, stop) {
        return Math.floor(start + (stop-start) * Math.random())
    },
}
const Color = {
    argb(a, r, g, b) {
        return [a, r, g, b]
    }
}
const Bitmap = {
    createBitmap(argbArr, rows, cols) {
        const pixels = new Uint8ClampedArray(rows*cols*4)
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                pixels[4*(cols*i + j) + 0] = argbArr[i*cols + j][1]
                pixels[4*(cols*i + j) + 1] = argbArr[i*cols + j][2]
                pixels[4*(cols*i + j) + 2] = argbArr[i*cols + j][3]
                pixels[4*(cols*i + j) + 3] = argbArr[i*cols + j][0]
            }
        }
        return new ImageData(pixels, rows, cols)
    },
    Config: {ARGB: -1},
}