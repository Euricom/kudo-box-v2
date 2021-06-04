import { BasicKudo } from "./basicKudo";
import { EventRoomInfo } from "./eventRoomInfo";

export interface EventRoom {
    eventRoomInfo: EventRoomInfo;
    kudos: BasicKudo[];
}