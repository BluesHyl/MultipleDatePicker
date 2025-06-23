import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MultipleDatePicker from '../MultipleDatePicker.vue'
import dayjs from 'dayjs'

describe('MultipleDatePicker', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(MultipleDatePicker, {
      props: {
        modelValue: []
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.multiple-date-picker').exists()).toBe(true)
    expect(wrapper.find('.el-calendar').exists()).toBe(true)
  })

  it('displays current month and year', async () => {
    const currentDate = new Date()
    const formattedDate = dayjs(currentDate).format('YYYY年 MM月')
    await nextTick()
    expect(wrapper.find('.calendar-title').text()).toBe(formattedDate)
  })

  it('emits update:modelValue when date is selected', async () => {
    const dateCell = wrapper.find('.date-cell')
    await dateCell.trigger('click')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0][0]).toBeInstanceOf(Array)
  })

  it('marks selected dates', async () => {
    const today = new Date()
    await wrapper.setProps({
      modelValue: [today]
    })
    
    const formattedDate = dayjs(today).format('YYYY-MM-DD')
    const selectedCell = wrapper.find(`.date-cell.is-selected`)
    expect(selectedCell.exists()).toBe(true)
  })

  it('disables dates before minDate', async () => {
    const today = new Date()
    await wrapper.setProps({
      minDate: today
    })
    
    const yesterday = dayjs(today).subtract(1, 'day').toDate()
    const formattedDate = dayjs(yesterday).format('YYYY-MM-DD')
    const disabledCell = wrapper.find(`.is-disabled`)
    expect(disabledCell.exists()).toBe(true)
  })

  it('disables dates after maxDate', async () => {
    const today = new Date()
    await wrapper.setProps({
      maxDate: today
    })
    
    const tomorrow = dayjs(today).add(1, 'day').toDate()
    const formattedDate = dayjs(tomorrow).format('YYYY-MM-DD')
    const disabledCell = wrapper.find(`.is-disabled`)
    expect(disabledCell.exists()).toBe(true)
  })

  it('disables specific dates', async () => {
    const today = new Date()
    await wrapper.setProps({
      disabledDates: [today]
    })
    
    const formattedDate = dayjs(today).format('YYYY-MM-DD')
    const disabledCell = wrapper.find(`.is-disabled`)
    expect(disabledCell.exists()).toBe(true)
  })

  it('applies custom cell class', async () => {
    const customClass = 'custom-cell'
    await wrapper.setProps({
      cellClass: () => customClass
    })
    
    const cell = wrapper.find(`.date-cell`)
    expect(cell.classes()).toContain(customClass)
  })

  it('navigates to previous month', async () => {
    const initialDate = wrapper.find('.calendar-title').text()
    await wrapper.find('.calendar-header button:first-child').trigger('click')
    const newDate = wrapper.find('.calendar-title').text()
    expect(newDate).not.toBe(initialDate)
  })

  it('navigates to next month', async () => {
    const initialDate = wrapper.find('.calendar-title').text()
    await wrapper.find('.calendar-header button:last-child').trigger('click')
    const newDate = wrapper.find('.calendar-title').text()
    expect(newDate).not.toBe(initialDate)
  })
})