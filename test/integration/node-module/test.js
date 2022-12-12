import {Chart, LinearScale} from 'chart.js';
import {MatrixController, MatrixElement} from 'chartjs-chart-matrix';
import {createCanvas} from '@napi-rs/canvas';

Chart.register(LinearScale, MatrixController, MatrixElement);

const canvas = createCanvas(300, 320);
const ctx = canvas.getContext('2d');

// Chart.js assumes ctx contains the canvas
ctx.canvas = canvas;

export const chart = new Chart(ctx, {
  type: 'matrix',
});
