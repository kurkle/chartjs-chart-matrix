module.exports = {
  config: {
    type: 'matrix',
    data: {
      datasets: [
        {
          anchorX: 'right',
          anchorY: 'bottom',
          data: [{ x: 1, y: 1, v: 1 }],
          backgroundColor: 'red',
          borderColor: 'black',
          borderWidth: 2,
          width: 50,
          height: 50,
        },
      ],
    },
    options: {
      plugins: {
        legend: false,
      },
      scales: {
        x: {
          type: 'linear',
          display: false,
        },
        y: {
          type: 'linear',
          display: false,
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
