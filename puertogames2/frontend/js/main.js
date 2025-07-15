console.log("main.js SE CARGO BIEN");


//guardar jueguillos
const API = 'http://localhost:8080/api/videojuegos';

const form = document.getElementById('form');
const lista = document.getElementById('lista');



//grafico x genero
fetch(API)
  .then(res => res.json())
    .then(data => {
       console.log("Datitos:", data);
    });


//Declarar cada id del HTML y almacenarlo en una variable

const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const loader = document.getElementById('loader');
const results = document.getElementById('results');

const API_KEY = '5c9b0cea670f41499bf38f1eaded59cf';

searchBtn.addEventListener('click', ()=>{
  const query = searchInput.value.trim();
  if(query!==''){
    buscarJuegos(query);
  }
});

function buscarJuegos(nombreJuego){
  //mostrar Loader
  loader.classList.remove('hidden');
  results.innerHTML= '';
  //consulta a la API
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(nombreJuego)}`;

  //Fetch permita hacer consultas http GET
  //verifica si la respuesta es correcta y conviete JSON
  fetch(url)
  .then(response=>{
    if(!response.ok) throw new Error('No se pudo conectar a la API');
    return response.json();
  })

  //exito
  .then(data =>{
    mostrarResultados(data.results);
  })

  //validando si algo salio mal

  .catch(error=>{
    results.innerHTML = `<p class="text-red-600">Error: ${error.message}</p>`;
  })

  .finally(()=>{
    loader.classList.add('hidden');
  });
}



function mostrarResultados(juegos){
  if(juegos.length===0){
    results.innerHTML = `<p class="text-red-600">No se encontraron juegos</p>`;
    return
  }

  juegos.forEach(juego=>{
    const div = document.createElement('div');
    div.className ='bg-white rounded shadow p-4';
    div.innerHTML = `
    <img src="${juego.background_image}" alt="${juego.name}" class="w-full h-48 object-cover rounded mb-2">
    <h2 class="text-lg text-gray-600">⭐⭐Rating: ${juego.rating}</h2>
    <p class="text-sm text-gray-600">Lanzamiento: ${juego.relased || 'No hay fecha'}</p>`;
    results.appendChild(div);

  });

}

//AGREGUE TOASTIFY

    form.addEventListener('submit', async (e) =>{
        e.preventDefault();
        const vj = {
            titulo: form.titulo.value,
            genero: form.genero.value,
            plataforma: form.plataforma.value,
            precio: parseFloat(form.precio.value),
            stock: parseInt(form.stock.value)
        };
        try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(vj)
    });
    if (!res.ok) throw new Error('Error al agregar el juego');
    Toastify({
      text: "¡Juego agregado con éxito!",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #4caf50, #388e3c)",
    }).showToast();
    form.reset();
    cargar();
  } catch (error) {
    Toastify({
      text: "Error: " + error.message,
      duration: 4000,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #f44336, #d32f2f)",
    }).showToast();
  }
});

