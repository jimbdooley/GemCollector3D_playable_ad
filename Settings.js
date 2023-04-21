
const SightType = {
    STANDARD: {i: 0},
    TRITANOPIA: {i: 1},
    TRITANONOMALY: {i: 2},
    RED_GREEN: {i: 3},
    MONOCHROME: {i: 4}
}
const SightType_values = [SightType.STANDARD, SightType.TRITANOPIA, SightType.TRITANONOMALY, SightType.RED_GREEN, SightType.MONOCHROME]

const Loc = {
    BROWSER_GAME: {},
    PLAYABLE_AD_GOOGLE: {}
}

const Settings = {
    showScene: SHOW_SCENE,
    loc: Loc.PLAYABLE_AD_GOOGLE,
    menuMode: false,
    lang: "en", 
    intro: JUMPING_INTRO,
    levelStates: [],
    playingLevel: 0,
    returnToLevelsEnable: false,
    rateable: false,
    askForRating: false,
    forfeitEnable: false,
    setBestScore() {
    },

}
for (let i = 0; i < LEVEL_FILES.length; i++) {
    Settings.levelStates.push("")
}
Settings.sightType = SightType.STANDARD
Settings.colors = [
    [ // index 0 -> standard
        // mountain
        [GemColor.RED, GemColor.GREEN, GemColor.WHITE, GemColor.PURPLE, GemColor.ALL],
        // underwater
        [GemColor.LIGHT_BLUE, GemColor.PURPLE, GemColor.WHITE, GemColor.PINK, GemColor.ALL],
        // desert
        [GemColor.YELLOW, GemColor.GREEN, GemColor.PINK, GemColor.WHITE, GemColor.ALL],
        // forest
        [GemColor.GREEN, GemColor.BLACK, GemColor.YELLOW, GemColor.PINK, GemColor.ALL],
        // beach / islands
        [GemColor.BLUE, GemColor.YELLOW, GemColor.RED, GemColor.GREEN, GemColor.ALL],
        // scary
    [GemColor.BLACK, GemColor.LIGHT_BLUE, GemColor.WHITE, GemColor.BLUE, GemColor.ALL]
    ],
    [ // index 1 -> Tritanopia  // can swap red/pink
        [GemColor.WHITE, GemColor.BLACK, GemColor.RED, GemColor.LIGHT_BLUE, GemColor.ALL],
        [GemColor.LIGHT_BLUE, GemColor.BLACK, GemColor.RED, GemColor.WHITE, GemColor.ALL],
        [GemColor.LIGHT_BLUE, GemColor.RED, GemColor.BLACK, GemColor.WHITE, GemColor.ALL],
        [GemColor.BLACK, GemColor.WHITE, GemColor.RED, GemColor.LIGHT_BLUE, GemColor.ALL],
        [GemColor.PINK, GemColor.WHITE, GemColor.BLACK, GemColor.LIGHT_BLUE, GemColor.ALL],
        [GemColor.LIGHT_BLUE, GemColor.PINK, GemColor.BLACK, GemColor.WHITE, GemColor.ALL]
    ],
    [ // index 2 -> Tritanomaly  //can swap yellow/white
        [GemColor.WHITE, GemColor.BLACK, GemColor.RED, GemColor.LIGHT_BLUE, GemColor.ALL],
        [GemColor.LIGHT_BLUE, GemColor.RED, GemColor.BLACK, GemColor.YELLOW, GemColor.ALL],
        [GemColor.LIGHT_BLUE, GemColor.RED, GemColor.BLACK, GemColor.WHITE, GemColor.ALL],
        [GemColor.BLACK, GemColor.WHITE, GemColor.RED, GemColor.LIGHT_BLUE, GemColor.ALL],
        [GemColor.RED, GemColor.YELLOW, GemColor.BLACK, GemColor.LIGHT_BLUE, GemColor.ALL],
        [GemColor.LIGHT_BLUE, GemColor.RED, GemColor.BLACK, GemColor.WHITE, GemColor.ALL]
    ],
    [ // index 3 -> red green
        [GemColor.BLUE, GemColor.WHITE, GemColor.RED, GemColor.BLACK, GemColor.ALL],
        [GemColor.BLUE, GemColor.RED, GemColor.WHITE, GemColor.BLACK, GemColor.ALL],
        [GemColor.BLUE, GemColor.WHITE, GemColor.RED, GemColor.BLACK, GemColor.ALL],
        [GemColor.BLACK, GemColor.WHITE, GemColor.RED, GemColor.BLUE, GemColor.ALL],
        [GemColor.BLACK, GemColor.RED, GemColor.WHITE, GemColor.BLUE, GemColor.ALL],
        [GemColor.BLACK, GemColor.WHITE, GemColor.RED, GemColor.BLUE, GemColor.ALL]
    ],
    [ // index 4 -> monochrome
        [GemColor.BLACK, GemColor.MONO_WHITE, GemColor.WHITE, GemColor.LIGHT_GREY, GemColor.ALL],
        [GemColor.BLACK, GemColor.MONO_WHITE, GemColor.WHITE, GemColor.LIGHT_GREY, GemColor.ALL],
        [GemColor.BLACK, GemColor.MONO_WHITE, GemColor.WHITE, GemColor.LIGHT_GREY, GemColor.ALL],
        [GemColor.BLACK, GemColor.MONO_WHITE, GemColor.WHITE, GemColor.LIGHT_GREY, GemColor.ALL],
        [GemColor.BLACK, GemColor.MONO_WHITE, GemColor.WHITE, GemColor.LIGHT_GREY, GemColor.ALL],
        [GemColor.BLACK, GemColor.MONO_WHITE, GemColor.WHITE, GemColor.LIGHT_GREY, GemColor.ALL]
    ]
]