# Calendar (Time Scale)

```js chart-editor
// <block:generate:4>
function generateData() {
  const adapter = new helpers._adapters._date();
  const data = [];
  let dt = adapter.startOf(new Date(), 'month');
  const end = adapter.endOf(dt, 'month');
  while (dt <= end) {
    const iso = adapter.format(dt, 'yyyy-MM-dd');
    data.push({
      x: Utils.isoDayOfWeek(dt),
      y: iso,
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
    data: generateData(),
    backgroundColor({raw}) {
      const alpha = (10 + raw.v) / 60;
      return helpers.color('green').alpha(alpha).rgbString();
    },
    borderColor({raw}) {
      const alpha = (10 + raw.v) / 60;
      return helpers.color('green').alpha(alpha).darken(0.3).rgbString();
    },
    borderWidth: 1,
    hoverBackgroundColor: 'yellow',
    hoverBorderColor: 'yellowgreen',
    width: ({chart}) => (chart.chartArea || {}).width / chart.scales.x.ticks.length - 3,
    height: ({chart}) =>(chart.chartArea || {}).height / chart.scales.y.ticks.length - 3
  }]
};
// </block:data>

// <block:scales:3>
const scales = {
  y: {
    type: 'time',
    left: 'left',
    offset: true,
    time: {
      unit: 'week',
      round: 'week',
      isoWeekday: 1,
      displayFormats: {
        week: 'I'
      }
    },
    ticks: {
      maxRotation: 0,
      autoSkip: true,
      padding: 1
    },
    grid: {
      display: false,
      drawBorder: false,
      tickLength: 0,
    },
    title: {
      display: true,
      font: {size: 15, weigth: 'bold'},
      text: ({chart}) => chart.scales.x._adapter.format(Date.now(), 'MMM, yyyy'),
      padding: 0
    }
  },
  x: {
    type: 'time',
    position: 'top',
    offset: true,
    time: {
      unit: 'day',
      parser: 'i',
      isoWeekday: 1,
      displayFormats: {
        day: 'iiiiii'
      }
    },
    reverse: false,
    ticks: {
      source: 'data',
      padding: 0,
      maxRotation: 0,
    },
    grid: {
      display: false,
      drawBorder: false,
    }
  }
};
// </block:scales>

// <block:options:1>
const options = {
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
      top: 10,
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
