module.exports = {
  config: {
    data: {
      datasets: [
        {
          anchorX: 'left',
          anchorY: 'top',
          backgroundColor: 'red',
          borderColor: 'black',
          borderWidth: 2,
          data: [{ v: 1, x: 1, y: 1 }],
          height: 50,
          width: 50,
        },
      ],
    },
    options: {
      plugins: {
        legend: false,
      },
      scales: {
        x: {
          display: false,
          type: 'linear',
        },
        y: {
          display: false,
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
}
