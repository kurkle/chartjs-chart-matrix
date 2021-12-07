import {
  BorderRadius,
  Chart,
  ChartType,
  ChartComponent,
  CommonElementOptions,
  CommonHoverOptions,
  ControllerDatasetOptions,
  DatasetController,
  Element,
  ScriptableAndArrayOptions,
  ScriptableContext,
  VisualElement
} from 'chart.js';
import { AnyObject } from 'chart.js/types/basic';

export interface MatrixControllerDatasetOptions<TType extends ChartType>
  extends ControllerDatasetOptions,
  ScriptableAndArrayOptions<MatrixOptions, ScriptableContext<TType>>,
  ScriptableAndArrayOptions<CommonHoverOptions, ScriptableContext<TType>> {
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
      metaExtensions: AnyObject;
      scales: keyof CartesianScaleTypeRegistry;
    }
  }
}

export interface MatrixProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type AnchorX = 'left' | 'center' | 'right';
export type AnchorY = 'top' | 'center' | 'bottom';
export interface MatrixOptions extends CommonElementOptions {
  borderRadius: number | BorderRadius;
  anchorX: AnchorX;
  anchorY: AnchorY;
  width: number;
  height: number;
}

export type MatrixController = DatasetController;
export const MatrixController: ChartComponent & {
  prototype: MatrixController;
  new (chart: Chart, datasetIndex: number): MatrixController;
};

export interface MatrixElement<
  T extends MatrixProps = MatrixProps,
  O extends MatrixOptions = MatrixOptions
> extends Element<T, O>, VisualElement {}

export const MatrixElement: ChartComponent & {
  prototype: MatrixElement;
  new (cfg: AnyObject): MatrixElement;
};
