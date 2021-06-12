import { Chart } from 'chart.js';
import { MatrixController, MatrixElement } from '../index.esm';

Chart.register(MatrixController, MatrixElement);

const chart = new Chart('test', {
  type: 'matrix',
  data: {
    datasets: [{
      label: 'Matrix',
      data: [{ x: 1, y: 1, v: 10 }],
      anchorX: 'center',
      anchorY: 'top',
      width: 10,
      height: 10,
      borderWidth: 1,
      hoverBorderWidth: () => 2,
    }]
  },
});
