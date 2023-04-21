
function CardGem(cardDetail, levelShapes) {
    const r = Card(cardDetail, levelShapes)
    r.isBoardPlaceable = true
    r.cardType = CardType.GEM_REGULAR
    r.draw = CardGem_draw
    return r
}

function CardGem_draw() {
    setThsFromGemShape(this.o, this.spinT_ms, this.gemShape)
    if (!this.onScreen()) return 0
    DrawerGem.draw(this.o, this.gemShape, Settings.colors[Settings.sightType.i][this.gemColorArrI][this.gemColorI], World.testLights)
    return 1
}