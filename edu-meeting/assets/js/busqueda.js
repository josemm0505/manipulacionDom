document.getElementById('searchButton').addEventListener('click', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente

    let pokemonNameOrId = document.getElementById('pokemonInput').value.toLowerCase(); // Tomar el valor del input
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
                  <a class="cartica" href="meeting-details.html"><img src="${pokemon.sprites.versions['generation-v']['black-white'].animated.front_default}" alt="${pokemon.name}"></a>
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
}

function mostrarError(message) {
    const pokemonResultDiv = document.getElementById('tarjeta');
    pokemonResultDiv.innerHTML = `<p class="error">${message}</p>`;
}
