import {Chart} from 'chart.js';
import MatrixController from './controller.js';
import MatrixElement from './element.js';

Chart.register(MatrixController, MatrixElement);

export {MatrixController, MatrixElement};
