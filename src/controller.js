'use strict';

import Chart from 'chart.js';
import Rectangle from './rectangle';

export default class MatrixController extends Chart.DatasetController {

	update(mode) {
		var me = this;
		var meta = me._cachedMeta;

		me.updateElements(meta.data, 0, mode);
	}

	updateElements(rects, start, mode) {
		const me = this;
		const reset = mode === 'reset';
		const {xScale, yScale} = me._cachedMeta;
		const firstOpts = me.resolveDataElementOptions(start, mode);
		const sharedOptions = me.getSharedOptions(mode, rects[start], firstOpts);

		for (let i = 0; i < rects.length; i++) {
			const index = start + i;
			const parsed = !reset && me.getParsed(index);
			const x = reset ? xScale.getBasePixel() : xScale.getPixelForValue(parsed.x);
			const y = reset ? yScale.getBasePixel() : yScale.getPixelForValue(parsed.y);
			const options = me.resolveDataElementOptions(i, mode);
			const {width, height} = options;
			const properties = {
				x: x - width / 2,
				y: y - height / 2,
				width,
				height,
				options
			};
			me.updateElement(rects[i], index, properties, mode);
		}

		me.updateSharedOptions(sharedOptions, mode);
	}

	draw() {
		var me = this;
		var data = me.getMeta().data || [];
		var i, ilen;

		for (i = 0, ilen = data.length; i < ilen; ++i) {
			data[i].draw(me._ctx);
		}
	}
};

MatrixController.prototype.dataElementType = Rectangle;

MatrixController.prototype.dataElementOptions = [
	'backgroundColor',
	'borderColor',
	'borderWidth',
	'width',
	'height'
];
