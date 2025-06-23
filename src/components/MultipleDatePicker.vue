<template>
  <div class="multiple-date-picker">
    <el-popover
      v-model:visible="visible"
      trigger="click"
      placement="bottom"
      :width="320"
      :popper-style="{ padding: '0px' }"
      :teleported="true"
    >
      <template #reference>
        <el-input
          v-model="displayValue"
          placeholder="选择多个日期"
          :readonly="true"
          :disabled="disabled"
          size="default"
        >
          <template #suffix>
            <el-icon class="el-input__icon"><calendar /></el-icon>
          </template>
        </el-input>
      </template>
      <div class="ep-picker">
        <!-- 自定义日历组件 -->
        <div class="ep-picker-panel">
          <div class="ep-picker-panel__header">
            <button type="button" class="ep-picker-panel__icon-btn" @click="prevMonth">
              <el-icon><arrow-left /></el-icon>
            </button>
            <span class="ep-picker-panel__header-label">{{ currentMonthYear }}</span>
            <button type="button" class="ep-picker-panel__icon-btn" @click="nextMonth">
              <el-icon><arrow-right /></el-icon>
            </button>
          </div>
          
          <div class="ep-picker-panel__content">
            <div class="ep-date-table">
              <div class="ep-date-table__header">
                <span v-for="day in weekDays" :key="day" class="cell">{{ day }}</span>
              </div>
              
              <div class="ep-date-table__body">
                <div
                  v-for="(day, index) in calendarDays"
                  :key="`day-${index}`"
                  class="cell"
                  :class="{
                    'disabled': day.disabled,
                    'prev-month': day.otherMonth && day.isPrevMonth,
                    'next-month': day.otherMonth && day.isNextMonth,
                    'current': !day.otherMonth,
                    'selected': isDateSelected(day.date),
                    'today': isToday(day.date),
                    'start': isStartOfMonth(day.date) && !day.otherMonth,
                    'end': isEndOfMonth(day.date) && !day.otherMonth,
                    'weekend': isWeekend(index),
                    ...getCellCustomClass(day.date)
                  }"
                  @click="!day.disabled && toggleDateSelection(day.date)"
                >
                  <div class="cell-content">{{ day.day }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="ep-picker-selected">
          <div class="ep-picker-selected__header">
            <span>已选择日期{{ props.maxDate !== Infinity ? ` (最多${props.maxDate}个)` : '' }}</span>
            <button 
              v-if="tempSelectedDates.length > 0" 
              type="button" 
              class="ep-picker-selected__clear-btn"
              @click="clearSelectedDates"
            >
              清空
            </button>
          </div>
          <div class="ep-picker-selected__content">
            <el-tag
              v-for="(date, index) in tempSelectedDates"
              :key="index"
              closable
              size="small"
              effect="light"
              @close="removeDate(index)"
              class="date-tag"
            >
              {{ formatDate(date) }}
            </el-tag>
            <div v-if="tempSelectedDates.length === 0" class="ep-picker-selected__empty">
              暂无选择日期
            </div>
            <div v-if="maxDateReached" class="ep-picker-selected__tip">
              已达到最大选择数量
            </div>
          </div>
        </div>
        
        <div class="ep-picker-footer">
          <el-button type="primary" size="small" @click="confirmSelection">确认</el-button>
          <el-button size="small" @click="closePopover">取消</el-button>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits, defineOptions } from 'vue'
import { ElInput, ElPopover, ElIcon, ElButton, ElTag } from 'element-plus'
import { Calendar,ArrowLeft,ArrowRight } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

defineOptions({ name: 'MultipleDatePicker' })

type DateType = Date

interface Holiday {
  date: string;
  name: string;
  type: 'holiday' | 'workday';
}

