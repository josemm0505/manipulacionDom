
const getPokemon = async (offset = 0, limit = 10) => {
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

const setPokemonAleatorioDOM = (AleatorioPokemon) => {
    let $divAleatorio = document.querySelector('.owl-carousel');
    $($divAleatorio).trigger('destroy.owl.carousel');
    let html = '';
    $divAleatorio.innerHTML = html;


    for (let i = 0; i < AleatorioPokemon.results.length; i++) {
        let habilidades=AleatorioPokemon.results[i].data.abilities;
        let habilidadesFinal=habilidades.map(habilidad => habilidad.ability.name).join(' , ');
        let movimientos=AleatorioPokemon.results[i].data.moves;
        let movimientosFinal=movimientos.map(movimiento => movimiento.move.name).join(', ');
        html = html + `
                <div class="item" style="height: 300px">
              <div class="icon">
                <img src="${AleatorioPokemon.results[i].data.sprites.front_default}" alt="" style="width: 100px; height: 100px;" class="d-block mx-auto">
              </div>
              <div class="down-content">
                <h4>${AleatorioPokemon.results[i].name.toUpperCase()}</h4>
                <p>Experiencia Base: ${AleatorioPokemon.results[i].data.base_experience}</p>
                <p>Habilidades: ${habilidadesFinal.toUpperCase()} </p>
              </div>
            </div>
        `;
    }
    $divAleatorio.innerHTML = html;
    $($divAleatorio).owlCarousel({

    });

};

window.addEventListener('load', async function () {

    const waitForElement = async () => {
        const $divAleatorio = document.querySelector('.aleatorio');
        if ($divAleatorio) {
            let min = 1;
            let max = 1292;
            let aleatorio = Math.floor(Math.random() * (max - min)) + min;
            let AleatorioPokemon = await getPokemon(aleatorio, 10);
            setPokemonAleatorioDOM(AleatorioPokemon);
        } else {
            setTimeout(waitForElement, 100);
        }
    }
    waitForElement();
});

