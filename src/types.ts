import type {
  BorderRadius,
  CartesianScaleTypeRegistry,
  CommonElementOptions,
  CommonHoverOptions,
  ControllerDatasetOptions,
  CoreChartOptions,
  ScriptableAndArrayOptions,
  ScriptableContext,
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
  x: number | string
  y: number | string
  v?: number
}

export interface MatrixParsedDataPoint {
  x: number
  y: number
}

export interface MatrixProps {
  x: number
  y: number
  width: number
  height: number
  options?: Partial<MatrixOptions>
}

declare module 'chart.js' {
  export interface ChartTypeRegistry {
    matrix: {
      chartOptions: CoreChartOptions<'matrix'>
      datasetOptions: MatrixControllerDatasetOptions
      defaultDataPoint: MatrixDataPoint
      parsedDataType: MatrixParsedDataPoint
      metaExtensions: AnyObject
      scales: keyof CartesianScaleTypeRegistry
    }
  }
}
