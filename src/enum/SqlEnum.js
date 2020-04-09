import { EmumBase } from './EnumBase'

const SqlEnum = {
  'DENGYU': new EmumBase(1, '='),
  'DAYU': new EmumBase(2, '>='),
  'XIAOYU': new EmumBase(3, '<='),
  'BUDENGYU': new EmumBase(4, '!='),
  'LIKE': new EmumBase(5, 'Like'),
  'NOTNULL': new EmumBase(6, 'NOTNULL'),
  'BETWEEN': new EmumBase(7, 'BETWEEN')
}
export default SqlEnum
