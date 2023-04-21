
const World = {}
World.testLights = [0, 0, 0, 0, 0.707 ,0.707, 0.707, 0, 0.707]
World.lightThs = []
World.lightMomentums = []
for (let i = 0; i < 6; i++) {
    World.lightThs.push(0.3 + 0.4*PIF*Math.random())
    World.lightMomentums.push(1-Math.random)
}
World.t_0 = Date.now()
World.t_prev = World.t_0 - 17
World.dT_ms = 17
World.t_ms = 0
World.t_s = 0
World.onFrame = function () {
    const now = Date.now()
    World.dT_ms = now - World.t_prev
    World.t_ms += World.dT_ms
    World.t_prev = now
    World.t_s = 0.001 * World.t_ms
}

World.dobsStarScaleOrig = 1
World.regionThanksForPlaying = [0, 0, 0, 0]
World.regionThanksShift = [0, 0, 0, 0]
World.regionThanksShiftText = [0, 0, 0, 0]
World.regionPickaxeInstruction = [0, 0, 0, 0]
World.regionBranding = [0, 0, 0, 0]
World.regionFullSquare = [0, 0, 0, 0]
World.dummyXYZ = [0, 0, 0]
World.regionDummy = [0, 0, 0, 0]
World.regionIntroMenu = [0, 0, 0, 0]
World.regionIntroIcon = [0, 0, 0, 0]
World.regionIntroGem = [0, 0, 0, 0]
World.regionMap = [0, 0, 0, 0]
World.regionMenu = [0, 0, 0, 0]
World.regionHand = [0, 0, 0, 0]
World.regionTutMap = [0, 0, 0, 0]
World.regionTut = [0, 0, 0, 0]
World.regionScore = [0, 0, 0, 0]
World.regionBrickBot = [0, 0, 0, 0]
World.dobBrickBot = DisplayObject()
World.regionBrickTop = [0, 0, 0, 0]
World.dobBrickTop = DisplayObject()
World.regionHome = [0, 0, 0, 0]
World.dobGlobe = DisplayObject()
World.regionSettings = [0, 0, 0, 0]
World.dobsBorder = []
World.offscreenXYZ = [0, 0, 0]
World.regionFlag = [0, 0, 0, 0]
World.dobDisplayShade = DisplayObject()
World.dobDisplayMenuShade = DisplayObject()
World.dobsStarShadow = [
    DisplayObject(_xyz=[0, 0, SHADE_Z + 0.1]),
    DisplayObject(_xyz=[0, 0, SHADE_Z + 0.1]),
    DisplayObject(_xyz=[0, 0, SHADE_Z + 0.1]),
    DisplayObject(_xyz=[0, 0, SHADE_Z + 0.1]),
    DisplayObject(_xyz=[0, 0, SHADE_Z + 0.1]),
]
World.dobsStar = [
    DisplayObject(_xyz= [0, 0, SHADE_Z + 1.1]),   
    DisplayObject(_xyz= [0, 0, SHADE_Z + 1.1]),   
    DisplayObject(_xyz= [0, 0, SHADE_Z + 1.1]),   
    DisplayObject(_xyz= [0, 0, SHADE_Z + 1.1]),   
    DisplayObject(_xyz= [0, 0, SHADE_Z + 1.1]),   
]

World.updateForViewWidthHeight = function(_viewWidth, _viewHeight) {
    World.viewWidth = _viewWidth// * window.devicePixelRatio
    World.viewHeight = _viewHeight// * window.devicePixelRatio
    World.fov = Math.atan(Math.tan(FOV_FOR_MAX) * World.viewHeight / Math.max(World.viewWidth, World.viewHeight))
    World.pvm = PVM(World.viewWidth, World.viewHeight, World.fov)
    World.dy = CAM_Z * Math.tan(World.fov * 0.5)
    World.dx = World.dy * World.viewWidth / World.viewHeight
    worldSetRegions()
    World.pvm.updateWidthHeight(World.viewWidth, World.viewHeight, World.fov, 0, 0, CAM_Z)
}
/*
World.miscDO = DisplayObject()
World.dobsBorder = []
World.offscreenXYZ = floatArrayOf(0, 0, 0)
World.regionThanksForPlaying = [0, 0, 0, 0]
World.regionThanksShift = [0, 0, 0, 0]
World.regionThanksShiftText = [0, 0, 0, 0]
World.regionHand = [0, 0, 0, 0]
World.regionMenu = [0, 0, 0, 0]
World.regionFlag = [0, 0, 0, 0]
World.regionFlagL = [0, 0, 0, 0]
World.regionFlagR = [0, 0, 0, 0]
World.regionEndCheckFail = [0, 0, 0, 0]
World.regionScore = [0, 0, 0, 0]
World.regionSettings = [0, 0, 0, 0]
World.regionPullUp1 = [0, 0, 0, 0]
World.regionPullUp2 = [0, 0, 0, 0]
World.regionPickpone = [0, 0, 0, 0]
World.dobPickponeA = DisplayObject()
World.dobPickponeB = DisplayObject()
World.regionForfeit = [0, 0, 0, 0]
World.regionDontForfeit = [0, 0, 0, 0]
World.regionHome = [0, 0, 0, 0]
World.regionDisplayTitleASingle = [0, 0, 0, 0]
World.regionDisplayTitleADoubleA = [0, 0, 0, 0]
World.regionDisplayTitleADoubleB = [0, 0, 0, 0]
World.regionDisplayTitleBSingle = [0, 0, 0, 0]
World.regionDisplayTitleBDoubleA = [0, 0, 0, 0]
World.regionDisplayTitleBDoubleB = [0, 0, 0, 0]
World.dobDisplaySingle = DisplayObject()
World.dobDisplayDoubleA = DisplayObject()
World.dobDisplayDoubleB = DisplayObject()
World.regionDisplayTitleBotSingle = [0, 0, 0, 0]
World.regionDisplayTitleBotDoubleA = [0, 0, 0, 0]
World.regionDisplayTitleBotDoubleB = [0, 0, 0, 0]
World.regionDisplayDescriptionSingle = [0, 0, 0, 0]
World.regionDisplayDescriptionDoubleA = [0, 0, 0, 0]
World.regionDisplayDescriptionDoubleB = [0, 0, 0, 0]
World.regionDisplayDescriptionSmallSingle = [0, 0, 0, 0]
World.regionDisplayDescriptionSmallDoubleA = [0, 0, 0, 0]
World.regionDisplayDescriptionSmallDoubleB = [0, 0, 0, 0]
World.regionQuarterHand = [0, 0, 0, 0]
World.regionUse = [0, 0, 0, 0]
World.buttonIntroPlay = BButton(Textname.introPlay, 0)
World.buttonIntroSettings = BButton(Textname.introSettings, 0)
World.buttonClose = BButton(Textname.close, DISPLAY_Z)
World.buttonViewMap = BButton(Textname.pickaxeViewMap, DISPLAY_Z)
World.buttonFinish = BButton(Textname.finishButton, WIDGET_Z)
World.buttonForfeit = BButton(Textname.forfeit, DISPLAY_Z)
World.buttonReturnToLevels = BButton(Textname.returnToLevels, DISPLAY_Z)

World.clickableSettingsRegion = [0, 0, 0, 0]
*/