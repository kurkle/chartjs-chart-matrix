# On Category Scale

```js chart-editor
// <block:data:1>
const data = {
  datasets: [{
    label: 'My Matrix',
    data: [
      {x: 'A', y: 'X', v: 11},
      {x: 'A', y: 'Y', v: 12},
      {x: 'A', y: 'Z', v: 13},
      {x: 'B', y: 'X', v: 21},
      {x: 'B', y: 'Y', v: 22},
      {x: 'B', y: 'Z', v: 23},
      {x: 'C', y: 'X', v: 31},
      {x: 'C', y: 'Y', v: 32},
      {x: 'C', y: 'Z', v: 33}
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
        type: 'category',
        labels: ['A', 'B', 'C'],
        ticks: {
          display: true
        },
        grid: {
          display: false
        }
      },
      y: {
        type: 'category',
        labels: ['X', 'Y', 'Z'],
        offset: true,
        ticks: {
          display: true
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
          point.v = Math.random() * 50;
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
