'use strict';

import Chart from 'chart.js';
import controller from './controller';

Chart.controllers.matrix = controller;
Chart.defaults.matrix = {
	hover: {
		mode: 'nearest',
		intersect: true
	},
	tooltips: {
		mode: 'nearest',
		intersect: true
	},
	scales: {
		xAxes: [{
			type: 'linear'
		}],
		yAxes: [{
			type: 'linear'
		}]
	},
	elements: {
		rectangle: {
			borderSkipped: false,
			width: 20,
			height: 20
		}
	}
};
