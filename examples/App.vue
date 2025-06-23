<template>
  <div class="app">
    <h1>Multiple Date Picker 示例</h1>
    
    <div class="example-section">
      <h2>基础用法</h2>
      <div class="example-box">
        <MultipleDatePicker v-model="selectedDates" />
      </div>
    </div>
    
    <div class="example-section">
      <h2>禁用状态</h2>
      <div class="example-box">
        <MultipleDatePicker v-model="disabledDates" disabled />
      </div>
    </div>
    
    <div class="example-section">
      <h2>最大选择数量</h2>
      <div class="example-box">
        <MultipleDatePicker v-model="maxDates" :max-date="3" />
      </div>
    </div>
    
    <div class="example-section">
      <h2>禁用指定日期</h2>
      <div class="example-box">
        <MultipleDatePicker 
          v-model="disabledSpecificDates" 
          :disabled-dates="disableDatesFunction"
        />
      </div>
    </div>
    
    <div class="example-section">
      <h2>周末和节假日高亮</h2>
      <div class="example-box">
        <MultipleDatePicker 
          v-model="holidaySelectedDates" 
          :holidays="holidayData"
          :highlight-weekend="true"
        />
      </div>
      <div class="legend">
        <div class="legend-item">
          <div class="color-box weekend"></div>
          <span>周末</span>
        </div>
        <div class="legend-item">
          <div class="color-box holiday"></div>
          <span>法定节假日</span>
        </div>
        <div class="legend-item">
          <div class="color-box workday"></div>
          <span>调休工作日</span>
        </div>
        <div class="legend-item">
          <div class="color-box selected"></div>
          <span>已选择</span>
        </div>
      </div>
      <div class="holiday-list">
        <h3>2023年部分节假日安排：</h3>
        <el-table :data="holidayTableData" style="width: 100%" size="small">
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column prop="name" label="节日名称" width="150" />
          <el-table-column prop="type" label="类型">
            <template #default="scope">
              <el-tag :type="scope.row.type === 'holiday' ? 'danger' : 'success'" size="small">
                {{ scope.row.type === 'holiday' ? '法定节假日' : '调休工作日' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElTable, ElTableColumn, ElTag } from 'element-plus'
import MultipleDatePicker from '../src/components/MultipleDatePicker.vue'

// 基础用法
const selectedDates = ref<Date[]>([])

// 禁用状态
const disabledDates = ref<Date[]>([])

// 最大选择数量
const maxDates = ref<Date[]>([])

// 禁用指定日期
const disabledSpecificDates = ref<Date[]>([])
const disableDatesFunction = (date: Date) => {
  // 禁用所有周末
  const day = date.getDay()
  return day === 0 || day === 6
}

// 周末和节假日高亮
interface Holiday {
  date: string;
  name: string;
  type: 'holiday' | 'workday';
}

const holidaySelectedDates = ref<Date[]>([])

// 2023年部分节假日数据
const holidayData = ref<Holiday[]>([
  // 元旦
  { date: '2023-12-30', name: '元旦', type: 'holiday' },
  { date: '2023-12-31', name: '元旦', type: 'holiday' },
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

// 表格展示用数据
const holidayTableData = computed(() => {
  return holidayData.value.map(item => ({
    date: item.date,
    name: item.name,
    type: item.type
  }))
})
</script>

<style lang="scss">
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  
  h1 {
    margin-bottom: 30px;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
  }
}

.example-section {
  margin-bottom: 40px;
  
  h2 {
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 500;
  }
  
  .example-box {
    width: 300px;
    margin-bottom: 20px;
  }
}

.legend {
  display: flex;
  margin-top: 20px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
  margin-bottom: 10px;
}

.color-box {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border-radius: 2px;
}

.color-box.weekend {
  background-color: #f56c6c;
  opacity: 0.7;
}

.color-box.holiday {
  background-color: #f56c6c;
  position: relative;
}

.color-box.holiday::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #fff;
}

.color-box.workday {
  background-color: #67c23a;
  position: relative;
}

.color-box.workday::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #fff;
}

.color-box.selected {
  background-color: #409EFF;
}

.holiday-list {
  margin-top: 20px;
  
  h3 {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>