const props = defineProps({
  modelValue: {
    type: Array as () => DateType[],
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  },
  disabledDates: {
    type: Function,
    default: null
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD'
  },
  valueFormat: {
    type: String,
    default: 'YYYY-MM-DD'
  },
  valueFormatType: {
    type: String,
    default: 'string',
    validator: (val: string) => ['timestamp', 'string', 'date'].includes(val)
  },
  maxDate: {
    type: Number,
    default: Infinity,
    validator: (val: number) => val > 0
  },
  holidays: {
    type: Array as () => Holiday[],
    default: () => []
  },
  highlightWeekend: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const visible = ref(false)
const selectedDates = ref<DateType[]>([])
const tempSelectedDates = ref<DateType[]>([])
const currentMonth = ref(dayjs().month())
const currentYear = ref(dayjs().year())
const weekDays = ['日', '一', '二', '三', '四', '五', '六']
const maxDateReached = computed(() => props.maxDate !== Infinity && tempSelectedDates.value.length >= props.maxDate)
// 初始化选中的日期
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && Array.isArray(newVal)) {
      // 将字符串日期转换为Date对象
      const dates = [...newVal].map(date => {
        if (typeof date === 'number') {
          // 处理时间戳
          return new Date(date)
        } else if (props.valueFormat && typeof date === 'string') {
          // 处理格式化的日期字符串
          return dayjs(date, props.valueFormat).toDate()
        }
        return new Date(date as string | Date)
      })
      
      // 如果有最大数量限制，则只取前maxDate个
      selectedDates.value = props.maxDate !== Infinity ? dates.slice(0, props.maxDate) : dates
    }
  },
  { immediate: true, deep: true }
)

// 监听弹窗显示状态
watch(
  () => visible.value,
  (isVisible) => {
    if (isVisible) {
      // 打开弹窗时，复制当前已选择的日期作为临时选择
      tempSelectedDates.value = [...selectedDates.value].map(date => new Date(date))
      
      // 如果有已选日期，默认显示第一个已选日期所在的月份
      if (selectedDates.value.length > 0) {
        const firstDate = selectedDates.value[0]
        currentMonth.value = firstDate.getMonth()
        currentYear.value = firstDate.getFullYear()
      }
    }
  }
)

// 当前月份年份显示
const currentMonthYear = computed(() => {
  return `${currentYear.value}年${currentMonth.value + 1}月`
})

// 日历天数计算
const calendarDays = computed(() => {
  const days: Array<{
    day: number;
    date: Date;
    disabled: boolean;
    otherMonth: boolean;
    isPrevMonth: boolean;
    isNextMonth: boolean;
  }> = [];
  
  const firstDayOfMonth = dayjs(new Date(currentYear.value, currentMonth.value, 1))
  const lastDayOfMonth = dayjs(new Date(currentYear.value, currentMonth.value + 1, 0))
  
  // 前一个月的天数填充
  const prevMonthDays = firstDayOfMonth.day()
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const prevDate = firstDayOfMonth.subtract(i + 1, 'day')
    days.push({
      day: prevDate.date(),
      date: prevDate.toDate(),
      disabled: isDateDisabled(prevDate.toDate()),
      otherMonth: true,
      isPrevMonth: true,
      isNextMonth: false
    })
  }
  
  // 当前月的天数
  for (let i = 1; i <= lastDayOfMonth.date(); i++) {
    const currentDate = dayjs(new Date(currentYear.value, currentMonth.value, i))
    days.push({
      day: i,
      date: currentDate.toDate(),
      disabled: isDateDisabled(currentDate.toDate()),
      otherMonth: false,
      isPrevMonth: false,
      isNextMonth: false
    })
  }
  
  // 下一个月的天数填充
  const nextMonthDays = 42 - days.length
  for (let i = 1; i <= nextMonthDays; i++) {
    const nextDate = lastDayOfMonth.add(i, 'day')
    days.push({
      day: nextDate.date(),
      date: nextDate.toDate(),
      disabled: isDateDisabled(nextDate.toDate()),
      otherMonth: true,
      isPrevMonth: false,
      isNextMonth: true
    })
  }
  
  return days
})

// 格式化显示值
const displayValue = computed(() => {
  if (selectedDates.value.length === 0) return ''
  
  // 对显示值中的日期进行排序
  const sortedDates = [...selectedDates.value].sort((a, b) => a.getTime() - b.getTime())
  
  if (sortedDates.length <= 2) {
    return sortedDates.map((date) => formatDate(date)).join(', ')
  }
  return `已选择 ${sortedDates.length} 个日期`
})

// 判断日期是否被禁用
function isDateDisabled(date: Date): boolean {
  // 如果已经达到最大选择数量，且该日期未被选中，则禁用
  if (maxDateReached.value && !isDateSelected(date)) {
    return true
  }
  
  if (props.disabledDates) {
    return props.disabledDates(date)
  }
  return false
}

