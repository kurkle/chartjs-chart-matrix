import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import {MatrixController, MatrixElement} from '../../dist/chartjs-chart-matrix.esm';

Chart.register(MatrixController, MatrixElement);

Chart.register({
  id: 'version',
  afterDraw(chart) {
    const ctx = chart.ctx;
    ctx.save();
    ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('Chart.js v' + Chart.version + ' + chartjs-chart-matrix v' + MatrixController.version, chart.chartArea.right, 0);
    ctx.restore();
  }
});
