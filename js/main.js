// registro el sw.
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/PWA-Slide-Puzzle/sw.js')
        .then(function (reg) {
            console.log('Service Worker registrado Exitósamente', reg);
        })
        .catch(function (err) {
            console.log('Error registrando el Service Worker', err);
        });
}
//---------------------------------------------------------------------------------------------------------------------

let IMAGE = 'url(css/images/dog.jpg)'
const SOUND_WIN = 'css/sounds/clap.mp3'
const COLOR_ENABLED = '#FF9900'
const COLOR_DISABLED = 'gray'
let puzzle_size = 3

let cant_bloques = puzzle_size * puzzle_size
let device_width

let blocksPositions = {} // obj para almacenar las posisiones de los bloques.
let objArray = [] // un array con todos los bloques para usar en la funcion update_status()
let last_row_index = []
let first_row_index = []

// referencias a elementos.
let ref_div_main = document.getElementById('main')
let ref_puzzles = document.getElementById('puzzles')
let ref_level_size_3 = document.getElementById('level_size_3')
let ref_level_size_4 = document.getElementById('level_size_4')
let ref_level_size_5 = document.getElementById('level_size_5')
let ref_level_size_6 = document.getElementById('level_size_6')

let ref_image_1 = document.getElementById('image1')
let ref_image_2 = document.getElementById('image2')
let ref_image_3 = document.getElementById('image3')
let ref_left_arrow = document.getElementById('left_arrow')
let ref_right_arrow = document.getElementById('right_arrow')
//---------------------------------------------------------------------------------------------------------------------

// el tamaño de la imagen es el tamaño de pantalla.
device_width = window.innerWidth
if (window.screen.orientation.angle == 0) {
    if (device_width >= 1280 && device_width <= 1920) { image_size = device_width * 0.4 }
    if (device_width >= 1024 && device_width <= 1279) { image_size = device_width * 0.9 }
    if (device_width >= 800 && device_width <= 1023) { image_size = device_width * 0.7 }
    if (device_width >= 360 && device_width <= 799) { image_size = device_width }
    if (device_width >= 320 && device_width <= 359) { image_size = device_width }
} else {
    if (device_width >= 1280 && device_width <= 1920) { image_size = device_width * 0.6 }
    if (device_width >= 1024 && device_width <= 1279) { image_size = device_width * 0.6 }
    if (device_width >= 800 && device_width <= 1023) { image_size = device_width * 0.7 }
    if (device_width >= 360 && device_width <= 799) { image_size = device_width * 0.5 }
    if (device_width >= 320 && device_width <= 359) { image_size = device_width }
}
//---------------------------------------------------------------------------------------------------------------------

// mostrar imagen como ayuda.
function show_image(show) {
    if (show) {
        ref_div_main.style.backgroundImage = IMAGE
        ref_div_main.style.backgroundSize = 'cover'
        objArray.forEach(bloque => {
            bloque.bloque.style.display = 'none'
        })
    } else {
        ref_div_main.style.backgroundImage = ''
        objArray.forEach((bloque, key) => {
            if (key == cant_bloques - 1) {
                bloque.bloque.style.display = 'none'
                return
            }
            bloque.bloque.style.display = 'block'
        })
    }
}
//---------------------------------------------------------------------------------------------------------------------

// deteccion de dispositivo tactil.
let down = 'mousedown'
let up = 'mouseup'
function is_touch_enabled() {
    return ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);
}

// cambio el evento si es dispositivo tactil.
is_touch_enabled() ? down = 'touchstart' : down
is_touch_enabled() ? up = 'touchend' : up
//---------------------------------------------------------------------------------------------------------------------

// listeners.
ref_left_arrow.addEventListener(down, (e) => {
    slide('left')
},{passive: true})
ref_right_arrow.addEventListener(down, (e) => {
    slide('right')
},{passive: true})

// boton puzzles.
ref_puzzles.addEventListener(down, () => {
    reset()
    hide_puzzles(false)
    move_puzzle_option('up')
},{passive: true})

// boton New Game. // para que el SweetAlert no se cierre rapido, dejar los eventos en 'click' en vez de touchstar.
document.getElementById('btnNewGame').addEventListener('click', () => {
    pregunta(puzzle_size, true)
})

