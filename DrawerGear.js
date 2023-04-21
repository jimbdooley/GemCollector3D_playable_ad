
const GEAR_PEAK_R = 0.58
const GEAR_VALLEY_R = 0.72

const DrawerGear = {
    sysThZ: PIF * 0.28,
    sysThTilt: 0.55,
    smallBumps: 9,
    largeBumps: 11,
}
DrawerGear.gearPosNormIndTexSmall = getGearPosNormIndTex(DrawerGear.smallBumps),
DrawerGear.gearPosNormIndTexLarge = getGearPosNormIndTex(DrawerGear.largeBumps),
DrawerGear.smallR = DrawerGear.smallBumps / DrawerGear.largeBumps,
DrawerGear.smallD = DrawerGear.smallR - 0.32 * DrawerGear.smallR * (1 - GEAR_VALLEY_R),
DrawerGear.largeD = 1 - 0.32 * DrawerGear.smallR * (1 - GEAR_VALLEY_R),
DrawerGear.smallGearObj = DisplayObject(
    [0, DrawerGear.smallR - 0.32 * DrawerGear.smallR * (1 - GEAR_VALLEY_R), 35],
    [DrawerGear.smallR, DrawerGear.smallR, 1],
    DrawerGear.sysThTilt,
    PIF/2
),
DrawerGear.largeGearObj = DisplayObject(
    [0, -1 + 0.32 * DrawerGear.smallR * (1 - GEAR_VALLEY_R), 35],
    [1, 1, 1],
    DrawerGear.sysThTilt,
    PIF/2
),
DrawerGear.thZStartSmall = -GEAR_PEAK_R * PIF / DrawerGear.smallBumps - PIF/2
DrawerGear.thZStartLarge = -GEAR_PEAK_R * PIF / DrawerGear.largeBumps + PIF/2 + PIF/DrawerGear.largeBumps


DrawerGear.leftXYZ = [0, 0, 0]
DrawerGear.rightXYZ = [0, 0, 0]
DrawerGear.draw = function(region) {
    setWorldXYZFromDeviceXY(DrawerGear.leftXYZ, region[0], region[1] + 0.5*region[3], WIDGET_Z)
    setWorldXYZFromDeviceXY(DrawerGear.rightXYZ, region[0] + region[2], region[1] + 0.5*region[3], WIDGET_Z)
    const rotated = 0.4 * World.t_s
    const xyz = [0.5*(DrawerGear.leftXYZ[0]+DrawerGear.rightXYZ[0]), 0.5*(DrawerGear.leftXYZ[1]+DrawerGear.rightXYZ[1]), WIDGET_Z]
    const scale = 0.25 * (DrawerGear.rightXYZ[0] - DrawerGear.leftXYZ[0])
    DrawerGear.smallGearObj.sx = DrawerGear.smallR * scale
    DrawerGear.smallGearObj.sy = DrawerGear.smallR * scale
    DrawerGear.smallGearObj.sz = DrawerGear.smallR * scale
    DrawerGear.largeGearObj.sx = scale
    DrawerGear.largeGearObj.sy = scale
    DrawerGear.largeGearObj.sz = scale
    DrawerGear.smallGearObj.x = xyz[0] + DrawerGear.smallD * scale * Math.cos(DrawerGear.sysThZ) * Math.cos(DrawerGear.sysThTilt)
    DrawerGear.smallGearObj.y = xyz[1] + DrawerGear.smallD * scale * Math.sin(DrawerGear.sysThZ)
    DrawerGear.smallGearObj.z = xyz[2] - DrawerGear.smallD * scale * Math.cos(DrawerGear.sysThZ) * Math.sin(DrawerGear.sysThTilt)
    DrawerGear.largeGearObj.x = xyz[0] - DrawerGear.largeD * scale * Math.cos(DrawerGear.sysThZ) * Math.cos(DrawerGear.sysThTilt)
    DrawerGear.largeGearObj.y = xyz[1] - DrawerGear.largeD * scale * Math.sin(DrawerGear.sysThZ)
    DrawerGear.largeGearObj.z = xyz[2] + DrawerGear.largeD * scale * Math.cos(DrawerGear.sysThZ) * Math.sin(DrawerGear.sysThTilt)
    DrawerGear.smallGearObj.thZ = DrawerGear.thZStartSmall + DrawerGear.sysThZ - rotated
    DrawerGear.largeGearObj.thZ = DrawerGear.thZStartLarge + DrawerGear.sysThZ + rotated * DrawerGear.smallR
    DrawerGear.smallGearObj.thTilt = DrawerGear.sysThTilt
    DrawerGear.largeGearObj.thTilt = DrawerGear.sysThTilt

    DrawerVanilla.draw(DrawerGear.smallGearObj, "gearMetal", DrawerGear.gearPosNormIndTexSmall)

    DrawerVanilla.draw(DrawerGear.largeGearObj, "gearMetal", DrawerGear.gearPosNormIndTexLarge)
}
