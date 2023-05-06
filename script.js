
          
 function loadChart(data, year='2020') {
 
    
  let chart = new CanvasJS.Chart("right", {
    theme: "dark1", // "light1", "light2", "dark1",
    backgroundColor: 'rgba(43, 185, 74, 0.726)',
    animationEnabled: true,
    exportEnabled: false,
    title: {
      text: `PG County ${year} spending`,
      
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
  const loadDataButton = document.querySelector('#generate');
  const loadChartButton = document.querySelector('#chart');

  const changeYearButton = document.querySelector('#year-select');
  

  // let graphData20 = {}
  // let graphData21 = {}
 
  
  loadDataButton.addEventListener('click', async (event) => {
    console.log('clicked')

    //getting the data from the api for 2020
    const result20 = await fetch('https://data.princegeorgescountymd.gov/resource/uh6s-izyj.json?$limit=56213');
    const storedList20 = await result20.json();
    //change to object list
    const temp20 = getData(JSON.stringify(storedList20))
    console.log(temp20)
    // console.log('here')
    localStorage.setItem('storedData2020', JSON.stringify(temp20))
    console.table(storedList20)
    console.log('2020 data')

    //getting the data from the api for 2021
    const result21 = await fetch('https://data.princegeorgescountymd.gov/resource/rh7w-bmhm.json?$limit=30000');
    const storedList21 = await result21.json();
    //change to object list
    const temp21 = getData(JSON.stringify(storedList21))
    console.log(temp21)
    // console.log('here')
    localStorage.setItem('storedData2021', JSON.stringify(temp21))
    console.table(storedList21)
    console.log('2021 data')

     //getting the data from the api for 2022
     const result22 = await fetch('https://data.princegeorgescountymd.gov/resource/jh2p-ym6a.json?$limit=57000');
     const storedList22 = await result22.json();
     //change to object list
     const temp22 = getData(JSON.stringify(storedList22))
     console.log(temp22)
     // console.log('here')
     localStorage.setItem('storedData2022', JSON.stringify(temp22))
     console.table(storedList22)
     console.log('2022 data')
    
    
  })
  
  loadChartButton.addEventListener('click', async (event) => {
    console.log('chart loaded');
    console.log(JSON.parse(localStorage.getItem('storedData2020')));

    const usethis = JSON.parse(localStorage.getItem('storedData2020'));
    
    loadChart(usethis);
  })

  changeYearButton.addEventListener('change', (event) => {
    console.log('year changed')
    console.log(event.target.value);
    let year1 = event.target.value;

    if (year1 == "year"){year1 = "2020"}
    
    const chartData = JSON.parse(localStorage.getItem(`storedData${year1}`));

    loadChart(chartData,year1)  // fill in the chart data with the data from the correct year chosen in the dropdown menu
  })

}

document.addEventListener('DOMContentLoaded', async () => mainEvent());