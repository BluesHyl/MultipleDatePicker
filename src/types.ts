export interface MultipleDatePickerProps {
  /**
   * 选中的日期数组
   * @default []
   */
  modelValue: Date[]
  
  /**
   * 可选择的最小日期
   */
  minDate?: Date
  
  /**
   * 可选择的最大日期
   */
  maxDate?: Date
  
  /**
   * 禁用的日期数组
   * @default []
   */
  disabledDates?: Date[]
  
  /**
   * 自定义日期单元格类名的函数
   */
  cellClass?: (params: { 
    date: Date, 
    isSelected: boolean, 
    isDisabled: boolean 
  }) => string | string[]
}

export interface MultipleDatePickerEmits {
  /**
   * 选中日期变化时触发
   */
  (e: 'change', dates: Date[]): void
  
  /**
   * 更新 v-model 绑定值时触发
   */
  (e: 'update:modelValue', dates: Date[]): void
}