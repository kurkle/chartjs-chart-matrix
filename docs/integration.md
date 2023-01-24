# Integration

chartjs-chart-matrix can be integrated with plain JavaScript or with different module loaders. The examples below show to load the plugin in different systems.

## Script Tag

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-chart-matrix@2"></script>
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
