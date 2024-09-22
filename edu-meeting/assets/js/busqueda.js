document.getElementById('searchButton').addEventListener('click', function(event) {
  event.preventDefault(); // Evitar que el formulario se envíe automáticamente

  let pokemonInput = document.getElementById('pokemonInput');
  let pokemonNameOrId = pokemonInput.value.toLowerCase(); // Tomar el valor del input
  
  // Verificar si el campo de búsqueda está vacío
  if (!pokemonNameOrId) {
      mostrarError('Por favor, ingresa un nombre o ID de Pokémon.');
      return;
  }

  let apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`;

  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Pokémon no encontrado');
          }
          return response.json(); // Parsear la respuesta JSON
      })
      .then(data => {
          mostrarPokemon(data); // Función para mostrar los datos del Pokémon en el HTML
      })
      .catch(error => {
          console.error('Error:', error);
          mostrarError(error.message); // Mostrar el error en caso de que no se encuentre el Pokémon
      });
});

function mostrarPokemon(pokemon) {
  const pokemonResultDiv = document.getElementById('tarjeta');
  
  // Obtener tipos y habilidades del Pokémon
  let tipos = pokemon.types;
  let tipoFinal = tipos.map(tipo => tipo.type.name).join(', ');

  let habilidades = pokemon.abilities;
  let habilidadesFinal = habilidades.map(habilidad => habilidad.ability.name).join(', ');

  // Limpiar contenido anterior
  pokemonResultDiv.innerHTML = '';

  // Crear contenido con los datos del Pokémon
  let html = `
      <div class="col-lg-3">
            <div class="meeting-item">
              <div class="thumb">
                <div class="price">
                  <span>${tipoFinal.toUpperCase()}</span>
                </div>
                <a class="cartica" href="meeting-details.html">
                  <img src="${pokemon.sprites.versions['generation-v']['black-white'].animated.front_default}" alt="${pokemon.name}"
                  style="width: 100px; height: 100px;">
                </a>
              </div>
              <div class="down-content">
                <div class="date">
                  <h6>XP<span>${pokemon.base_experience}</span></h6>
                </div>
                <a href="meeting-details.html"><h4>${pokemon.name.toUpperCase()}</h4></a>
                <h6>Habilidades:</h6>
                <p>${habilidadesFinal.toUpperCase()}</p>
              </div>
            </div>
      </div>
  `;

  // Insertar el HTML generado en el div de resultados
  pokemonResultDiv.innerHTML = html;

  // Reiniciar el campo de búsqueda después de mostrar los resultados
  document.getElementById('pokemonInput').value = '';
}

function mostrarError(message) {
  const pokemonResultDiv = document.getElementById('tarjeta');
  pokemonResultDiv.innerHTML = `<p class="error" style="color:red;">${message}</p>`;
}

document.getElementById('pokemonInput').addEventListener('keyup', function(event) {
  let query = event.target.value.toLowerCase(); // Obtener el texto del input en minúsculas

  // Si la búsqueda tiene menos de 2 caracteres, no hacer nada
  if (query.length < 2) {
    document.getElementById('suggestions').innerHTML = ''; // Limpiar las sugerencias si el texto es muy corto
    return;
  }

  // Hacer la búsqueda de sugerencias con la API de especies de Pokémon
  let apiUrl = `https://pokeapi.co/api/v2/pokemon-species/?limit=1000`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Filtrar los Pokémon que coinciden con la búsqueda
      let matches = data.results.filter(pokemon => pokemon.name.includes(query));

      // Limpiar las sugerencias anteriores
      const suggestionsDiv = document.getElementById('suggestions');
      suggestionsDiv.innerHTML = '';

      // Mostrar las sugerencias filtradas
      matches.forEach(pokemon => {
        let suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = pokemon.name;
        
        // Evento para seleccionar el Pokémon sugerido
        suggestionItem.addEventListener('click', function() {
          document.getElementById('pokemonInput').value = pokemon.name;
          suggestionsDiv.innerHTML = ''; // Limpiar las sugerencias
          buscarPokemon(pokemon.name); // Llamar a la función para buscar el Pokémon
        });

        suggestionsDiv.appendChild(suggestionItem);
      });
    })
    .catch(error => {
      console.error('Error al obtener especies:', error);
    });
});

// Función para buscar el Pokémon al hacer clic en la sugerencia
function buscarPokemon(pokemonNameOrId) {
  let apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`;

  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Pokémon no encontrado');
          }
          return response.json(); // Parsear la respuesta JSON
      })
      .then(data => {
          mostrarPokemon(data); // Función para mostrar los datos del Pokémon en el HTML
      })
      .catch(error => {
          console.error('Error:', error);
          mostrarError(error.message); // Mostrar el error en caso de que no se encuentre el Pokémon
      });
}
