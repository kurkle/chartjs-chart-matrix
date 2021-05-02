import '../index.esm';
import { Chart } from 'chart.js';

const chart = new Chart('test', {
  type: 'matrix',
  data: {
    datasets: [{
      label: 'Matrix',
      data: [{ x: 1, y: 1, v: 10 }],
    }]
  },
});
