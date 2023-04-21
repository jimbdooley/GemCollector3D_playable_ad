let pause = false
function loop() {
    requestAnimationFrame(loop)
    if (pause) return
    MyGLRenderer.render()
}

function getTheGame() {
    ExitApi.exit()
}

async function setCanvasWH() {

    const CW = window.innerWidth
    const CH = window.innerHeight
    canvas.width = CW * window.devicePixelRatio
    canvas.height = CH * window.devicePixelRatio
    canvas.style.width = `${CW}px`
    canvas.style.height = `${CH}px`
}

async function init() {
    radio(Settings.sightType.i)
    await setCanvasWH()
    await get_all_assets()
    await load_all_textnames(Settings.lang)
    MyGLRenderer.init()
    loop()
}
init()


// TODO: delete all after this
function canvasToImage() {
    let canvas = document.getElementById('canvas');
    const img = new Image()
    img.src = canvas.toDataURL("image/png")
    document.body.appendChild(img)
}

function downloadCanvasAsImage(name="canvas_name_here"){
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', `${name}.png`);
    let dataURL = captureCanvas.toDataURL('image/png');
    let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
    downloadLink.setAttribute('href', url);
    downloadLink.click();
}