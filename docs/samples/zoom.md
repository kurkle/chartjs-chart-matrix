# Zoom and Pan

```js chart-editor
// <block:generate:4>
function generateData() {
  const data = [];

  for (let x = 1; x <= 30; x++) {
    for (let y = 1; y <= 20; y++) {
      data.push({
        x,
        y,
        v: Math.random() * 100
      });
    }
  }

  return data;
}
// </block:generate>

// <block:data:2>
const data = {
  datasets: [{
    label: 'My Matrix',
    data: generateData(),
    backgroundColor({raw}) {
      const alpha = (10 + raw.v) / 110;
      return helpers.color('green').alpha(alpha).rgbString();
    },
    borderColor({raw}) {
      const alpha = (10 + raw.v) / 110;
      return helpers.color('darkgreen').alpha(alpha).rgbString();
    },
    borderWidth: 1,
    width({chart}) {
      const x = chart.scales.x;
      return Math.abs(x.getPixelForValue(2) - x.getPixelForValue(1)) - 1;
    },
    height({chart}) {
      const y = chart.scales.y;
      return Math.abs(y.getPixelForValue(2) - y.getPixelForValue(1)) - 1;
    }
  }]
};
// </block:data>

// <block:options:1>
const options = {
  plugins: {
    legend: false,
    tooltip: {
      callbacks: {
        title() {
          return '';
        },
        label(context) {
          const v = context.dataset.data[context.dataIndex];
          return ['x: ' + v.x, 'y: ' + v.y, 'v: ' + v.v.toFixed(2)];
        }
      }
    },
    zoom: {
      limits: {
        x: {min: 0.5, max: 30.5, minRange: 3},
        y: {min: 0.5, max: 20.5, minRange: 3}
      },
      pan: {
        enabled: true,
        mode: 'xy'
      },
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'xy'
      }
    }
  },
  scales: {
    x: {
      display: false,
      min: 0.5,
      max: 30.5,
      ticks: {
        stepSize: 1
      },
      grid: {
        display: false
      }
    },
    y: {
      display: false,
      min: 0.5,
      max: 20.5,
      reverse: true,
      ticks: {
        stepSize: 1
      },
      grid: {
        display: false
      }
    }
  }
};
// </block:options>

// <block:config:0>
const config = {
  type: 'matrix',
  data: data,
  options: options
};
// </block:config>

const actions = [
  {
    name: 'Reset zoom',
    handler(chart) {
      chart.resetZoom();
    }
  },
  {
    name: 'Randomize',
    handler(chart) {
      chart.data.datasets.forEach(dataset => {
        dataset.data.forEach(point => {
          point.v = Math.random() * 100;
        });
      });
      chart.update();
    }
  },
];

module.exports = {
  actions,
  config,
};
```
