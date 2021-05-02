# Integration

chartjs-chart-matrix can be integrated with plain JavaScript or with different module loaders. The examples below show to load the plugin in different systems.

## Script Tag

```html
<script src="path/to/chartjs/dist/chart.min.js"></script>
<script src="path/to/chartjs-chart-matrix/dist/chartjs-chart-matrix.min.js"></script>
<script>
    var myChart = new Chart(ctx, {type: 'matrix', ...});
</script>
```

## Bundlers (Webpack, Rollup, etc.)

```javascript
import { Chart } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

Chart.register(MatrixController, MatrixElement);
```
