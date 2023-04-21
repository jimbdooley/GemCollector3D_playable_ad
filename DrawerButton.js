


function BButton(_textname, _z) {
    const r = {textname: _textname,z: _z}
    r.clickable = [0, 0, 0, 0]
    r.pressed = 0
    r.region = [0, 0, 0, 0]
    r.textRegion = [0, 0, 0, 0]
    r.actualTextRegion = [0, 0, 0, 0]
    r.topDO = DisplayObject()
    r.leftDO = DisplayObject()
    r.rightDO = DisplayObject()
    r.setClickable = BButton_setClickable
    r.setTextRegion = BButton_setTextRegion
    r.checkPressed = BButton_checkPressed
    return r
}

function BButton_setClickable() {
    const btnW = TEXT_D_SCALES[2*this.textname.ordinal] + TEXT_D_SCALES[2*this.textname.ordinal+1] * (1 / (1 - BTN_THICKNESS_TO_HEIGHT) - 1)
    const btnH = TEXT_D_SCALES[2*this.textname.ordinal+1] / (1 - BTN_THICKNESS_TO_HEIGHT)
    if (btnW / btnH < this.region[2] / this.region[3]) {
        this.clickable[1] = this.region[1]
        this.clickable[2] = this.region[3] * btnW / btnH
        this.clickable[3] = this.region[3]
        this.clickable[0] = this.region[0] + 0.5 * (this.region[2] - this.clickable[2])
    } else {
        this.clickable[0] = this.region[0]
        this.clickable[2] = this.region[2]
        this.clickable[3] = this.region[2] * btnH / btnW
        this.clickable[1] = this.region[1] + 0.5 * (this.region[3] - this.clickable[3])
    }
}

function BButton_setTextRegion(_region, makeBmp=true) {
    for (let i = 0; i < 4; i++) this.region[i] = _region[i]
    const xMid = this.region[0] + 0.5 * this.region[2]
    const yMid = this.region[1] + 0.5 * this.region[3]
    this.textRegion[0] = Math.floor(xMid - 0.5 * (1 - BTN_THICKNESS_TO_HEIGHT) * this.region[2])
    this.textRegion[1] = Math.floor(yMid - 0.5 * (1 - BTN_THICKNESS_TO_HEIGHT) * this.region[3])
    this.textRegion[2] = Math.ceil((1 - BTN_THICKNESS_TO_HEIGHT) * this.region[2])
    this.textRegion[3] = Math.ceil((1 - BTN_THICKNESS_TO_HEIGHT) * this.region[3])
    const textRegionTopLeft = [0, 0, 0, 0]
    setWorldXYZFromDeviceXY(textRegionTopLeft, this.textRegion[0], this.textRegion[1],this.z)
    const textRegionBotRight = [0, 0, 0, 0]
    setWorldXYZFromDeviceXY(textRegionBotRight, this.textRegion[0] + this.textRegion[2], this.textRegion[1] + this.textRegion[3],this.z)
    const regionTopLeft = [0, 0, 0, 0]
    setWorldXYZFromDeviceXY(regionTopLeft, this.region[0], this.region[1],this.z)
    const regionBotRight = [0, 0, 0, 0]
    setWorldXYZFromDeviceXY(regionBotRight, this.region[0]+this.region[2], this.region[1]+this.region[3],this.z)
    this.topDO.x = 0.5 * (textRegionTopLeft[0] + textRegionBotRight[0])
    this.topDO.y = 0.5 * (textRegionTopLeft[1] + textRegionBotRight[1])
    this.leftDO.y = 0.5 * (textRegionTopLeft[1] + textRegionBotRight[1])
    this.rightDO.y = this.leftDO.y
    this.rightDO.thZ = PIF
    if (makeBmp) {
        let color
        if (textname == Textname.close) {
            color = [255, BUTTON_CLOSE_COLOR[0], BUTTON_CLOSE_COLOR[1], BUTTON_CLOSE_COLOR[2]]
        } else {
            color = [255, BUTTON_COLOR[0], BUTTON_COLOR[1], BUTTON_COLOR[2]]
        }
        DrawerText.createBmp(textname, textRegion, color, this)
    }
}

function BButton_checkPressed() {
    const down = mouseInRegion(Mouse.lastDownX, Mouse.lastDownY, this.clickable)
    const up = mouseInRegion(Mouse.lastUpX, Mouse.lastUpY, this.clickable)
    this.pressed = Mouse.isDown && down ? 1 : 0
    return Mouse.justUp && down && up
}

const BTN_THICKNESS_TO_HEIGHT = 0.28
const DrawerButton = {
    centerDummy: [0, 0, 0],
    sideBufs: getBtnSidePNIT(BTN_THICKNESS_TO_HEIGHT),
    topBotBufs: getBtnTopBotPNIT(BTN_THICKNESS_TO_HEIGHT),
    draw(tn) {
        const rtn = tn.btn.checkPressed()
        DrawerText.draw(tn, tn.btn.z)
        const tr = tn.btn.actualTextRegion
        setWorldXYZFromDeviceXY(this.centerDummy, tr[0], tr[1], tn.btn.z)
        const dx = xDistFromZAndDeviceRegion(tn.btn.z, tr)
        const dy = yDistFromZAndDeviceRegion(tn.btn.z, tr)
        tn.btn.topDO.sx = 0.5 * dx
        tn.btn.topDO.sy = 0.5 * dy / (1 - BTN_THICKNESS_TO_HEIGHT)
        tn.btn.topDO.sz = 0.5 * dy / (1 - BTN_THICKNESS_TO_HEIGHT)
        tn.btn.topDO.x = this.centerDummy[0] + 0.5*dx
        tn.btn.topDO.y = this.centerDummy[1] - 0.5*dy
        
        tn.btn.leftDO.x = this.centerDummy[0]
        tn.btn.leftDO.y = tn.btn.topDO.y
        tn.btn.leftDO.scale = tn.btn.topDO.sy
        tn.btn.rightDO.x = this.centerDummy[0] + dx
        tn.btn.rightDO.y = tn.btn.topDO.y
        tn.btn.rightDO.scale = tn.btn.topDO.sy
        tn.btn.topDO.z = tn.btn.z - tn.btn.pressed
        tn.btn.leftDO.z = tn.btn.z - tn.btn.pressed
        tn.btn.rightDO.z = tn.btn.z - tn.btn.pressed
        const light = tn.btn.pressed == 0 ? DrawerVanilla.BTN_NOT_PRESSED : DrawerVanilla.BTN_PRESSED
        DrawerVanilla.draw(tn.btn.topDO, tn.colorStr, this.topBotBufs, false, light)
        DrawerVanilla.draw(tn.btn.leftDO, tn.colorStr, this.sideBufs, false, light)
        DrawerVanilla.draw(tn.btn.rightDO, tn.colorStr, this.sideBufs, false, light)
        return rtn
    }
}