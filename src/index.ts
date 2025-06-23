import MultipleDatePicker from './components/MultipleDatePicker.vue'
import type { MultipleDatePickerProps, MultipleDatePickerEmits } from './types'

export { MultipleDatePicker }
export type { MultipleDatePickerProps, MultipleDatePickerEmits }

export default {
  install: (app: any) => {
    app.component('MultipleDatePicker', MultipleDatePicker)
  }
}