// boton Help.
document.getElementById('btnHelp').addEventListener(down, () => {
    show_image(true)
},{passive: true})
document.getElementById('btnHelp').addEventListener(up, () => {
    show_image(false)
},{passive: true})

// boton 3x3
document.getElementById('level_size_3').addEventListener('click', () => {
    pregunta(3)
})

// boton 4x4
document.getElementById('level_size_4').addEventListener('click', () => {
    pregunta(4)
})

// boton 5x5
document.getElementById('level_size_5').addEventListener('click', () => {
    pregunta(5)
})

// boton 6x6
document.getElementById('level_size_6').addEventListener('click', () => {
    pregunta(6)
})
//---------------------------------------------------------------------------------------------------------------------

// juego nuevo.
function new_game() {
    reset()
    ref_div_main.style.display = 'block'
    hide_puzzles(true)
    IMAGE = get_active_image()
    IMAGE = 'url(' + IMAGE.slice(IMAGE.indexOf('css')) + ')'
    start()
    setTimeout(() => {
        scramble(500)
    }, 0);
}
//---------------------------------------------------------------------------------------------------------------------

// seleccion de nivel.
function level(size) {
    dim_level_item(size)
    reset()
    ref_div_main.style.display = 'block'
    hide_puzzles(true)
    move_puzzle_option('down')
    IMAGE = get_active_image()
    IMAGE = 'url(' + IMAGE.slice(IMAGE.indexOf('css')) + ')'
    puzzle_size = size
    cant_bloques = puzzle_size * puzzle_size
    start('show') // show para que solo muestre la imagen, y no se creen los bloques y habiliten los movimientos.
}
//---------------------------------------------------------------------------------------------------------------------

// muevo de lugar la opcion puzzles.
function move_puzzle_option(position) {
    if (position == 'down') {
        ref_puzzles.style.display = 'block'
        ref_puzzles.classList.remove('puzzles')
        ref_puzzles.classList.add('puzzles-bottom')
    } else {
        ref_puzzles.classList.remove('puzzles-bottom')
        ref_puzzles.classList.add('puzzles')
    }
}
//---------------------------------------------------------------------------------------------------------------------

// dim level option
// cambia el color de los selectores de nivel, menos el clickeado.
function dim_level_item(level) {
    switch (level) {
        case 3:
            ref_level_size_3.style.background = COLOR_ENABLED
            ref_level_size_4.style.background = COLOR_DISABLED
            ref_level_size_5.style.background = COLOR_DISABLED
            ref_level_size_6.style.background = COLOR_DISABLED
            break
        case 4:
            ref_level_size_4.style.background = COLOR_ENABLED
            ref_level_size_3.style.background = COLOR_DISABLED
            ref_level_size_5.style.background = COLOR_DISABLED
            ref_level_size_6.style.background = COLOR_DISABLED
            break
        case 5:
            ref_level_size_5.style.background = COLOR_ENABLED
            ref_level_size_3.style.background = COLOR_DISABLED
            ref_level_size_4.style.background = COLOR_DISABLED
            ref_level_size_6.style.background = COLOR_DISABLED
            break
        case 6:
            ref_level_size_6.style.background = COLOR_ENABLED
            ref_level_size_3.style.background = COLOR_DISABLED
            ref_level_size_4.style.background = COLOR_DISABLED
            ref_level_size_5.style.background = COLOR_DISABLED
            break
    }
}
//---------------------------------------------------------------------------------------------------------------------

// SweetAlert2 pregunta.
function pregunta(size, newGame = false) {
    // num indica si se jugo previamente, ya que se genera en scramble().
    // si se jugo previamente, realizo la pregunta.
    if (num) {
        Swal.fire({
            title: 'Cancel game?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
        }).then((result) => {
            document.lastChild.classList.add('no-select')
            if (result.value) {
                hide_puzzles(false)
                move_puzzle_option('up')
                reset()
                num = false // reset de la variable.
                document.getElementById('btnHelp').style.display = 'none' // oculto el boton HELP.
            }
        })
    } else {
        document.lastChild.classList.add('no-select')
        if (newGame) {
            new_game()
            return
        }
        level(size)
    }
}


