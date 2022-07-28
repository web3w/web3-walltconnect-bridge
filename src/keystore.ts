import Redis from 'ioredis';
import {ISocketMessage, ISocketSub, INotification} from './types'
import {redisCfg} from './config/index.json'

const redisClient: Redis = new Redis(redisCfg)

const subs: ISocketSub[] = []

export const setSub = (subscriber: ISocketSub) => subs.push(subscriber)
export const getSub = (topic: string) => {
    if (topic === 'all') {
        return subs
    } else {
        return subs.filter(
            subscriber => subscriber.topic === topic && subscriber.socket.readyState === 1
        )
    }
}

// ------------------ Pub ------------------------------
// 增加 pub
export const setPub = (socketMessage: ISocketMessage) =>
    redisClient.lpush(
        `socketMessage:${socketMessage.topic}`,
        JSON.stringify(socketMessage),
    )

// 消费 topic del
export const getPub = async (topic: string): Promise<ISocketMessage[]> => {
    const data = await redisClient.lrange(`socketMessage:${topic}`, 0, -1)
    return data.map((item: string) =>
        JSON.parse(item)
    )
}

// ------------------ Notification ------------------------------
// 增加 notification
export const setNotification = (notification: INotification) => {
    const data = JSON.stringify(notification)
    return redisClient.lpush(`notification:${notification.topic}`, data)
}

// 获取 notification
export const getNotification = async (topic: string): Promise<INotification[]> => {
    const data = await redisClient.lrange(`notification:${topic}`, 0, -1)
    return data.map((item: string) => JSON.parse(item))
}
