import { ControllerDatasetOptions, PointHoverOptions, PointOptions, ScriptableAndArrayOptions, ScriptableContext, ChartType, Scriptable } from 'chart.js';

export interface MatrixControllerDatasetOptions<TType extends ChartType>
  extends ControllerDatasetOptions,
  ScriptableAndArrayOptions<PointOptions, ScriptableContext<TType>>,
  ScriptableAndArrayOptions<PointHoverOptions, ScriptableContext<TType>> {

  width: Scriptable<number, ScriptableContext<TType>>,
  height: Scriptable<number, ScriptableContext<TType>>,
}

export interface MatrixDataPoint {
  x: number,
  y: number,
}

declare module 'chart.js' {
  export interface ChartTypeRegistry {
    matrix: {
      chartOptions: CoreChartOptions<'matrix'>;
      datasetOptions: MatrixControllerDatasetOptions<'matrix'>;
      defaultDataPoint: MatrixDataPoint;
      parsedDataType: MatrixDataPoint;
      scales: never;
    }
  }
}
