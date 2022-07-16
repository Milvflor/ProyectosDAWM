var Chart = require('chart.js');

const CHART_COLORS = {
  red: 'rgb(255, 99, 132, 0.5)',
  orange: 'rgb(255, 159, 64, 0.5)',
  yellow: 'rgb(255, 205, 86, 0.5)',
  green: 'rgb(75, 192, 192, 0.5)',
  blue: 'rgb(54, 162, 235, 0.5)',
  purple: 'rgb(153, 102, 255, 0.5)',
  grey: 'rgb(201, 203, 207, 0.5)',
  coral: 'rgb(240,128,128, 0.5)',
  seaGreen: 'rgb(32,178,170, 0.5)',
  flowerBlue: 'rgb(100,149,237, 0.5)',
  thistle: 'rgb(216,191,216, 0.5)',
  mocassin: 'rgb(255,228,181, 0.5)',
};

let titles = [];
let running_times = [];
let scores = [];
const diccProducer = new Map();//Director
let keys = [];
let values = [];

let cargarDatos = () => {
  //Peticion asincronica con el objeto fetch
  fetch("https://ghibliapi.herokuapp.com/films/")
    .then(response => response.json())
    .then(data => {

      // handle the response
      for (let index = 0; index < data.length; index++) {
        const element = data[index];//diccionario

        let imagen = element.image;
        let anio_start = element.release_date;
        let titulo = element.original_title_romanised;
        let director = element.director;
        let productor = element.producer;
        let descr = element.description;
        let score = element.rt_score;
        let rt = element.running_time;

        let plantilla = `
          <div class="col-lg-4 col-md-12 mb-4">
            <div class="card">
              <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
                <img
                  src="${imagen}"
                  class="img-fluid"
                />
                <a href="#!">
                  <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
                </a>
              </div>
              <div class="card-body">
                  <h3 class="year_start">${anio_start}</h3>
                  <h5 class="card-title">${titulo}</h5>
                  <p>${descr}</p>
                  <div class="text">
                      <div>
                          <p>${director}</p>
                          <p class="etiqueta">Director</p>
                      </div>
                      <div>
                          <p>${productor}</p>
                          <p class="etiqueta">Producer</p>
                      </div>
                  </div>
                  <h4>Rate score</h4>
                  <div class="progress" style="height: 20px;">
                  <div class="progress-bar" role="progressbar" style="width: ${score}%;" aria-valuenow="${score}" aria-valuemin="0" aria-valuemax="100">${score}</div>
                  </div>
              </div>
            </div>
          </div>
          `;

        document.getElementById("cards").innerHTML += plantilla;

        //Datos para Bar 
        titles.push(titulo);
        running_times.push(rt);
        scores.push(score);


        //Datos para Polar
        let productorsL = director.split(",");
        for (let index = 0; index < productorsL.length; index++) {
          const element = productorsL[index];
          if (diccProducer.has(element)) {
            let v = diccProducer.get(element);
            diccProducer.set(element, v + 1);
          } else {
            diccProducer.set(element, 1);
          }
        }
      }

      console.log(titles);
      running_timeF(running_times, titles);

      diccProducer.forEach(function (value, key) {
        keys.push(key);
        values.push(value);
      })


      polarArea(keys, values);

    })
    .catch(error => {
      // handle the error
      console.error;
    });
};
cargarDatos();


let b1 = document.getElementById("B1");
b1.addEventListener("click", function () {
  titlesFiltered = [];
  running_timeFiltered = [];

  for (let index = 0; index < scores.length; index++) {
    let sc = scores[index];

    if (sc <= 80) {
      console.log(sc);
      titlesFiltered.push(titles[index]);
      running_timeFiltered.push(running_times[index]);
    }

  }

  running_timeF(running_timeFiltered, titlesFiltered);

});


let b2 = document.getElementById("B2");
b2.addEventListener("click", function () {
  titlesFiltered = [];
  running_timeFiltered = [];

  for (let index = 0; index < scores.length; index++) {
    let sc = scores[index];

    if (sc > 80 && sc < 90) {
      console.log(sc);
      titlesFiltered.push(titles[index]);
      running_timeFiltered.push(running_times[index]);
    }

  }

  running_timeF(running_timeFiltered, titlesFiltered);

});


let b3 = document.getElementById("B3");
b3.addEventListener("click", function () {
  titlesFiltered = [];
  running_timeFiltered = [];

  for (let index = 0; index < scores.length; index++) {
    let sc = scores[index];

    if (sc >= 90) {
      console.log(sc);
      titlesFiltered.push(titles[index]);
      running_timeFiltered.push(running_times[index]);
    }

  }

  running_timeF(running_timeFiltered, titlesFiltered);

});

let b4 = document.getElementById("B4");
b4.addEventListener("click", function () {
  titlesFiltered = [];
  running_timeFiltered = [];

  for (let index = 0; index < scores.length; index++) {
    let sc = scores[index];

    if (sc == 100) {
      console.log(sc);
      titlesFiltered.push(titles[index]);
      running_timeFiltered.push(running_times[index]);
    }

  }

  running_timeF(running_timeFiltered, titlesFiltered);

});

function init() {
  running_timeF(running_times, titles);
}

let div_E = document.getElementById('canvasMod');
div_E.addEventListener('click', init);

// Tiempo transcurrido por cada peli -> running_time

function running_timeF(x, y) {

  const labels = y;
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Minutos',
        data: x,
        borderColor: CHART_COLORS.red,
        backgroundColor: [
          CHART_COLORS.grey,
          CHART_COLORS.thistle,
          CHART_COLORS.coral,
          CHART_COLORS.flowerBlue,
          CHART_COLORS.mocassin,
          CHART_COLORS.seaGreen,
          CHART_COLORS.orange,
          CHART_COLORS.yellow,
          CHART_COLORS.green,
          CHART_COLORS.blue,
        ]
      }
    ]
  }

  const config = {
    type: 'bar',
    data: data,
    options: {
      indexAxis: 'y',
      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide
      elements: {
        bar: {
          borderWidth: 1,
        }
      },
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Filmes vs. tiempo de duración (min)',
          font:{
            size: 25
          }
        }
      }
    },
  };

  let div_E = document.getElementById('canvasMod');
  let elem = document.createElement('canvas');
  elem.setAttribute('id', 'running_time');
  elem.setAttribute("width", "600");
  elem.setAttribute("height", "300");

  div_E.innerHTML = elem.outerHTML;

  const myChart = new Chart(
    document.getElementById('running_time'),
    config
  );
}

// console.log(diccProducer);



function polarArea(criterio, valores) {

  console.log(diccProducer);
  const labels = criterio;
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: valores,
        backgroundColor: [
          CHART_COLORS.red,
          CHART_COLORS.flowerBlue,
          CHART_COLORS.mocassin,
          CHART_COLORS.seaGreen,
          CHART_COLORS.orange,
          CHART_COLORS.yellow,
          CHART_COLORS.green,
          CHART_COLORS.blue,
        ]
      }
    ]
  };

  const config = {
    type: 'polarArea',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Número de filmes realizados por Director',
          font:{
            size: 25
          }
        }
      }
    },
  };


  let div_E = document.getElementById('canvasModPolar');
  let elem = document.createElement('canvas');
  elem.setAttribute('id', 'producerP');
  elem.setAttribute('style',"display: block; box-sizing: border-box; height: 300px; width: 300px;");

  div_E.innerHTML = elem.outerHTML;

  const myChart = new Chart(
    document.getElementById('producerP'),
    config
  );

}





