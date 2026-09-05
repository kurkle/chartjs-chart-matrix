import { Chart } from 'chart.js'

import MatrixController from './controller.js'
import MatrixElement from './element.js'

Chart.register(MatrixController, MatrixElement)

export type {
  AnchorX,
  AnchorY,
  MatrixControllerDatasetOptions,
  MatrixDataPoint,
  MatrixElement as MatrixElementType,
  MatrixOptions,
  MatrixParsedDataPoint,
  MatrixProps,
} from './types.js'

export { MatrixController, MatrixElement }
