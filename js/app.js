const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

cargarEventListener();
function cargarEventListener() {
  // Cuando agregas un curso presionando "Agregar al carrito".
  listaCursos.addEventListener('click', agregarCurso);
  // Elimina cursos del carrito
  carrito.addEventListener('click', eliminarCurso);

  // Muestra los cursos del localStorage
  document.addEventListener('DOMContentLoaded', () => {
    articulosCarrito = JSON.parse( localStorage.getItem('carrito') ) || [];

    carritoHTML();
  })


  // Vaciar carrito
  vaciarCarritoBtn.addEventListener('click', () => {
    articulosCarrito = [];

    limpiarHTMl();
  });
}

// Funciones
function agregarCurso(e) {
  e.preventDefault();

  if(e.target.classList.contains('agregar-carrito')) {
    const cursoSeleccionado = e.target.parentElement.parentElement;
    leerDatosCurso(cursoSeleccionado);
  }
}

function eliminarCurso(e) {
  if( e.target.classList.contains('borrar-curso') ) {
    const cursoId = e.target.getAttribute('data-id');

    // ELimina del arreglo de articulosCarrio por el data-id
    articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId );
    
    console.log(articulosCarrito);
    
    carritoHTML();
  }

}

// Lee en contenido del HTML al que le dimos click y extrae la información del curso.
function leerDatosCurso ( curso ) {
  // Creando funcón con la información del curso
  const infoCurso = {
    img: curso.querySelector('img').src,
    titulo: curso.querySelector('h4').textContent,
    precio: curso.querySelector('.precio span').textContent,
    id: curso.querySelector('a').getAttribute('data-id'),
    cantidad: 1
  }

  // Revisa si un elemento existe en el carrito
  const existe = articulosCarrito.some( curso => curso.id === infoCurso.id ); 
  
  if( existe ) {
    // Actualizamos la cantidad
    const cursos = articulosCarrito.map( curso => {
      if( curso.id === infoCurso.id ) {
        curso.cantidad++;
        return curso; // Retorna el objeto actualizado
      } else {
        return curso; // Retorna los objetos que no son los duplicados
      }
    });
    articulosCarrito = [...cursos];
  } else {
    // Agrega elementos al carrito
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  carritoHTML();
}


// Muestra el carrito de copras en el HTML
function carritoHTML() {
  // Limpia el HTMl
  limpiarHTMl();

  // Recorre el carrito y crea el HTMl
  articulosCarrito.forEach( curso => {
    const { img, titulo, precio, cantidad, id } = curso;
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>
        <img src="${ img }" alt="${ titulo }" width="100">
      </td>
      <td>${ titulo }</td>
      <td>${ precio }</td>
      <td>${ cantidad }</td>
      <td>
        <a href="#" class="borrar-curso" data-id="${ id }"> X </>
      </td>
    `;

    //Agrega el HTMl del carrito enel tbody
    contenedorCarrito.appendChild(row);
  })

  // Agregar el carrito de compras al Storage
  sincronizarStorage();
}

function sincronizarStorage() {
  localStorage.setItem('carrito', JSON.stringify(articulosCarrito))
}

function limpiarHTMl () {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}
