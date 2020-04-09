import { EmumBase } from './EnumBase'

const FormEnum = {
  'INPUT': new EmumBase(1, '输入框'),
  'TEXTAREA': new EmumBase(2, '文本框'),
  'SELECT': new EmumBase(3, '下拉框'),
  'DATE': new EmumBase(4, '日期框'),
  'RADIO': new EmumBase(5, '单选框'),
  'CHECKBOX': new EmumBase(6, '多选框'),
  'INPUTNUMBER ': new EmumBase(7, '计数器')
}
export default FormEnum
