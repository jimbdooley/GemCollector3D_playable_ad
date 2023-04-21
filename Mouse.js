
const Mouse = {
    prevT: 0,
    lastX: 0,
    lastY: 0,
    _lastDownX: -1000,
    _lastDownY: -1000,
    _lastUpX: -1000,
    _lastUpY: -1000,
    _lastMoveX: -1000,
    _lastMoveY: -1000,
    _lastDownOrMoveX: -1000,
    _lastDownOrMoveY: -1000,
    _justUp: false,
    _justDown: false,
    _justMoved: false,
    _isDown: false,
    _lastDownT: 999999999,
    lastDownX: -1000,
    lastDownY: -1000,
    lastUpX: -1000,
    lastUpY: -1000,
    lastMoveX: -1000,
    lastMoveY: -1000,
    lastDownOrMoveX: -1000,
    lastDownOrMoveY: -1000,
    justUp: false,
    justDown: false,
    justMoved: false,
    isDown: false,
    lastDownT: 999999999,
    load() {
        this.lastDownX = this._lastDownX
        this.lastDownY = this._lastDownY
        this.lastUpX = this._lastUpX
        this.lastUpY = this._lastUpY
        this.lastMoveX = this._lastMoveX
        this.lastMoveY = this._lastMoveY
        this.lastDownOrMoveX = this._lastDownOrMoveX
        this.lastDownOrMoveY = this._lastDownOrMoveY
        this.justUp = this._justUp
        this.justDown = this._justDown
        this.justMoved = this._justMoved
        this.isDown = this._isDown
        this.lastDownT = this._lastDownT
        this._justUp = false
        this._justDown = false
        this._justMoved = false
    },
}

function getTheGameClick() {
    const extra = 10
    let rtn = _mouseInRegion(Mouse.lastDownX, Mouse.lastDownY, 
        World.regionMenu[0] - extra,
        World.regionMenu[1] - extra,
        World.regionMenu[3] + 2*extra,
        World.regionMenu[3] + 2*extra,
    )
    rtn = rtn && _mouseInRegion(Mouse.lastUpX, Mouse.lastUpY, 
        World.regionMenu[0] - extra,
        World.regionMenu[1] - extra,
        World.regionMenu[3] + 2*extra,
        World.regionMenu[3] + 2*extra,
    )
    return rtn
}

function settingsClick() {
    let rtn = _mouseInRegion(Mouse.lastDownX, Mouse.lastDownY, 
        World.regionMenu[0] + World.regionMenu[2] - World.regionMenu[3],
        World.regionMenu[1],
        World.regionMenu[3],
        World.regionMenu[3],
    )
    rtn = rtn && _mouseInRegion(Mouse.lastUpX, Mouse.lastUpY, 
        World.regionMenu[0] + World.regionMenu[2] - World.regionMenu[3],
        World.regionMenu[1],
        World.regionMenu[3],
        World.regionMenu[3],
    )
    return rtn
}

const initialDPR = window.devicePixelRatio
const USE_TOUCH = false
function getX(e, rect, touch_end) {
    let clientX = touch_end 
        ? e.changedTouches[0].clientX
        : (USE_TOUCH ? e.touches[0].clientX : e.clientX)
    return (clientX - rect.x) * initialDPR
}

function getY(e, rect, touch_end) {
    let clientY = touch_end 
        ? e.changedTouches[0].clientY 
        : (USE_TOUCH ? e.touches[0].clientY : e.clientY)
    return (clientY - rect.y) * initialDPR
}

function mouseall(e) {
    const rect = canvas.getBoundingClientRect()
    const x = getX(e, rect)
    const y = getY(e, rect)
    Mouse.lastX = x
    Mouse.lastY = y
}

function mousedown(e) {
    const rect = canvas.getBoundingClientRect()
    const x = getX(e, rect)
    const y = getY(e, rect)
    Mouse._lastDownX = x
    Mouse._lastDownY = y
    Mouse._lastDownOrMoveX = x
    Mouse._lastDownOrMoveY = y
    Mouse._justDown = true
    Mouse._isDown = true
    Mouse._lastDownT = Date.now()
    mouseall(e)
}

function mousemove(e) {
    if (!Mouse._isDown) return
    if (!Mouse.isDown) return
    const rect = canvas.getBoundingClientRect()
    const x = getX(e, rect)
    const y = getY(e, rect)
    const currT = Date.now()
    const dx = x - Mouse.lastX
    const dy = y - Mouse.lastY
    Mouse.prevT = currT
    Mouse._lastMoveX = x
    Mouse._lastMoveY = y
    Mouse._lastDownOrMoveX = x
    Mouse._lastDownOrMoveY = y
    Mouse._justMoved = true
    Mouse._isDown = true
    mouseall(e)
}

function mouseup(e) {
    const rect = canvas.getBoundingClientRect()
    const x = getX(e, rect, USE_TOUCH)
    const y = getY(e, rect, USE_TOUCH)
    Mouse._lastUpX = x
    Mouse._lastUpY = y
    Mouse._justUp = true
    Mouse._isDown = false
    mouseall(e)
}

if (USE_TOUCH) {
    canvas.ontouchstart = mousedown
    canvas.ontouchmove = mousemove
    canvas.ontouchend = mouseup
    canvas.ontouchcancel = (e) => {
        if (Mouse.isDown) mouseup(e)
    }
} else {
    canvas.onmouseup = mouseup
    canvas.onmousemove = mousemove
    canvas.onmousedown = mousedown
    canvas.onmouseleave = (e) => {
        if (Mouse.isDown) mouseup(e)
    }
}