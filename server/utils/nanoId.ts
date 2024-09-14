import { customAlphabet } from 'nanoid'
import { alphanumeric } from './const'

const nanoId = customAlphabet(alphanumeric, 6)

export default nanoId
