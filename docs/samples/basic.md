# Basic

```js chart-editor
// <block:data:1>
const data = {
  datasets: [{
    label: 'My Matrix',
    data: [
      {x: 1, y: 1, v: 11},
      {x: 1, y: 2, v: 12},
      {x: 1, y: 3, v: 13},
      {x: 2, y: 1, v: 21},
      {x: 2, y: 2, v: 22},
      {x: 2, y: 3, v: 23},
      {x: 3, y: 1, v: 31},
      {x: 3, y: 2, v: 32},
      {x: 3, y: 3, v: 33}
    ],
    backgroundColor(context) {
      const value = context.dataset.data[context.dataIndex].v;
      const alpha = (value - 5) / 40;
      return helpers.color('green').alpha(alpha).rgbString();
    },
    borderColor(context) {
      const value = context.dataset.data[context.dataIndex].v;
      const alpha = (value - 5) / 40;
      return helpers.color('darkgreen').alpha(alpha).rgbString();
    },
    borderWidth: 1,
    width: ({chart}) => (chart.chartArea || {}).width / 3 - 1,
    height: ({chart}) =>(chart.chartArea || {}).height / 3 - 1
  }]
};
// </block:data>


// <block:config:0>
const config = {
  type: 'matrix',
  data: data,
  options: {
    plugins: {
      legend: false,
      tooltip: {
        callbacks: {
          title() {
            return '';
          },
          label(context) {
            const v = context.dataset.data[context.dataIndex];
            return ['x: ' + v.x, 'y: ' + v.y, 'v: ' + v.v];
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          stepSize: 1
        },
        grid: {
          display: false
        }
      },
      y: {
        offset: true,
        ticks: {
          stepSize: 1
        },
        grid: {
          display: false
        }
      }
    }
  }
};

// </block:config>

const actions = [
  {
    name: 'Randomize',
    handler(chart) {
      chart.data.datasets.forEach(dataset => {
        dataset.data.forEach(point => {
          point.v = Math.random() * 20;
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
