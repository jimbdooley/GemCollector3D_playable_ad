function backToGame() {
    const menuDiv = document.getElementById("container")
    menuDiv.style.display = "none"
    canvas.style.display = ""
}

function fromGameToMenu() {
    canvas.style.display = "none"
    const menuDiv = document.getElementById("container")
    menuDiv.style.display = ""
    if (World.viewWidth > World.viewHeight) {
        document.getElementById("menu1").style.display = "inline-block"
        document.getElementById("menu1").style.marginRight = "30px"
        document.getElementById("menu2").style.display = "inline-block"
    } else {
        document.getElementById("menu1").style.display = ""
        document.getElementById("menu2").style.display = ""
    }
    
}

const colors = [
    ["purple", "#33bb33", "red", "white"],
    ["white", "black", "red", "#71aEeB"],
    ["white", "black", "red", "#71aEeB"],
    ["blue", "white", "red", "black"],
    ["black", "white", "#7f7f7f", "#cccccc"],
]

function radio(_i) {
    const i = _i == 0 || _i == 1 || _i == 2 || _i == 3 || _i == 4 ? _i : 0
    for (let j = 0; j < 5; j++) {
        document.getElementById(`radio${j}`).checked = j == i
    }
    Settings.sightType = SightType_values[i]
    const quadvas = document.getElementById("colorQuads")
    const qtx = quadvas.getContext("2d")

    qtx.fillStyle = colors[i][0]
    qtx.fillRect(0, 0, quadvas.width*0.5, quadvas.height*0.5)
    qtx.fillStyle = colors[i][1]
    qtx.fillRect(quadvas.width*0.5, 0, quadvas.width*0.5, quadvas.height*0.5)
    qtx.fillStyle = colors[i][2]
    qtx.fillRect(0, quadvas.height*0.5, quadvas.width*0.5, quadvas.height*0.5)
    qtx.fillStyle = colors[i][3]
    qtx.fillRect(quadvas.width*0.5, quadvas.height*0.5, quadvas.width*0.5, quadvas.height*0.5)
    if (i == 4) {
        qtx.drawImage(drawable["white2.png"], 
            0.5 * quadvas.width, 
            0.5 * quadvas.height, 
            0.5 * quadvas.width, 
            0.5 * quadvas.height
        )
    }
}