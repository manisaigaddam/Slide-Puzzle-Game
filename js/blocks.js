function start(show) {

    // guardo los indices de las columnas.
    for (let i = 1, x = 1; i < (puzzle_size * 2); i++ , x += puzzle_size) {
        if (i <= puzzle_size) {
            last_row_index.push(puzzle_size * i)
        }
        if (x <= cant_bloques) {
            first_row_index.push(x)
        }
    }
    //---------------------------------------------------------------------------------------------------------------------

    // atributos dinamicos del div principal.
    ref_div_main.style.width = image_size + 'px'
    ref_div_main.style.height = image_size + 'px'
    //---------------------------------------------------------------------------------------------------------------------

    // creo los divs (bloques)
    for (let i = 1; i < (cant_bloques + 1); i++) {
        window['div_' + i] = document.createElement('div')
        window['div_' + i].id = i
        window['div_' + i].className = 'bloque'
        window['div_' + i].style.width = image_size / puzzle_size + 'px'
        window['div_' + i].style.height = image_size / puzzle_size + 'px'
        window['div_' + i].style.backgroundImage = IMAGE
        window['div_' + i].style.backgroundSize = image_size + 'px'
        ref_div_main.appendChild(window['div_' + i])
    }
    //---------------------------------------------------------------------------------------------------------------------

    // posisiono los divs en orden
    for (let a = 0, b = 1; a < puzzle_size; a++ , b++) {
        for (let i = (puzzle_size * a), x = 0; i < (puzzle_size * b); i++ , x++) {
            let top = image_size / puzzle_size * a * 1
            let left = image_size / puzzle_size * x * 1
            push_into_object(top, left)
        }
    }
    //---------------------------------------------------------------------------------------------------------------------

    // agrego y posisiono la imagen a los divs
    for (let a = 0, b = 1; a < puzzle_size; a++ , b++) {
        for (let i = (puzzle_size * a), x = 0; i < (puzzle_size * b); i++ , x++) {
            ref_div_main.children[i].style.backgroundPositionX = image_size / puzzle_size * x * -1 + 'px'
            ref_div_main.children[i].style.backgroundPositionY = image_size / puzzle_size * a * -1 + 'px'
        }
    }
    //---------------------------------------------------------------------------------------------------------------------
    
    // pusheo dentro del obj las posiciones de los bloques.
    function push_into_object(top, left) {
        if (typeof (i) === 'undefined') { i = 1 }
        blocksPositions[i] = { top: top, left: left }
        i++
    }
    //---------------------------------------------------------------------------------------------------------------------

    // constructor de bloque.
    function Bloque() {
        this.bloque = null,        // referencia al objeto.
            this.status = false,   // status true habilita el movimiento.
            this.position = null,  // indica la posicion de los bloques.
            // posiciona el bloque en el lugar correspondiente a position.
            this.Move = () => {
                this.bloque.style.top = blocksPositions[this.position].top + 'px'
                this.bloque.style.left = blocksPositions[this.position].left + 'px'
            }
    }
    //---------------------------------------------------------------------------------------------------------------------

    // creo los bloques.
    for (var i = 1; i < (cant_bloques + 1); i++) {
        window['div' + i] = new Bloque
        window['div' + i].bloque = document.getElementById(i)   // aplico un div a cada nuevo bloque.
        window['div' + i].position = i // aplico las posiciones por orden del primero al ultimo.
        objArray.push(window['div' + i])
    }
    //---------------------------------------------------------------------------------------------------------------------

    // oculto el ultimo bloque (bloque vacio).
    ref_div_main.children[cant_bloques - 1].style.display = 'none'
    //---------------------------------------------------------------------------------------------------------------------
    
    // agrego los addEventListener a los todos los bloques MENOS AL bloque vacio.
    for (var i = 1; i < cant_bloques; i++) {
        document.getElementById(i).addEventListener(down, function (e) {
            move(e.target.id)
        })
    }
    //---------------------------------------------------------------------------------------------------------------------

    // coloca los bloques en sus posiciones iniciales.
    function init() {
        for (var i = 1; i < (cant_bloques + 1); i++) {
            window['div' + i].Move()
        }
        // actualizar los status
        update_status(window['div' + objArray.length].position)
    }
    //---------------------------------------------------------------------------------------------------------------------

    init()
    if (show) {
        disable_blocks()
        document.getElementById('btnHelp').style.display = 'none' // oculto el boton HELP.
        window['div' + cant_bloques].bloque.style.display = 'block'
    } else {
        document.getElementById('btnHelp').style.display = 'block' // muestro el boton HELP.
    }
}
