import {INotification} from './types'
import {getNotification} from './keystore'
import fetch from "node-fetch";

export const pushNotification = async (topic: string) => {
    console.log('notification.webhook')
    const notifications = await getNotification(topic)
    if (notifications && notifications.length) {
        notifications.forEach((notification: INotification) => {
            console.log('notification.webhook', notification.webhook)
            // fetch.post(notification.webhook, { topic })
            fetch(notification.webhook, {method: 'POST', body: {topic}});
        })
    }
}