// 判断日期是否被选中 (使用临时选择的数据)
function isDateSelected(date: Date): boolean {
  return tempSelectedDates.value.some((d) => {
    return dayjs(d).format('YYYY-MM-DD') === dayjs(date).format('YYYY-MM-DD')
  })
}

// 判断是否是今天
function isToday(date: Date): boolean {
  return dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
}

// 切换日期选择 (操作临时选择的数据)
function toggleDateSelection(date: Date): void {
  const index = tempSelectedDates.value.findIndex((d) => {
    return dayjs(d).format('YYYY-MM-DD') === dayjs(date).format('YYYY-MM-DD')
  })
  
  if (index >= 0) {
    // 如果已选择，移除
    tempSelectedDates.value.splice(index, 1)
  } else {
    // 如果未选择，且未达到最大选择数量，则添加
    if (!maxDateReached.value) {
      tempSelectedDates.value.push(date)
    }
  }
}

// 前一个月
function prevMonth(): void {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

// 下一个月
function nextMonth(): void {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// 格式化日期
function formatDate(date: DateType): string {
  return dayjs(date).format(props.format)
}

// 自定义格式化日期 - 用于v-model
function formatDateForModel(date: DateType): string | number | Date {
  if (props.valueFormat) {
    if (props.valueFormatType === 'timestamp') {
      return date.getTime()
    } else if (props.valueFormatType === 'string') {
      return dayjs(date).format(props.valueFormat)
    }
  }
  return date
}

// 移除日期 (从临时选择中移除)
function removeDate(index: number): void {
  tempSelectedDates.value.splice(index, 1)
}

// 清空选择的日期 (清空临时选择)
function clearSelectedDates(): void {
  tempSelectedDates.value = []
}

// 确认选择
function confirmSelection(): void {
  // 将临时选择的日期进行排序后更新到实际选择中
  const sortedDates = [...tempSelectedDates.value].sort((a, b) => a.getTime() - b.getTime())
  selectedDates.value = sortedDates
  
  // 根据valueFormat转换日期格式后再提交
  const formattedDates = props.valueFormat 
    ? sortedDates.map(date => formatDateForModel(date))
    : sortedDates
    
  emit('update:modelValue', formattedDates)
  emit('change', formattedDates)
  visible.value = false
}

// 关闭弹出框 (取消操作)
function closePopover(): void {
  // 不保存临时选择的日期
  visible.value = false
}

// 判断是否是周末
function isWeekend(index: number): boolean {
  // 0 和 6 分别对应周日和周六
  return index % 7 === 0 || index % 7 === 6;
}

// 判断是否是月初
function isStartOfMonth(date: Date): boolean {
  return date.getDate() === 1;
}

// 判断是否是月末
function isEndOfMonth(date: Date): boolean {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return date.getDate() === lastDay;
}

// 获取单元格自定义类名
function getCellCustomClass(date: Date): Record<string, boolean> {
  const classes: Record<string, boolean> = {};
  const dateStr = dayjs(date).format('YYYY-MM-DD');
  
  // 查找是否是节假日
  const holiday = props.holidays.find(h => h.date === dateStr);
  
  if (holiday) {
    classes['holiday'] = holiday.type === 'holiday';
    classes['workday'] = holiday.type === 'workday';
    classes[`holiday-${holiday.name}`] = true; // 可以根据节假日名称添加特定类名
  }
  
  return classes;
}
</script>

<style lang="scss" scoped>
.multiple-date-picker,.el-popover {
  width: 100%;
  
  .ep-picker {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    color: var(--el-text-color-regular, #606266);
    background-color: #fff;
    box-shadow: var(--el-box-shadow-light, 0 0 12px rgba(0, 0, 0, 0.12));
    
    .ep-picker-panel {
      &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        padding: 6px 20px;
        margin-bottom: 6px;
        font-weight: 500;
        border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5);
        
        &-label {
          font-size: 16px;
          font-weight: 500;
          color: var(--el-text-color-primary, #303133);
          line-height: 22px;
        }
      }
      
      &__icon-btn {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        height: 24px;
        padding: 0;
        color: var(--el-text-color-primary, #606266);
        border: none;
        background-color: transparent;
        cursor: pointer;
        outline: none;
        
        &:hover {
          color: var(--el-color-primary);
        }
      }
      
      &__content {
        padding: 0 20px 12px;
      }
    }
    
    .ep-date-table {
      width: 100%;
      border-collapse: collapse;
      
      &__header {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        margin-bottom: 8px;
        
        .cell {
          padding: 6px 0;
          text-align: center;
          color: var(--el-text-color-regular, #606266);
          font-weight: 500;
          line-height: 16px;
        }
      }
      
      &__body {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-auto-rows: 32px;
        
        .cell {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          z-index: 1;
          cursor: pointer;
          
          &-content {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 30px;
            height: 30px;
            border-radius: 4px;
            font-size: 14px;
            transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            z-index: 1;
          }
          
          &:hover:not(.disabled) .cell-content {
            color: var(--el-color-primary);
            background-color: var(--el-color-primary-light-9, #ecf5ff);
          }
          
          &.weekend:not(.selected):not(.today):not(.disabled) {
            color: var(--el-color-danger);
            
            &:hover .cell-content {
              color: var(--el-color-danger);
              background-color: var(--el-color-danger-light-9);
            }
          }
          
          &.holiday:not(.selected):not(.today):not(.disabled) {
            color: var(--el-color-danger);
            font-weight: 600;
            
            .cell-content::after {
              content: '';
              position: absolute;
              bottom: 2px;
              left: 50%;
              transform: translateX(-50%);
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background-color: var(--el-color-danger);
            }
            
            &:hover .cell-content {
              color: var(--el-color-danger);
              background-color: var(--el-color-danger-light-9);
            }
          }
          
          &.workday:not(.selected):not(.today):not(.disabled) {
            color: var(--el-color-success);
            
            .cell-content::after {
              content: '';
              position: absolute;
              bottom: 2px;
              left: 50%;
              transform: translateX(-50%);
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background-color: var(--el-color-success);
            }
            
            &:hover .cell-content {
              color: var(--el-color-success);
              background-color: var(--el-color-success-light-9);
            }
          }
          
          &.disabled {
            color: var(--el-text-color-placeholder, #c0c4cc);
            cursor: not-allowed;
            background-color: transparent;
          }
          
          &.prev-month,
          &.next-month {
            color: var(--el-text-color-placeholder, #c0c4cc);
          }
          
          &.selected .cell-content {
            color: #fff;
            font-weight: 700;
            background-color: var(--el-color-primary);
            box-shadow: none;
          }
          
          &.today .cell-content {
            color: var(--el-color-primary);
            font-weight: 700;
            border: 1px solid var(--el-color-primary);
            box-shadow: none;
          }
          
          &.today.selected .cell-content {
            color: #fff;
            border: none;
            box-shadow: none;
          }
        }
      }
    }
    
    .ep-picker-selected {
      margin-top: 8px;
      padding: 12px 20px;
      border-top: 1px solid var(--el-border-color-lighter, #ebeef5);
      
      &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        font-size: 14px;
        color: var(--el-text-color-primary, #303133);
      }
      
      &__clear-btn {
        padding: 0;
        font-size: 13px;
        color: var(--el-color-primary);
        background: none;
        border: none;
        cursor: pointer;
        outline: none;
        
        &:hover {
          color: var(--el-color-primary-light-3);
        }
      }
      
      &__content {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        max-height: 120px;
        overflow-y: auto;
        padding-right: 5px;
        
        &::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        &::-webkit-scrollbar-thumb {
          border-radius: 3px;
          background-color: var(--el-border-color-lighter, rgba(144, 147, 153, 0.3));
        }
        
        &::-webkit-scrollbar-track {
          background-color: transparent;
        }
        
        .date-tag {
          margin-bottom: 4px;
          font-size: 12px;
        }
      }
      
      &__empty {
        padding: 8px 0;
        color: var(--el-text-color-secondary, #909399);
        font-size: 13px;
        text-align: center;
      }
      
      &__tip {
        width: 100%;
        padding: 4px 0;
        color: var(--el-color-danger);
        font-size: 12px;
        text-align: center;
      }
    }
    
    .ep-picker-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 10px 20px 14px;
      border-top: 1px solid var(--el-border-color-lighter, #ebeef5);
      
      .el-button + .el-button {
        margin-left: 8px;
      }
    }
  }
}
</style>