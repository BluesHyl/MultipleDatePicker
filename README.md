# Multiple Date Picker

一个基于 Vue 3 和 Element Plus 的多日期选择组件，允许用户在日历界面中选择多个日期。

## 特性

- 基于 Vue 3 和 Element Plus
- 支持选择多个日期
- 支持设置最大选择数量限制
- 支持禁用特定日期
- 支持节假日和周末高亮显示
- 支持法定节假日和调休工作日标记
- 支持自定义日期单元格样式
- 响应式设计
- TypeScript 支持

## 安装

```bash
npm install multiple-date-picker
```

## 使用方法

### 基本用法

```vue
<template>
  <MultipleDatePicker
    v-model="selectedDates"
    @change="handleDateChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { MultipleDatePicker } from 'multiple-date-picker'

const selectedDates = ref([])

const handleDateChange = (dates) => {
  console.log('Selected dates:', dates)
}
</script>
```

### 禁用状态

```vue
<template>
  <MultipleDatePicker
    v-model="selectedDates"
    disabled
  />
</template>

<template setup>
import { ref } from 'vue'
import { MultipleDatePicker } from 'multiple-date-picker'

const selectedDates = ref([])
</script>
```

### 最大选择数量

```vue
<template>
  <MultipleDatePicker
    v-model="selectedDates"
    :max-date="3"
  />
</template>
```
<script setup>
import { ref } from 'vue'
import { MultipleDatePicker } from 'multiple-date-picker'

const selectedDates = ref([])
</script>
```

### 禁用特定日期

```vue
<template>
  <MultipleDatePicker
    v-model="selectedDates"
    :disabled-dates="disableDatesFunction"
  />
</template>

<script setup>
import { ref } from 'vue'
import { MultipleDatePicker } from 'multiple-date-picker'

const selectedDates = ref([])
const disableDatesFunction = (date) => {
  // 禁用所有周末
  const day = date.getDay()
  return day === 0 || day === 6
}
</script>
```

### 节假日和周末高亮

```vue
<template>
  <MultipleDatePicker
    v-model="selectedDates"
    :holidays="holidayData"
    :highlight-weekend="true"
  />
</template>

<script setup>
import { ref } from 'vue'
import { MultipleDatePicker } from 'multiple-date-picker'

const selectedDates = ref([])

// 节假日数据
const holidayData = ref([
  // 元旦
  { date: '2024-01-01', name: '元旦', type: 'holiday' },
  
  // 春节
  { date: '2024-02-10', name: '春节', type: 'holiday' },
  { date: '2024-02-11', name: '春节', type: 'holiday' },
  { date: '2024-02-12', name: '春节', type: 'holiday' },
  { date: '2024-02-13', name: '春节', type: 'holiday' },
  { date: '2024-02-14', name: '春节', type: 'holiday' },
  { date: '2024-02-15', name: '春节', type: 'holiday' },
  { date: '2024-02-16', name: '春节', type: 'holiday' },
  { date: '2024-02-17', name: '春节', type: 'holiday' },
  
  // 调休工作日
  { date: '2024-02-04', name: '调休', type: 'workday' },
  { date: '2024-02-18', name: '调休', type: 'workday' },
])
</script>
```

## API

### Props

| 属性名 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| modelValue / v-model | `Date[]` | `[]` | 选中的日期数组 |
| disabled | `Boolean` | `false` | 是否禁用组件 |
| disabledDates | `Function` | `null` | 自定义禁用日期的函数，参数为日期对象，返回 `true` 表示禁用该日期 |
| format | `String` | `'YYYY-MM-DD'` | 日期显示格式 |
| valueFormat | `String` | `'YYYY-MM-DD'` | 日期值格式 |
| valueFormatType | `String` | `'string'` | 日期值类型，可选值：`'timestamp'`、`'string'`、`'date'` |
| maxDate | `Number` | `Infinity` | 最大可选择日期数量 |
| holidays | `Array` | `[]` | 节假日数据数组，每项包含 `date`、`name` 和 `type` 属性 |
| highlightWeekend | `Boolean` | `true` | 是否高亮显示周末 |

### 节假日数据格式

```typescript
interface Holiday {
  date: string;      // 日期，格式：YYYY-MM-DD
  name: string;      // 节日名称
  type: 'holiday' | 'workday';  // 类型：节假日或调休工作日
}
```

### 事件

| 事件名 | 参数 | 描述 |
| --- | --- | --- |
| change | `(dates: Date[]) => void` | 选中日期变化时触发 |
| update:modelValue | `(dates: Date[]) => void` | 更新 v-model 绑定值时触发 |

## 样式定制

组件使用 Element Plus 的变量系统，可以通过覆盖 CSS 变量来自定义样式：

```css
:root {
  --el-color-primary: #409eff;       /* 主色调，用于选中日期 */
  --el-color-danger: #f56c6c;        /* 危险色，用于周末和节假日 */
  --el-color-success: #67c23a;       /* 成功色，用于调休工作日 */
}
```

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建库

```bash
npm run build
```

### 构建示例应用

```bash
npm run build:example
```

## 许可证

MIT