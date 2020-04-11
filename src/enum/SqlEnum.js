import { EmumBase } from './EnumBase'

const SqlEnum = {
  'eq': new EmumBase(1, '='),
  'ge': new EmumBase(2, '>='),
  'le': new EmumBase(3, '<='),
  'ne': new EmumBase(4, '!='),
  'like': new EmumBase(5, 'like')
}
export default SqlEnum
