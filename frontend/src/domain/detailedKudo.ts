import { User, Event } from './'

export interface DetailedKudo {
    Id: string,
    kudoImage: string,
    sendDateTime: Date,
    sender: User,
    receiver: User,
    event?: Event
}