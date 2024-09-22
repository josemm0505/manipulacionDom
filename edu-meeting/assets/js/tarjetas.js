const totalPokemon=1292;
const limite=12;
let offset=0;
let paginaActual=0;

//Funcion para obtener los pokemons
const getPokemonCard = async (offset = 0, limit = 12) => {
    let pokemons = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`);
    pokemons = await pokemons.json();
    if (pokemons.results) {
        for (let index = 0; index < pokemons.results.length; index++) {
            const pokedata = await fetch(pokemons.results[index].url);
            pokemons.results[index].data = await pokedata.json();
        }
        return pokemons;
    }
}

// Función para cargar y mostrar una página de Pokémon
const loadPage = async (page) => {
    offset = page * limite;
    paginaActual = page;
    const TarjetaPokemon = await getPokemonCard(offset, limite);
    setPokemonTarjetaDOM(TarjetaPokemon);
    updatePaginationButtons();
}

//Funcion para actualizar los botones
const updatePaginationButtons = () => {
    const prevButton = document.getElementById('anterior');
    const nextButton = document.getElementById('siguiente');

    // Habilita o deshabilita el botón "Anterior" según la página actual
    prevButton.classList.toggle('disabled', paginaActual === 0);

    // Habilita o deshabilita el botón "Siguiente" según la página actual
    nextButton.classList.toggle('disabled', (paginaActual + 1) * limite >= totalPokemon);
}
loadPage(0);

// Maneja el clic en el botón "Anterior"
document.getElementById('anterior').addEventListener('click', (event) => {
    event.preventDefault();
    if (paginaActual > 0) {
        loadPage(paginaActual - 1);
    }
});

// Maneja el clic en el botón "Siguiente"
document.getElementById('siguiente').addEventListener('click', (event) => {
    event.preventDefault();
    if ((paginaActual + 1) * limite < totalPokemon) {
        loadPage(paginaActual + 1);
    }
});

//Poner Tarjetas
const setPokemonTarjetaDOM = (TarjetaPokemon) => {
  let $divTarjeta = document.querySelector('.tarjeta');
  $divTarjeta.innerHTML = '';

  let html = '';

  for (let i = 0; i < TarjetaPokemon.results.length; i++) {
      let habilidades = TarjetaPokemon.results[i].data.abilities;
      let habilidadesFinal = habilidades.map(habilidad => habilidad.ability.name).join(', ');
      let movimientos = TarjetaPokemon.results[i].data.moves;
      let movimientosFinal = movimientos.map(movimiento => movimiento.move.name).join(', ');
      let tipo = TarjetaPokemon.results[i].data.types;
      let tipoFinal = tipo.map(tipo => tipo.type.name).join(', ');

      // Generar HTML para cada tarjeta de Pokémon
      html += `
          <div class="col-lg-3">
            <div class="meeting-item">
              <div class="thumb">
                <div class="price">
                  <span>${tipoFinal.toUpperCase()}</span>
                </div>
                <a class="cartica" href="meeting-details.html">
                  <img 
                    id="pokemon-img-${i}" 
                    src="${TarjetaPokemon.results[i].data.sprites.versions['generation-v']['black-white'].animated.front_default}" 
                    alt="${TarjetaPokemon.results[i].name}" 
                    class="img-pokemon"
                    style="width: 100px; height: 100px;"
                    >
                </a>
              </div>
              <div class="down-content">
                <div class="date">
                  <h6>XP<span>${TarjetaPokemon.results[i].data.base_experience}</span></h6>
                </div>
                <a href="meeting-details.html"><h4>${TarjetaPokemon.results[i].name.toUpperCase()}</h4></a>
                <h6>Habilidades:</h6>
                <p>${habilidadesFinal.toUpperCase()}</p>
              </div>
            </div>
          </div>
      `;
  }

  // Insertar el HTML generado
  $divTarjeta.innerHTML = html;

  // Agregar eventos de mouseover y mouseout para cambiar la imagen
  for (let i = 0; i < TarjetaPokemon.results.length; i++) {
      const pokemonImage = document.getElementById(`pokemon-img-${i}`);
      const defaultImage = TarjetaPokemon.results[i].data.sprites.versions['generation-v']['black-white'].animated.front_default;
      const hoverImage = TarjetaPokemon.results[i].data.sprites.versions['generation-v']['black-white'].animated.front_shiny;

      // Evento para cambiar la imagen cuando el mouse está sobre la imagen
      pokemonImage.addEventListener('mouseover', () => {
          if (hoverImage) {
              pokemonImage.src = hoverImage;
          }
      });

      // Evento para restaurar la imagen cuando el mouse sale
      pokemonImage.addEventListener('mouseout', () => {
          pokemonImage.src = defaultImage;
      });
  }
};
