module.exports = {
  config: {
    data: {
      datasets: [
        {
          backgroundColor: 'red',
          borderColor: 'black',
          borderWidth: [{ right: 10 }, { bottom: 10 }, { top: 10 }, { left: 10 }],
          data: [
            { v: 1, x: 1, y: 1 },
            { v: 1, x: 2, y: 1 },
            { v: 1, x: 1, y: 2 },
            { v: 1, x: 2, y: 2 },
          ],
          height: ({ chart }) => chart.chartArea?.height / 2 - 1,
          width: ({ chart }) => chart.chartArea?.width / 2 - 1,
        },
      ],
    },
    options: {
      events: [],
      plugins: {
        legend: false,
      },
      scales: {
        x: {
          display: false,
          max: 2.5,
          min: 0.5,
          offset: false,
          type: 'linear',
        },
        y: {
          display: false,
          max: 2.5,
          min: 0.5,
          offset: false,
          type: 'linear',
        },
      },
    },
    type: 'matrix',
  },
  options: {
    canvas: {
      height: 256,
      width: 256,
    },
  },
  tolerance: 0.15,
}
