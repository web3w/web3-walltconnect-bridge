import {INotification} from './types'
import {getNotification} from './keystore'
import { RequestInfo, RequestInit } from 'node-fetch';

const fetch = (url: RequestInfo, init?: RequestInit) =>
    import('node-fetch').then(({ default: fetch }) => fetch(url, init));

export const pushNotification = async (topic: string) => {
    console.log('notification.webhook')
    const notifications = await getNotification(topic)
    if (notifications && notifications.length) {

        for (const notification of notifications) {
            // notifications.forEach((notification: INotification) => {
            console.log('notification.webhook', notification.webhook)
            // fetch.post(notification.webhook, { topic })
            await fetch(notification.webhook, {method: 'POST', body: {topic}});
        }
    }
}
