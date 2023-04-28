
          
 function loadChart(data) {
 
    
  let chart = new CanvasJS.Chart("right", {
    theme: "dark1", // "light1", "light2", "dark1",
    backgroundColor: 'rgba(43, 185, 74, 0.726)',
    animationEnabled: true,
    exportEnabled: false,
    title: {
      text: "PG County 2020 spending",
      
    },
    
    axisX: {
      margin: 8,
      labelPlacement: "outside",
      tickPlacement: "inside",
      minimum:0,
    },
    axisY2: {
      title: "Dollars (in Millions)",
      titleFontSize: 15,
      includeZero: true,
      suffix: "M",
      
    },
    data: [{
      type: "doughnut",
      axisYType: "secondary",
      yValueFormatString: "#,###.##M",
      indexLabel: "{y}",
      indexLabelFontSize:10,
      indexLabelPlacement:'inside',
      dataPoints: data
         
            // {label: 'CENTRAL SERVICES', y: 13.246724},
            // {label: 'POLICE', y: 1.780956}, 
            // {label: 'HEALTH', y: 8.243691},
            // {label: 'PUBLIC WORKS & TRANSPORTATION', y: 21.942255},
            // {label: 'ENVIRONMENT', y: 21.06482},
            // {label: 'FIRE/EMS', y: 4.026177},
            // {label: 'INFORMATION TECHNOLOGY', y: 0.897357},
            // {label: 'PERMITTING, INSPECTIONS & ENFORCEMENT', y: 1.408491},
            // {label: "ORPHAN'S COURT", y: 0.001324},
            // {label: 'CIRCUIT COURT', y: 0.516202},
            // {label: 'FINANCE', y: 0.32401},
        // { label: "Sugar - Maroon 5", y: 3.25 },
        // { label: "Sorry - Justin Bieber", y: 3.32 },
        // { label: "Johny Johny Yes Papa", y: 3.63 },
        // { label: "Gangnam Style", y: 3.72 },
        // { label: "Uptown Funk", y: 3.90 },
        // { label: "Masha and the Bear", y: 4.32 },
        // { label: "See You Again", y: 4.66 },
        // { label: "Shape of You", y: 4.91 },
        // { label: "Baby Shark Dance", y: 6.13 },
        // { label: "Despacito", y: 6.88 }
      
    }]
  });
  chart.render();
    
  }

function getData(data){
  let names = []
  let resList = []
  parsed = JSON.parse(data)
  
  parsed.forEach((element) => {
    if (!names.includes(element.agency) ){
      names.push(element.agency)
    }
    //console.log(element.agency)
  
   });
  
  names.forEach((agency) => {
    let agency_spending = 0
    parsed.forEach((line) => {
      //console.log(line.agency)
      if(agency == line.agency){
        agency_spending += parseInt(line.amount)
      }

    })
    resList.push({label:agency,y:agency_spending/10000})
  })

  return resList
}

async function mainEvent() {
  //chart = BarChart()
  const loadDataButton = document.querySelector('#generate')
  const loadChartButton = document.querySelector('#chart')
  

  // let graphData20 = {}
  // let graphData21 = {}
 
  
  loadDataButton.addEventListener('click', async (event) => {
    console.log('clicked')

    //getting the data from the api for 2021
    const result20 = await fetch('https://data.princegeorgescountymd.gov/resource/uh6s-izyj.json?$limit=56213');
    const storedList20 = await result20.json();
    //change to object list
    const temp20 = getData(JSON.stringify(storedList20))
    console.log(temp20)
    // console.log('here')
    localStorage.setItem('storedData20', JSON.stringify(temp20))
    console.table(storedList20)
    console.log('2020 data')

    //getting the data from the api for 2021
    const result21 = await fetch('https://data.princegeorgescountymd.gov/resource/rh7w-bmhm.json?$limit=10000');
    const storedList21 = await result21.json();
    //change to parsed table
    localStorage.setItem('storedData21', JSON.stringify(storedList21))
    console.table(storedList21);
    //console.log(storedList21.agency)
    console.log('2021 data');
    
    //getting the data for the years
    // graphData20 = getData(localStorage.getItem('storedData20'));
    // graphData21 = getData(localStorage.getItem('storedData21'));
    
    // localStorage.setItem('graphd',toString(graphData20))
    // console.log(graphData20)
  })
  
  loadChartButton.addEventListener('click', async (event) => {
    console.log('chart loaded');
    console.log(JSON.parse(localStorage.getItem('storedData20')));

    const usethis = JSON.parse(localStorage.getItem('storedData20'));
    
    loadChart(usethis);
  })

    

}

document.addEventListener('DOMContentLoaded', async () => mainEvent());