const TABLET_THRESHOLD = 550
var isTablet = Math.min(window.innerHeight, window.innerWidth) > TABLET_THRESHOLD
function isVerticalMode() {
    //return true
    return World.viewWidth <= World.viewHeight || isTablet
}

const introScale = 1.2
const introDOBS = [
    DisplayObject([0, 0, 0], [introScale, introScale, introScale]),
    DisplayObject([0, 0, 0], [introScale, introScale, introScale]),
    DisplayObject([0, 0, 0], [introScale, introScale, introScale]),
]
const introShapes = [GemShape.MARQUISE, GemShape.BRIOLETTE, GemShape.RECTANGLE]
const introColors= [GemColor.YELLOW, GemColor.BLUE, GemColor.GREEN]
let introCtr = 0
const introT = 100

const MyGLRenderer = {}
MyGLRenderer.dob = DisplayObject(xyz=[-12, 0, 0])
MyGLRenderer.dobPlayGem = DisplayObject()
MyGLRenderer.testPNIT = getStarPosNormIndTex()
MyGLRenderer.testGemShapeArr = [GemShape.MARQUISE, GemShape.BRIOLETTE, GemShape.HEART, GemShape.RECTANGLE]
fingerDOB = DisplayObject()
MyGLRenderer.render = function() {
    Mouse.load()
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.clear(gl.DEPTH_BUFFER_BIT)
    World.onFrame()
    if (Mouse.justUp && getTheGameClick()) getTheGame()
    if (!Settings.menuMode && Mouse.justUp && settingsClick()) {
        fromGameToMenu()
    }
    if (Settings.intro) {
        DrawerIntro.draw()
        if (World.t_s - DrawerIntro.t_s0 > DrawerIntro.ANIMATION_DT + DrawerIntro.BUTTON_DISPLAY_DELAY) {
            World.regionDummy[0] = Textname.introSettings.btn.clickable[0] - 0.99 * Textname.introSettings.btn.clickable[3]
            World.regionDummy[1] = Textname.introSettings.btn.clickable[1] - 0.045 * Textname.introSettings.btn.clickable[3]
            World.regionDummy[2] = Textname.introSettings.btn.clickable[3]
            World.regionDummy[3] = Textname.introSettings.btn.clickable[3]
            DrawerGear.draw(World.regionDummy)
            World.regionDummy[0] = Textname.introPlay.btn.clickable[0] - 1.1 * Textname.introPlay.btn.clickable[3]
            World.regionDummy[1] = Textname.introPlay.btn.clickable[1]
            World.regionDummy[2] = Textname.introPlay.btn.clickable[3]
            World.regionDummy[3] = Textname.introPlay.btn.clickable[3]
            setXYZSXSYFromRegionAndZ(MyGLRenderer.dobPlayGem, World.regionDummy, Textname.introPlay.btn.z)
            setThsFromGemShape(MyGLRenderer.dobPlayGem, World.t_ms, GemShape.TRILLIANT)
            MyGLRenderer.dobPlayGem.thTilt *= 0.22
            DrawerGem.draw(MyGLRenderer.dobPlayGem, GemShape.TRILLIANT, GemColor.GREEN, DrawerIntro.introLights)
            DrawerButton.draw(Textname.introSettings)
            if (DrawerButton.draw(Textname.introPlay)) {
                Settings.intro = false
            }
        } else {
            if (Mouse.justUp) DrawerIntro.t_s0 -= 10
        }
    } else {
        const level = MyGLRenderer.levels[Settings.playingLevel]
        if (Settings.showScene) DrawerVanilla.draw(World.dobBrickBot, "hand_bgr", PosNormIndTexs.square)
        if (Settings.showScene) DrawerVanilla.draw(World.dobBrickTop, "hand_bgr", PosNormIndTexs.square)
        DrawerGear.draw(World.regionSettings)
        let scroll = level.currState.levelState == LevelState.NEEDS_INITIATION
        scroll = scroll || level.currState.levelState == LevelState.FINISHED
        scroll = scroll || level.currState.levelState == LevelState.DEAL_HAND
        scroll = scroll || level.currState.levelState == LevelState.FINISHED_FINAL
        scroll = scroll || level.currState.levelState == LevelState.END_SCREEN
        DrawerScene.draw(World.regionMap, scroll, Scene.values()[level.colorArrI])
        for (const dobBorder of World.dobsBorder) {
            if (Settings.showScene) DrawerVanilla.draw(dobBorder, "shade", PosNormIndTexs.square)
        }
        DrawerVanilla.draw(World.dobGlobe, "tmap", PosNormIndTexs.square)
        level.loop()
    }

    fingerLoop()
}

let l0 = null
MyGLRenderer.init = function() {
    gl.clearColor(0.24, 0.04, 0.24, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    MyGLRenderer.levels = getAllLevels()
    l0 = MyGLRenderer.levels[2]
    defineGemData()
    PosNormIndTexs.setupFirst()
    PosNormIndTexs.setupSecond()
    DrawerGem.setup()
    DrawerScene.setup()
    DrawerRowCheck.setup()
    DrawerIndicator.setup()
    

    for (let i = 0; i < 5; i++) {
        if (document.getElementById(`radio${i}`).checked) Settings.sightType = SightType_values[i]
    }

    MyGLRenderer.onSurfaceChanged()
}

const usesTut = []
if (SHORT_LEVELS) {
    if (CUSTOM_LEVELS) {
        usesTut.push("1_0", "1_1")
    } else {
        usesTut.push("1_0", "1_1", "1_2")
    }
} else {
    if (CUSTOM_LEVELS) {
        usesTut.push("1_0", "1_1", "1_3")
    } else {
        usesTut.push("1_0", "1_1", "1_2", "1_4")
    }
}
let dvsu = 0 
MyGLRenderer.onSurfaceChanged = function() {
    //while (DrawerVanilla.textnamesDone.length > 0) DrawerVanilla.textnamesDone.pop()
    gl.viewport(0, 0, canvas.width, canvas.height)
    World.updateForViewWidthHeight(canvas.width, canvas.height)
    set_textname_regions()
    set_button_regions()
    DrawerIntro.setup()
    

    isTablet = Math.min(window.innerHeight, window.innerWidth) > TABLET_THRESHOLD
    if (dvsu++ == 0) DrawerVanilla.setup()
    for (const level of MyGLRenderer.levels) {
        for (let i = 0; i < level.maps.length; i++) {
            const tutKey = `${level.n}_${i}`
            const regionToUse = usesTut.indexOf(tutKey) != -1 ? World.regionTutMap : World.regionMap
            fitMap(level.maps[i], regionToUse)
        }
    }
    
}

function swapSS_real(w, h) {
    pause = true
    canvas.width = w
    canvas.height = h
    canvas.style.width = `${canvas.width}px`
    canvas.style.height = `${canvas.height}px`
    MyGLRenderer.onSurfaceChanged()
    DrawerVanilla.textnameSetup()
    pause = false
}

async function swapSS() {
    swapSS_real(canvas.width = canvas.width == 300 ? 700 : 300, canvas.height)
}