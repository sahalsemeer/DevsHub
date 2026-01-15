import io from 'socket.io-client'
import { BASE_API } from './constants'


export const creatSocketConnection = () => {
    return io(BASE_API)
}

