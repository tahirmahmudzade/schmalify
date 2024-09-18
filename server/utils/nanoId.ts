import { customAlphabet } from 'nanoid'
import { alphanumeric } from './const'

const useNanoId = customAlphabet(alphanumeric, 6)

export default useNanoId
