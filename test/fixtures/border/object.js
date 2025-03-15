module.exports = {
  tolerance: 0.15,
  config: {
    type: 'matrix',
    data: {
      datasets: [
        {
          data: [
            { x: 1, y: 1, v: 1 },
            { x: 2, y: 1, v: 1 },
            { x: 1, y: 2, v: 1 },
            { x: 2, y: 2, v: 1 },
          ],
          backgroundColor: 'red',
          borderColor: 'black',
          borderWidth: [{ right: 10 }, { bottom: 10 }, { top: 10 }, { left: 10 }],
          width: ({ chart }) => (chart.chartArea || {}).width / 2 - 1,
          height: ({ chart }) => (chart.chartArea || {}).height / 2 - 1,
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
          type: 'linear',
          display: false,
          offset: false,
          min: 0.5,
          max: 2.5,
        },
        y: {
          type: 'linear',
          display: false,
          offset: false,
          min: 0.5,
          max: 2.5,
        },
      },
    },
  },
  options: {
    canvas: {
      height: 256,
      width: 256,
    },
  },
}
