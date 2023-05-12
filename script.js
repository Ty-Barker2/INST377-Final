function loadChart(data, year = "2020") {
  let chart = new CanvasJS.Chart("right", {
    theme: "dark2", // "light1", "light2", "dark1",
    backgroundColor: "black",
    animationEnabled: true,
    exportEnabled: false,
    title: {
      text: `PG County ${year} spending`,
    },

    axisX: {
      margin: 8,
      labelPlacement: "outside",
      tickPlacement: "inside",
      minimum: 0,
    },
    axisY2: {
      title: "Dollars (in Millions)",
      titleFontSize: 15,
      includeZero: true,
      suffix: "M",
    },
    data: [
      {
        type: "doughnut",
        axisYType: "secondary",
        yValueFormatString: "#,###.##M",

        indexLabelFontSize: 10,
        indexLabelPlacement: "inside",
        dataPoints: data,
      },
    ],
  });
  chart.render();
}

function loadStacked(data1, data2, data3, html) {
  var chart = new CanvasJS.Chart(html, {
    animationEnabled: true,
    zoomEnabled: true,
    theme: "dark2",
    backgroundColor: "black",
    title: {
      text: "Yearly Spending comparison",
    },
    axisX: {
      margin: 8,
      labelPlacement: "outside",
      tickPlacement: "outside",
      labelAngle: 0,
    },
    axisY2: {
      minimum: 0,
    },
    data: [
      {
        type: "stackedColumn",
        legendText: "2020",
        showInLegend: "true",

        dataPoints: data1,
      },
      {
        type: "stackedColumn",
        legendText: "2021",
        showInLegend: "true",
        dataPoints: data2,
      },
      {
        type: "stackedColumn",
        legendText: "2022",
        showInLegend: "true",
        dataPoints: data3,
      },
    ],
  });

  chart.render();
}

function lineUp(earliest, fullData) {
  let resList = [];

  earliest.forEach((element) => {
    fullData.forEach((agency) => {
      if (element.label == agency.label) {
        resList.push(agency);
      }
    });
  });
  return resList;
}

function compare(a, b) {
  // Use toUpperCase() to ignore character casing
  const agencyA = a.y;
  const agencyB = b.y;

  let comparison = 0;
  if (agencyA < agencyB) {
    comparison = 1;
  } else if (agencyA > agencyB) {
    comparison = -1;
  }
  return comparison;
}

function getData(data) {
  let names = [];
  let resList = [];
  parsed = JSON.parse(data);

  parsed.forEach((element) => {
    if (!names.includes(element.agency)) {
      names.push(element.agency);
    }
    //console.log(element.agency)
  });

  names.forEach((agency) => {
    let agency_spending = 0;
    parsed.forEach((line) => {
      //console.log(line.agency)
      if (agency == line.agency) {
        agency_spending += parseInt(line.amount);
      }
    });
    resList.push({ label: agency, y: agency_spending / 10000 });
  });

  return resList;
}

