import classes from "../styles/EventRoom.module.scss";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar/NavBar";
import { BasicKudo, EventRoom as Er, TagEvent } from "../domain";
import { useHttpEventClient } from "../hooks/clients";
import useWsKudoClient from "../hooks/clients/ws/useWsKudoClient";
import EventRoomInfo from "../components/EventRoomInfo/EventRoomInfo";
import { EventRoomInfo as Eri } from '../domain';
import SearchIcon from '@material-ui/icons/Search';
import DebounceAutoComplete, { Option } from "../components/DebounceAutoComplete/DebounceAutoComplete";
import Search from "../components/Search/Search";
import AutoCompleteOption from "../components/AutoCompleteOption/AutoCompleteOption";
import { AutocompleteRenderInputParams } from "@material-ui/lab";

interface Props {

}

const EventRoom = ({ }: Props) => {
    const [eventRoom, setEventRoom] = useState<Er | undefined>()
    const [tagEvents, setTagEvents] = useState<TagEvent[]>([]);
    const [currentEvent, setCurrentEvent] = useState<TagEvent | undefined>();

    const { joinEventRoom, connect } = useWsKudoClient(handleNewKudo);
    const { getWsEventRoomUrl, getEventsWithOwnedTag } = useHttpEventClient();

    useEffect(() => {
        (async function () {
            // if unauthorized --> do not connect
            const wsUrl = await getWsEventRoomUrl();
            connect(wsUrl);
        })()
    }, [])

    useEffect(() => {
        if (!currentEvent) return;

        joinEventRoom(currentEvent.eventId, handleKudosReceive);
    }, [currentEvent])

    useEffect(() => {
        console.log(eventRoom);
    }, [eventRoom])

    const handleEventSelect = (option: Option | null) => {
        if (!option) return setCurrentEvent(undefined);
        console.log(option);
        setCurrentEvent(tagEvents.find((te) => te.eventId.toUpperCase() === option.id.toUpperCase()))
    }

    const handleKudosReceive = (eventRoom: Er) => {
        setEventRoom(eventRoom);
    }

    function handleNewKudo(kudo: BasicKudo) {
        if (!eventRoom) return;
        setEventRoom({ ...eventRoom, kudos: [...eventRoom.kudos, kudo] });
    }

    const handleSearchDebounceComplete = async (eventFilterValue: string) => {
        const tagEvents = await getEventsWithOwnedTag(eventFilterValue);
        setTagEvents(tagEvents);
    }

    const handleSearchDebounceCancel = () => {
        setTagEvents([]);
    }

    const renderSearchInput = (params: AutocompleteRenderInputParams): JSX.Element => {
        return (
            <div ref={params.InputProps.ref}>
                <Search
                    renderPreIcon={() => <SearchIcon />}
                    autocompleteInputProps={params.inputProps}
                />
            </div>
        )
    }

    const renderOption = (option: Option): JSX.Element => {
        return <AutoCompleteOption mainText={option.mainText} subText={option.subText} />
    }

    const mapTagEventToOption = (tagEvent: TagEvent): Option => {
        return {
            id: tagEvent.eventId,
            mainText: tagEvent.eventTitle,
            subText: tagEvent.tagName
        } as Option
    }

    return (
        <div>
            <NavBar />
            <div className={classes.contentWrapper}>
                <div className={eventRoom && eventRoom.eventRoomInfo ? classes.headerWrapper : classes['headerWrapper-justifyEnd']}>
                    {eventRoom && <EventRoomInfo eventInfo={eventRoom.eventRoomInfo} />}
                    <DebounceAutoComplete
                        options={tagEvents.map(te => mapTagEventToOption(te))}
                        selectedOption={currentEvent ? mapTagEventToOption(currentEvent) : null}
                        onDebounceComplete={handleSearchDebounceComplete}
                        onDebounceCancel={handleSearchDebounceCancel}
                        onSelectChange={handleEventSelect}
                        renderOption={renderOption}
                        renderInput={renderSearchInput}
                    />
                </div>
            </div>
        </div>
    );
}

export default EventRoom;