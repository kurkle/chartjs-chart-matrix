import {DatasetController} from 'chart.js';

export default class MatrixController extends DatasetController {

	update(mode) {
		const me = this;
		const meta = me._cachedMeta;

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
			const {width, height, anchorX, anchorY} = options;
			const properties = {
				x: anchorX === 'left' ? x : x - width / (anchorX === 'right' ? 1 : 2),
				y: anchorY === 'top' ? y : y - height / (anchorY === 'bottom' ? 1 : 2),
				width,
				height,
				options
			};
			me.updateElement(rects[i], index, properties, mode);
		}

		me.updateSharedOptions(sharedOptions, mode);
	}

	draw() {
		const me = this;
		const data = me.getMeta().data || [];
		let i, ilen;

		for (i = 0, ilen = data.length; i < ilen; ++i) {
			data[i].draw(me._ctx);
		}
	}
}

MatrixController.id = 'matrix';
MatrixController.defaults = {
	dataElementType: 'matrix',
	dataElementOptions: [
		'backgroundColor',
		'borderColor',
		'borderWidth',
		'anchorX',
		'anchorY',
		'width',
		'height'
	],

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
};

