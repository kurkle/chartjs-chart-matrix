# Usage

The chartjs-chart-matrix plugin provides matrix charts, which visualize data in a grid format using colored rectangular cells. Each cell represents a data point with three key properties:

- X-axis value (column position)
- Y-axis value (row position)
- Value (v) (represented by color intensity or another visual cue)

## Common Use Cases
1. Heatmaps – Show intensity variations across a grid, often used for:
   - Temperature variations
   - Website traffic heatmaps
   - Performance monitoring
2. Confusion Matrices – Used in machine learning to visualize classification performance.
3. Availability/Occupancy Grids – Indicate occupied vs. available slots in a schedule or seating arrangement.
4. Correlation Matrices – Display relationships between variables in datasets.

## Chart Features
- Supports linear, category, and time scales
- Customizable cell size (width & height)
- Dynamic color mapping for data values
- Interactive tooltips & legend integration

```js chart-editor
const config = {
  type: 'matrix',
  data: {
    datasets: [{
      label: 'Basic matrix',
      data: [{x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2}, {x: 2, y: 2}],
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.5)',
      backgroundColor: 'rgba(200,200,0,0.3)',
      width: ({chart}) => (chart.chartArea || {}).width / 2 - 1,
      height: ({chart}) => (chart.chartArea || {}).height / 2 - 1,
    }],
  },
  options: {
    scales: {
      x: {
        display: false,
        min: 0.5,
        max: 2.5,
        offset: false
      },
      y: {
        display: false,
        min: 0.5,
        max: 2.5
      }
    }
  }
};

module.exports = {
  config
};
```
