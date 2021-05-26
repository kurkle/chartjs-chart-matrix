# On Time Scale

```js chart-editor
// <block:generate:4>
function generateData() {
  const data = [];
  const end = Utils.startOfToday();
  let dt = new Date(new Date().setDate(end.getDate() - 365));
  while (dt <= end) {
    const iso = dt.toISOString().substr(0, 10);
    data.push({
      x: iso,
      y: Utils.isoDayOfWeek(dt),
      d: iso,
      v: Math.random() * 50
    });
    dt = new Date(dt.setDate(dt.getDate() + 1));
  }
  return data;
}
// </block:generate>

// <block:data:2>
const data = {
  datasets: [{
    label: 'My Matrix',
    data: generateData(),
    backgroundColor(c) {
      const value = c.dataset.data[c.dataIndex].v;
      const alpha = (10 + value) / 60;
      return helpers.color('green').alpha(alpha).rgbString();
    },
    borderColor(c) {
      const value = c.dataset.data[c.dataIndex].v;
      const alpha = (10 + value) / 60;
      return helpers.color('green').alpha(alpha).darken(0.3).rgbString();
    },
    borderWidth: 1,
    hoverBackgroundColor: 'yellow',
    hoverBorderColor: 'yellowgreen',
    width(c) {
      const a = c.chart.chartArea || {};
      return (a.right - a.left) / 53 - 1;
    },
    height(c) {
      const a = c.chart.chartArea || {};
      return (a.bottom - a.top) / 7 - 1;
    }
  }]
};
// </block:data>

// <block:scales:3>
const scales = {
  y: {
    type: 'time',
    offset: true,
    time: {
      unit: 'day',
      round: 'day',
      isoWeekday: 1,
      parser: 'i',
      displayFormats: {
        day: 'iiiiii'
      }
    },
    reverse: true,
    position: 'right',
    ticks: {
      maxRotation: 0,
      autoSkip: true,
      padding: 1,
      font: {
        size: 9
      }
    },
    grid: {
      display: false,
      drawBorder: false,
      tickLength: 0
    }
  },
  x: {
    type: 'time',
    position: 'bottom',
    offset: true,
    time: {
      unit: 'week',
      round: 'week',
      isoWeekday: 1,
      displayFormats: {
        week: 'MMM dd'
      }
    },
    ticks: {
      maxRotation: 0,
      autoSkip: true,
      font: {
        size: 9
      }
    },
    grid: {
      display: false,
      drawBorder: false,
      tickLength: 0,
    }
  }
};
// </block:scales>

// <block:options:1>
const options = {
  aspectRatio: 5,
  plugins: {
    legend: false,
    tooltip: {
      displayColors: false,
      callbacks: {
        title() {
          return '';
        },
        label(context) {
          const v = context.dataset.data[context.dataIndex];
          return ['d: ' + v.d, 'v: ' + v.v.toFixed(2)];
        }
      }
    },
  },
  scales: scales,
  layout: {
    padding: {
      top: 10
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