async function mainEvent() {
  //buttons to get the circle chart to load
  const loadDataButton = document.querySelector("#generate");
  const loadChartButton = document.querySelector("#chart");
  const changeYearButton = document.querySelector("#year-select");

  //buttons for the comparison chart
  const loadComparisonButton = document.querySelector("#compare");
  const loadCompAll = document.querySelector("#compare_all");

  loadDataButton.addEventListener("click", async (event) => {
    console.log("clicked");
    localStorage.clear();

    //getting the data from the api for 2020
    const result20 = await fetch(
      "https://data.princegeorgescountymd.gov/resource/uh6s-izyj.json?$limit=56213"
    );
    const storedList20 = await result20.json();
    //change to object list
    const temp20 = getData(JSON.stringify(storedList20));
    // console.log(temp20)
    // console.log('here')
    localStorage.setItem("storedData2020", JSON.stringify(temp20));
    // console.table(storedList20)
    console.log("2020 data");

    //getting the data from the api for 2021
    const result21 = await fetch(
      "https://data.princegeorgescountymd.gov/resource/rh7w-bmhm.json?$limit=30000"
    );
    const storedList21 = await result21.json();
    //change to object list
    const temp21 = getData(JSON.stringify(storedList21));
    // console.log(temp21)
    // console.log('here')
    localStorage.setItem("storedData2021", JSON.stringify(temp21));
    // console.table(storedList21)
    console.log("2021 data");

    //getting the data from the api for 2022
    const result22 = await fetch(
      "https://data.princegeorgescountymd.gov/resource/jh2p-ym6a.json?$limit=57000"
    );
    const storedList22 = await result22.json();
    //change to object list
    const temp22 = getData(JSON.stringify(storedList22));
    //  console.log(temp22)

    // console.log('here')
    localStorage.setItem("storedData2022", JSON.stringify(temp22));
    //  console.table(storedList22);
    console.log("2022 data");
  });

  loadChartButton.addEventListener("click", async (event) => {
    // console.log('chart loaded');
    // console.log(JSON.parse(localStorage.getItem('storedData2020')));

    const usethis = JSON.parse(localStorage.getItem("storedData2020"));

    loadChart(usethis);
  });

  changeYearButton.addEventListener("change", async (event) => {
    console.log("year changed");
    // console.log(event.target.value);
    let year1 = event.target.value;

    if (year1 == "year") {
      year1 = "2020";
    }
    const chartData = JSON.parse(localStorage.getItem(`storedData${year1}`));
    loadChart(chartData, year1); // fill in the chart data with the data from the correct year chosen in the dropdown menu
  });

  loadComparisonButton.addEventListener("click", async (event) => {
    let sdata20 = JSON.parse(localStorage.getItem(`storedData2020`));
    let sdata21 = JSON.parse(localStorage.getItem(`storedData2021`));
    let sdata22 = JSON.parse(localStorage.getItem(`storedData2022`));

    sdata20 = sdata20.sort(compare);
    sdata21 = sdata21.sort(compare);
    sdata22 = sdata22.sort(compare);

    let bdata20 = sdata20.sort(compare);
    let bdata21 = sdata21.sort(compare);
    let bdata22 = sdata22.sort(compare);

    sdata20 = sdata20.slice(1, 6);
    sdata21 = lineUp(sdata20, sdata21);
    sdata22 = lineUp(sdata20, sdata22);

    console.log(sdata20);
    console.log(sdata21);
    console.log(sdata22);

    loadStacked(sdata20, sdata21, sdata22, "graphBox");
    loadStacked(
      bdata20.slice(0, 1),
      bdata21.slice(0, 1),
      bdata22.slice(0, 1),
      "right_middle"
    );
  });

  loadCompAll.addEventListener("click", async (event) => {
    let sdata20 = JSON.parse(localStorage.getItem(`storedData2020`));
    let sdata21 = JSON.parse(localStorage.getItem(`storedData2021`));
    let sdata22 = JSON.parse(localStorage.getItem(`storedData2022`));

    sdata20 = sdata20.sort(compare);
    sdata21 = sdata21.sort(compare);
    sdata22 = sdata22.sort(compare);

    let bdata20 = sdata20.sort(compare);
    let bdata21 = sdata21.sort(compare);
    let bdata22 = sdata22.sort(compare);

    sdata20 = sdata20.slice(1);
    sdata21 = lineUp(sdata20, sdata21);
    sdata22 = lineUp(sdata20, sdata22);

    console.log(sdata20);
    console.log(sdata21);
    console.log(sdata22);

    loadStacked(sdata20, sdata21, sdata22, "graphBox");
    loadStacked(
      bdata20.slice(0, 1),
      bdata21.slice(0, 1),
      bdata22.slice(0, 1),
      "right_middle"
    );
  });
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
