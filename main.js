// oír los cambios en la caja de texto e ir dando formato al RUT
document.addEventListener('input', (e) => {
  const rut = document.getElementById('rut');

  if (e.target === rut) {
    let rutFormateado = darFormatoRUT(rut.value);
    rut.value = rutFormateado;
  }
});

// dar formato XX.XXX.XXX-X
function darFormatoRUT(rut) {
  // dejar solo números y letras 'k'
  const rutLimpio = rut.replace(/[^0-9kK]/g, '');

  // asilar el cuerpo del dígito verificador
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toUpperCase();

  if (rutLimpio.length < 2) return rutLimpio;

  // colocar los separadores de miles al cuerpo
  let cuerpoFormatoMiles = cuerpo
    .toString()
    .split('')
    .reverse()
    .join('')
    .replace(/(?=\d*\.?)(\d{3})/g, '$1.');

  cuerpoFormatoMiles = cuerpoFormatoMiles
    .split('')
    .reverse()
    .join('')
    .replace(/^[\.]/, '');

  return `${cuerpoFormatoMiles}-${dv}`;
}

// si presiona ENTER ejecutar la validación
document.addEventListener('keypress', (e) => {
  if (e.KeyboardEvent.keyCode == 13) ejecutarValidacion();
});

// oír el clic y si presiona el botón 'Validar RUT' ejecutar la validación
document.addEventListener('click', (e) => {
  const botonValidarRUT = document.getElementById('btn-valida-rut');

  if (e.target === botonValidarRUT) {
    ejecutarValidacion();
  }
});

function ejecutarValidacion() {
  const rut = document.getElementById('rut').value;
  const resultado = validarRUT(rut);
  const salida = document.querySelector('.salida');

  if (!rut) {
    salida.innerHTML = `<p style="color: red;">Debes ingresar un RUT</p>`;
  } else if (resultado === true) {
    salida.innerHTML = `<p style="color: darkgreen;">El RUT ${rut} es válido</p>`;
  } else {
    salida.innerHTML = `<p style="color: red;">El RUT ${rut} no es válido</p>`;
  }

  document.getElementById('rut').value = '';
}

function validarRUT(rut) {
  // dejar solo números y letras 'k'
  const rutLimpio = rut.replace(/[^0-9kK]/g, '');

  // verificar que ingrese al menos 2 caracteres válidos
  if (rutLimpio.length < 2) return false;

  // asilar el cuerpo del dígito verificador
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toUpperCase();

  // validar que el cuerpo sea numérico
  if (!cuerpo.replace(/[^0-9]/g, '')) return false;

  // calcular el DV asociado al cuerpo del RUT
  const dvCalculado = calcularDV(cuerpo);

  // comparar el DV del RUT recibido con el DV calculado
  return dvCalculado == dv;
}

function calcularDV(cuerpoRUT) {
  let suma = 1;
  let multiplo = 0;

  for (; cuerpoRUT; cuerpoRUT = Math.floor(cuerpoRUT / 10))
    suma = (suma + (cuerpoRUT % 10) * (9 - (multiplo++ % 6))) % 11;

  return suma ? suma - 1 : 'K';
}
