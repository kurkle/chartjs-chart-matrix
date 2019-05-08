# chartjs-chart-matrix

Chart.js module for creating matrix charts

[![release](https://img.shields.io/github/release/kurkle/chartjs-chart-matrix.svg?style=flat-square)](https://github.com/kurkle/chartjs-chart-matrix/releases/latest) [![travis](https://img.shields.io/travis/kurkle/chartjs-chart-matrix.svg?style=flat-square&maxAge=60)](https://travis-ci.org/kurkle/chartjs-chart-matrix) [![awesome](https://awesome.re/badge-flat2.svg)](https://github.com/chartjs/awesome)

## Documentation

To create a matrix chart, include chartjs-chart-matrix.js after chart.js and then create the chart by setting the `type` attribute to `'matrix'`

```js
new Chart(ctx, {
    type: 'matrix',
    data: dataObject
});
```

## Configuration

Matrix chart allows configuration of `width` and `height` of the data points in addition to standard Chart.js configuration.

```js
new Chart(ctx, {
    type: 'matrix',
    data: {
        datasets: [{
            label: 'My Matrix',
            data: [
                { x: 1, y: 1, v: 11 },
                { x: 2, y: 2, v: 22 },
                { x: 3, y: 3, v: 33 }
            ],
            backgroundColor: function(ctx) {
                var value = ctx.dataset.data[ctx.dataIndex].v;
                var alpha = (value - 5) / 40;
                return Color('green').alpha(alpha).rgbString();
            },
            width: function(ctx) {
                var a = ctx.chart.chartArea;
                return (a.right - a.left) / 3.5;
            },
            height: function(ctx) {
                var a = ctx.chart.chartArea;
                return (a.bottom - a.top) / 3.5;
            }
        }]
    },
});
```

## Example

![Matrix Example Image](matrix.png)

## License

chartjs-chart-matrix is available under the [MIT license](https://opensource.org/licenses/MIT).