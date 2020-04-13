/* global Color */

export default {
	config: {
		type: 'matrix',
		data: {
			datasets: [{
				label: 'My Matrix',
				data: [
					{x: '2019-01-05', y: '08:00', v: 11},
					{x: '2019-01-01', y: '12:00', v: 12},
					{x: '2019-01-01', y: '16:00', v: 13},
					{x: '2019-01-02', y: '08:00', v: 21},
					{x: '2019-01-02', y: '12:00', v: 22},
					{x: '2019-01-02', y: '16:00', v: 23},
					{x: '2019-01-03', y: '08:00', v: 31},
					{x: '2019-01-03', y: '12:00', v: 32},
					{x: '2019-01-04', y: '16:00', v: 33}
				],
				backgroundColor: function(ctx) {
					var value = ctx.dataset.data[ctx.dataIndex].v;
					var alpha = (value - 5) / 40;
					return Chart.helpers.color('green').alpha(alpha).rgbString();
				},
				borderColor: function(ctx) {
					var value = ctx.dataset.data[ctx.dataIndex].v;
					var alpha = (value - 5) / 40;
					return Chart.helpers.color('green').alpha(alpha).darken(0.4).rgbString();
				},
				borderWidth: {left: 3, right: 3},
				width: function(ctx) {
					var a = ctx.chart.chartArea;
					if (!a) return 0;
					return (a.right - a.left) / 5.5;
				},
				height: function(ctx) {
					var a = ctx.chart.chartArea;
					if (!a) return 0;
					return (a.bottom - a.top) / 3.5;
				}
			}]
		},
		options: {
			animation: false,
			maintainAspectRatio: false,
			legend: {
				display: false
			},
			scales: {
				x: {
					type: 'time',
					offset: true,
					time: {
						unit: 'day'
					},
					ticks: {
						display: false
					},
					gridLines: {
						display: false
					}
				},
				y: {
					type: 'time',
					min: '06:00',
					max: '18:00',
					time: {
						unit: 'hour',
						parser: 'HH:mm',
						displayFormats: {
							hour: 'HH'
						}
					},
					reverse: false,
					ticks: {
						display: false
					},
					gridLines: {
						display: false
					}
				}
			}
		}
	},
	options: {
		canvas: {
			height: 256,
			width: 512
		}
	}
};
