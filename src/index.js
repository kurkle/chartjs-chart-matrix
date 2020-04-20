'use strict';

import Chart from 'chart.js';
import controller from './controller';

Chart.controllers.matrix = controller;
Chart.defaults.matrix = {
	hover: {
		mode: 'nearest',
		intersect: true
	},
	datasets: {
		animation: {
			numbers: {
				type: 'number',
				properties: ['x', 'y', 'width', 'height']
			}
		},
		anchorX: 'center',
		anchorY: 'center'
	},
	tooltips: {
		mode: 'nearest',
		intersect: true
	},
	scales: {
		x: {
			type: 'linear',
			offset: true
		},
		y: {
			type: 'linear',
			reverse: true
		}
	},
	elements: {
		rectangle: {
			width: 20,
			height: 20
		}
	}
};
