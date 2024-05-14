// desordena los bloques xTimes de veces. Partiendo de un inicio ordenado.
let num
let bloquesActivos = []

function scramble(xTimes) {
    do {
        console.log('scramble')
        for (var i = 0; i < xTimes; i++) {
            pushActiveBlocks()              // pusheo en el array las posisiones de los bloques con status true.
            random(bloquesActivos.length)  // muevo alguno(random) de los bloques(con status true).
        }
    } while (window['div' + cant_bloques].position != cant_bloques)  // se repite el scramble hasta que el bloque vacio caiga en la ultima posicion.
}
//------------------------------------------------------------------------------------------------------------------------


// pusheo en el array las posisiones de los bloques con status true.
function pushActiveBlocks() {
    let exclude_block = bloquesActivos[num] // guardo el ultimo bloque movido para que no se mueva dos veces seguidas el mismo.
    bloquesActivos = [null]
    for (var i = 1; i < (cant_bloques + 1); i++) {
        if (window['div' + i].status) {
            if (i == exclude_block) { continue } // continue cuando se llega al bloque movido anteriormente.
            bloquesActivos.push(i)
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------


// genero un numero random entre 0 y max la cant. de items en el array de bloques activos.
// que serian los bloques con status true y son los que estan habilitados para moverse.
// y luego mueve al bloque elegido.
function random(arraySize) {
    do { num = Math.round(Math.random() * (arraySize - 1)) } // (x-1) para descartar del .length al primer elemento del array que es un null.
    while (num == 0) // para evitar el cero.
    move(bloquesActivos[num], false) // false es para que no se ejecute el checkwin() ya que no quiero saber si gane xq estoy haciendo el scramble.
}
