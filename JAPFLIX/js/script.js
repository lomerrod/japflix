const URL = "https://japceibal.github.io/japflix_api/movies-data.json";

console.log(URL)

let currentMoviesArray = [];

let container = document.getElementById("lista");

let getJSONData = function(url){
    let result = {};
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        return result;
    });
}

function showMoviesList(moviesArray) {
    
    container.innerHTML = ''

    for (let i = 0; i < moviesArray.length; i++) {
        const movie = moviesArray[i]; // peli individual
        
        let card = document.createElement('div');
            
        card.classList.add('text-bg-dark', 'text-light', 'mb-3', 'border', 'border-secondary', 'rounded');
        card.setAttribute('data-id', movie.id); // id de la peli
        card.setAttribute('id', 'card-movie');

        // atributo para el offcanva
        card.setAttribute('data-bs-toggle', 'offcanvas');
        card.setAttribute('data-bs-target', '#offcanvasTop');
        card.setAttribute('aria-controls', 'offcanvasTop');

        card.innerHTML = `
            <div class="card-body" id="${movie.id}">
                <div class="row justify-content-between">
                    <div class="col-4">
                        <h5 class="card-title"><strong>${movie.title}</strong></h5>
                        <cite class ="tagline" title="tagline">${movie.tagline}</cite>
                    </div>
                    <div class="col-4 d-flex justify-content-end">
                        <div class="stars">${showStarRating(movie.vote_average)}</div>                    
                    </div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => moreDetails(movie))

        container.appendChild(card); // se agrega al container la card

    }
}

function showStarRating(voteAverage) {

    const stars = Math.round(voteAverage / 2); // divide entre 2 porque las estrellas son de 0 a 10 y redondea
    let starHTML = '';

    for (let i = 1; i <= 5; i++) {
        if (i <= stars) {
            starHTML += '<i class="bi bi-star-fill text-warning"></i>'; // Estrella llena
        } else {
            starHTML += '<i class="bi bi-star text-muted"></i>'; // Estrella vacía
        }
    }

    return starHTML;
}

function moreDetails(movie) {

    document.getElementById('offcanvasTopLabel').textContent = movie.title;
    document.getElementById('offcanvas-text').textContent = movie.overview;
    document.getElementById('offcanvas-footer-genre').textContent = movie.genres.map(genre => genre.name).sort().join(', ');

    const containerMoreInfo = document.querySelector(".dropdown-menu");
    const btn = document.getElementById("dropdownMenuButton");

    containerMoreInfo.innerHTML = '';

    btn.addEventListener('click', () => moreInfo(movie))

}

function moreInfo (movie) {

    const containerMoreInfo = document.querySelector(".dropdown-menu");

    let año = new Date(movie.release_date).getFullYear();
    let duracion = `${movie.runtime} minutos`;
    let presupuesto = `$${movie.budget.toLocaleString()}`;
    let ganancias = `$${movie.revenue.toLocaleString()}`;

    containerMoreInfo.innerHTML = `
        <li><strong>Year:</strong> ${año}</li>
        <li><strong>Runtime:</strong> ${duracion}</li>
        <li><strong>Budget:</strong> ${presupuesto}</li>
        <li><strong>Revenue:</strong> ${ganancias}</li>
    `;

}

document.addEventListener("DOMContentLoaded", function () {
    
    console.log(getJSONData(URL));

    getJSONData(URL).then(function (result) {

        console.log(getJSONData(URL))
        
        if (result.status === "ok"){

            currentMoviesArray = result.data

            console.log(currentMoviesArray)

            let input = document.getElementById('inputBuscar');
            // me debe filtrar en tiempo real
            document.getElementById('btnBuscar').addEventListener('click', function () {
                let query = input.value.toLowerCase();
                if (query !== '') {
                    let filteredProducts = currentMoviesArray.filter(movie =>
                        movie.title.toLowerCase().includes(query) ||  // como indica filtra titulo
                        movie.genres.map((genre) => genre.name.toLowerCase()).includes(query) || // como indica filtra el genero entrando al array
                        movie.tagline.toLowerCase().includes(query) || // como indica filtra el tagline
                        movie.overview.toLowerCase().includes(query) // como indica filtra el overview
                    );
                    showMoviesList(filteredProducts); // va a mostrar las pelis en el html si hay algo escrito en el input y si se toca el boton
                } else {
                    container.innerHTML = `
                        <div class="alert alert-dark alert-dismissible fade show" role="alert">
                            Debes ingresar un título, género o palabra clave para realizar la búsqueda.
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `;
                }
            });
        }
        else {
            console.error("Error al obtener los datos de las películas.");
        }
    })
    .catch(function(error){
        console.error(error)
    })
})
    



