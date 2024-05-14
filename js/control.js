// pongo todos los status en false.
// luego solo habilito los divs adyacentes al div vacio.
function update_status() {
    disable_blocks()

    // habilito los divs adyacentes al div vacio.
    if (!first_row_index.includes(emptyBlock)) {
        check_block_position(emptyBlock - 1).status = true
    }

    if (!last_row_index.includes(emptyBlock)) {
        check_block_position(emptyBlock + 1).status = true
    }
    check_block_position(emptyBlock - puzzle_size).status = true
    check_block_position(emptyBlock + puzzle_size).status = true

    // devuelve el bloque que se encuentra en la posision solicitada.
    function check_block_position(position) {
        objArray.forEach(item => {
            if (item.position == position) {
                obj = item
                return
            }
        })
        return obj
    }
}
//------------------------------------------------------------------------------------------------------------------------


// al clickear un bloque, se gestiona el cambio de posicion entre el bloque clickeado y el lugar vacio.
function move(div, check_Win = true) {
    let bloque_tocado = window['div' + div].position
    let emptyBlock = window['div' + cant_bloques].position

    if (window['div' + div].status) {
        window['div' + cant_bloques].position = bloque_tocado
        window['div' + div].position = emptyBlock

        window['div' + cant_bloques].Move()
        window['div' + div].Move()
        update_status()
        if (check_Win) { checkWin() }
    }
}
//------------------------------------------------------------------------------------------------------------------------

// verificacion si el puzzle esta resuelto.
function checkWin() {
    for (var i = 1; i < cant_bloques; i++) {
        if (window['div' + i].position == i) {
            if (i == (cant_bloques - 1)) {
                console.log('GAME COMPLETE!')
                checkWin.win = true
                var audio = new Audio(SOUND_WIN);
                audio.play();
                disable_blocks()
                num = false // reset de la variable.
                document.getElementById('btnHelp').style.display = 'none' // oculto el boton HELP.
                window['div' + emptyBlock].bloque.style.display = 'block'
            } else { continue }
        } else { break }
    }
}
//------------------------------------------------------------------------------------------------------------------------


// reset total elimina los divs y reseteo las variables.
function reset() {
    if (ref_div_main.children.length != 0) {
        for (let i = 0; i < (cant_bloques); i++) {
            ref_div_main.children[0].remove()
        }
    }
    blocksPositions = {}
    objArray = []
    first_row_index = []
    last_row_index = []
    ref_div_main.style.display = 'none'
}
//------------------------------------------------------------------------------------------------------------------------

// deshabilita todos los bloques.
function disable_blocks() {
    emptyBlock = window['div' + cant_bloques].position
    objArray.forEach(function (item, key) {
        item.status = false
    });
}
//------------------------------------------------------------------------------------------------------------------------


// slide para las imagenes de los puzzles.
function slide(direction) {

    // detecto la imagen que esta al frente.
    get_active_image()

    if (direction == 'left') { // slide left.
        switch (image) {
            case 1:
                ref_image_1.className = ('image-left')
                ref_image_2.className = ('image-right')
                ref_image_3.className = ('image-top')
                break

            case 2:
                ref_image_1.className = ('image-top')
                ref_image_2.className = ('image-left')
                ref_image_3.className = ('image-right')
                break

            case 3:
                ref_image_1.className = ('image-right')
                ref_image_2.className = ('image-top')
                ref_image_3.className = ('image-left')
                break
        }
    } else { // slide right.
        switch (image) {
            case 1:
                ref_image_1.className = ('image-right')
                ref_image_2.className = ('image-top')
                ref_image_3.className = ('image-left')
                break

            case 2:
                ref_image_1.className = ('image-left')
                ref_image_2.className = ('image-right')
                ref_image_3.className = ('image-top')
                break

            case 3:
                ref_image_1.className = ('image-top')
                ref_image_2.className = ('image-left')
                ref_image_3.className = ('image-right')
                break
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------

// obtengo la imagen en primer plano.
function get_active_image() {
    // detecto la imagen que esta al frente.
    if (getComputedStyle(ref_image_1).zIndex == 1) { image = 1; return ref_image_1.src }
    if (getComputedStyle(ref_image_2).zIndex == 1) { image = 2; return ref_image_2.src }
    if (getComputedStyle(ref_image_3).zIndex == 1) { image = 3; return ref_image_3.src }
}
//------------------------------------------------------------------------------------------------------------------------


// oculta las imagenes de los puzzles.
function hide_puzzles(hide) {
    hide ? display = 'none' : display = 'block'
    ref_image_1.style.display = display
    ref_image_2.style.display = display
    ref_image_3.style.display = display
    ref_left_arrow.style.display = display
    ref_right_arrow.style.display = display
    ref_puzzles.style.display = display
}