// oír los cambios en la caja de texto e ir dando formato al RUT
document.addEventListener('input', e => {
  const rut = document.querySelector('#rut')

  if (e.target === rut) {
    const rutFormateado = darFormatoRUT(rut.value)
    rut.value = rutFormateado
  }
})

// dar formato XX.XXX.XXX-X
function darFormatoRUT(rut) {
  // dejar solo números y letras 'k'
  const rutLimpio = rut.replace(/[^0-9kK]/g, '')

  if (rutLimpio.length < 2) return rutLimpio

  // aislar el cuerpo del dígito verificador
  const cuerpo = rutLimpio.slice(0, -1)
  const dv = rutLimpio.slice(-1).toUpperCase()

  // colocar los separadores de miles al cuerpo
  let cuerpoFormatoMiles = cuerpo
    .toString()
    .split('')
    .reverse()
    .join('')
    .replace(/(?=\d*\.?)(\d{3})/g, '$1.')

  cuerpoFormatoMiles = cuerpoFormatoMiles
    .split('')
    .reverse()
    .join('')
    .replace(/^[\.]/, '')

  return `${cuerpoFormatoMiles}-${dv}`
}

// si presiona ENTER ejecutar la validación
document.addEventListener('keypress', e => {
  if (e.key === 'Enter') ejecutarValidacion()
})

// oír el clic y si presiona el botón 'Validar RUT' ejecutar la validación
document.addEventListener('click', e => {
  const botonValidarRUT = document.getElementById('btn-valida-rut')

  if (e.target === botonValidarRUT) {
    ejecutarValidacion()
  }
})

function ejecutarValidacion() {
  const rut = document.getElementById('rut').value
  const resultado = validarRUT(rut)
  const salida = document.querySelector('.salida')

  if (!rut) {
    salida.innerHTML = `<p style="color: red;">Debes ingresar un RUT</p>`
  } else if (resultado === true) {
    salida.innerHTML = `<p style="color: darkgreen;">El RUT ${rut} es válido</p>`
  } else {
    salida.innerHTML = `<p style="color: red;">El RUT ${rut} no es válido</p>`
  }

  document.querySelector('#rut').value = ''
}

function validarRUT(rut) {
  // dejar solo números y letras 'k'
  const rutLimpio = rut.replace(/[^0-9kK]/g, '')

  // verificar que ingrese al menos 2 caracteres válidos
  if (rutLimpio.length < 2) return false

  // aislar el cuerpo del dígito verificador
  const cuerpo = rutLimpio.slice(0, -1)
  const dv = rutLimpio.slice(-1).toUpperCase()

  // validar que el cuerpo sea numérico
  if (!cuerpo.replace(/[^0-9]/g, '')) return false

  // calcular el DV asociado al cuerpo del RUT
  const dvCalculado = calcularDV(cuerpo)

  // comparar el DV del RUT recibido con el DV calculado
  return dvCalculado == dv
}

function calcularDV(cuerpoRUT) {
  const serie = [2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7]
  const RUT = cuerpoRUT.split('').reverse()

  const sumaProducto = RUT.reduce(
    (suma, valor, indice) => suma + valor * serie[indice],
    0
  )

  const dv = 11 - (sumaProducto % 11)

  return dv === 10 ? 'K' : dv === 11 ? 0 : dv
}
