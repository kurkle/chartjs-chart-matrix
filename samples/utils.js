'use strict';

(function(Utils) {
	const chartjsUrl = 'https://cdn.jsdelivr.net/npm/chart.js/dist/chart.js';
	const dateFnsUrl = 'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.js';
	const localUrl = '../dist/chartjs-chart-matrix.js';
	const remoteUrl = 'https://cdn.jsdelivr.net/npm/chartjs-chart-matrix@next/dist/chartjs-chart-matrix.js';

	function addScript(url, done, error) {
		const head = document.getElementsByTagName('head')[0];
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.onreadystatechange = function() {
			if (this.readyState === 'complete') {
				done();
			}
		};
		script.onload = done;
		script.onerror = error;
		script.src = url;
		head.appendChild(script);
		return true;
	}

	function loadError() {
		const msg = document.createTextNode('Error loading chartjs-chart-matrix');
		document.body.appendChild(msg);
		return true;
	}

	Utils.load = function(done) {
		addScript(chartjsUrl, () => {
			addScript(dateFnsUrl, () => {
				addScript(localUrl, done, (event) => {
					event.preventDefault();
					event.stopPropagation();
					addScript(remoteUrl, done, loadError);
				});
			}, loadError);
		}, loadError);
	};
}(window.Utils = window.Utils || {}));
