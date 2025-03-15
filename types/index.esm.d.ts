import {
  BorderRadius,
  CartesianScaleTypeRegistry,
  Chart,
  ChartComponent,
  CommonElementOptions,
  CommonHoverOptions,
  ControllerDatasetOptions,
  CoreChartOptions,
  DatasetController,
  Element,
  ScriptableAndArrayOptions,
  ScriptableContext,
  VisualElement,
} from 'chart.js'

type AnyObject = Record<string, unknown>

export type AnchorX = 'left' | 'center' | 'right' | 'start' | 'end'
export type AnchorY = 'top' | 'center' | 'bottom' | 'start' | 'end'
export interface MatrixOptions extends Omit<CommonElementOptions, 'borderWidth'> {
  borderRadius: number | BorderRadius
  borderWidth: number | { top?: number; right?: number; bottom?: number; left?: number }
  anchorX: AnchorX
  anchorY: AnchorY
  width: number
  height: number
}
export interface MatrixControllerDatasetOptions
  extends ControllerDatasetOptions,
    ScriptableAndArrayOptions<MatrixOptions, ScriptableContext<'matrix'>>,
    ScriptableAndArrayOptions<CommonHoverOptions, ScriptableContext<'matrix'>> {}

export interface MatrixDataPoint {
  x: number
  y: number
}

declare module 'chart.js' {
  export interface ChartTypeRegistry {
    matrix: {
      chartOptions: CoreChartOptions<'matrix'>
      datasetOptions: MatrixControllerDatasetOptions
      defaultDataPoint: MatrixDataPoint
      parsedDataType: MatrixDataPoint
      metaExtensions: AnyObject
      scales: keyof CartesianScaleTypeRegistry
    }
  }
}

export interface MatrixProps {
  x: number
  y: number
  width: number
  height: number
  options?: Partial<MatrixOptions>
}

export type MatrixController = DatasetController
export const MatrixController: ChartComponent & {
  prototype: MatrixController
  new (chart: Chart, datasetIndex: number): MatrixController
}

export interface MatrixElement<T extends MatrixProps = MatrixProps, O extends MatrixOptions = MatrixOptions>
  extends Element<T, O>,
    VisualElement {}

export const MatrixElement: ChartComponent & {
  prototype: MatrixElement
  new (cfg: AnyObject): MatrixElement
}
