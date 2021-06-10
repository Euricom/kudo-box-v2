import classes from "./EventRoomInfo.module.scss";
import { EventRoomInfo as Eri } from "../../domain";

interface Props {
    eventInfo: Eri;
}

const EventRoomInfo = ({eventInfo}: Props) => {
    const getFullname = () => {
        return `${eventInfo.firstnameHost} ${eventInfo.lastnameHost}`
    }

    return(
        <div className={classes.infoWrapper}>
            <h2>{eventInfo.title}</h2>
            <h3>#{eventInfo.tagName}</h3>
            <span>By {getFullname()}</span>
        </div>
    )
}

export default EventRoomInfo;