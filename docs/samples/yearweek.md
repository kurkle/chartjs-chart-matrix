# Year-week heatmap

```js chart-editor
// <block:generate:4>
function generateData() {
  const adapter = new helpers._adapters._date();
  const data = [];
  const end = adapter.startOf(new Date(), 'isoWeek', 1);
  const startY = adapter.startOf(adapter.add(end, -10, 'year'), 'year');
  const fourth = adapter.add(startY, 3, 'day');
  const start = adapter.startOf(fourth, 'isoWeek', 1);
  for (let dt = start; dt < end; dt = adapter.add(dt, 1, 'week')) {
    const isoYear = adapter.format(dt, 'RRRR');
    const iso = adapter.format(dt, 'RRRR-MM-dd');
    const weekMonths = [];
    const monday = adapter.startOf(dt, 'isoWeek', 1);
    const sunday = adapter.add(dt, 7, 'day');
    const isoWeek = +adapter.format(dt, 'I');
    const monthIndex = isoWeek === 1 ? 0 : monday.getMonth();
    const startWeekOfMonth = +adapter.format(adapter.startOf(dt, 'month'), 'I');
    const weekOfMonth = startWeekOfMonth > isoWeek ? isoWeek : isoWeek - startWeekOfMonth + 1;
    const x = monthIndex * 6 + weekOfMonth;
    data.push({
      x,
      y: isoYear,
      d: iso,
      w: adapter.format(monday, 'yyyy-MM-dd') + ' - ' + adapter.format(sunday, 'yyyy-MM-dd'),
      v: Math.random() * 50,
      iw: isoWeek,
    });
  }
  window.data = data;
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
    width: 10,
    height: ({chart}) =>(chart.chartArea || {}).height / chart.scales.y.ticks.length - 3
  }]
};
// </block:data>

// <block:scales:3>
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const scales = {
  y: {
    type: 'time',
    left: 'left',
    offset: true,
    time: {
      unit: 'year',
      round: 'year',
      displayFormats: {
        parsing: 'yyyy',
        year: 'R' // ISO week-numbering year
      }
    },
    ticks: {
      maxRotation: 0,
      autoSkip: false,
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
      text: 'Year',
      padding: 0
    }
  },
  x: {
    type: 'linear',
    position: 'top',
    offset: true,
    min: 1,
    max: 72,
    reverse: false,
    ticks: {
      autoSkip: false,
      callback: (val, index) => val % 6 === 3 ? months[(val - 3) / 6] : '',
      maxTicksLimit: 100,
      stepSize: 1,
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
        label({raw}) {
          return ['w: ' + raw.w, 'isoWeek: ' + raw.iw, 'v: ' + raw.v.toFixed(2)];
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

const actions = [];

module.exports = {
  actions,
  config,
};
```
