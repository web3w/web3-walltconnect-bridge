import Redis from 'ioredis';
import {ISocketMessage, ISocketSub, INotification} from './types'
import {redisCfg, expireSeconds} from './config/index.json'

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
export const setPub = async (socketMessage: ISocketMessage) => {
    const topicId = `socketMessage:${socketMessage.topic}`
    await redisClient.lpush(topicId, JSON.stringify(socketMessage))
    return redisClient.expire(topicId, expireSeconds)
}


// 消费 topic del
export const getPub = async (topic: string): Promise<ISocketMessage[]> => {
    const data = await redisClient.lrange(`socketMessage:${topic}`, 0, -1)
    return data.map((item: string) =>
        JSON.parse(item)
    )
}

// ------------------ Notification ------------------------------
// 增加 notification
export const setNotification = async (notification: INotification) => {
    const data = JSON.stringify(notification)
    const topicId = `notification:${notification.topic}`
    await redisClient.lpush(topicId, data)
    return redisClient.expire(topicId, expireSeconds)
}

// 获取 notification
export const getNotification = async (topic: string): Promise<INotification[]> => {
    const data = await redisClient.lrange(`notification:${topic}`, 0, -1)
    return data.map((item: string) => JSON.parse(item))
}
