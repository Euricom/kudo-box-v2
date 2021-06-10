import classes from "../styles/EventRoom.module.scss";
import { useEffect, useState } from "react";
import {  EventRoom as Er, TagEvent } from "../domain";
import { useHttpEventClient } from "../hooks/clients";
import useWsKudoClient from "../hooks/clients/ws/useWsKudoClient";
import EventRoomInfo from "../components/EventRoomInfo/EventRoomInfo";
import Navbar from "../components/Navbar/Navbar";
import SearchIcon from '@material-ui/icons/Search';
import DebounceAutoComplete, { Option } from "../components/DebounceAutoComplete/DebounceAutoComplete";
import Search from "../components/Search/Search";
import AutoCompleteOption from "../components/AutoCompleteOption/AutoCompleteOption";
import { AutocompleteRenderInputParams } from "@material-ui/lab";
import KudoList from "../components/KudoList/KudoList";

const EventRoom = () => {
    const [tagEvents, setTagEvents] = useState<TagEvent[]>([]);
    const [currentEvent, setCurrentEvent] = useState<TagEvent | undefined>();

    const { eventRoom, joinEventRoom } = useWsKudoClient();
    const { getEventsWithOwnedTag } = useHttpEventClient();

    useEffect(() => {
        if (!currentEvent) return;

        joinEventRoom(currentEvent.eventId);
    }, [currentEvent])

    const handleEventSelect = (option: Option | null) => {
        if (!option) return setCurrentEvent(undefined);
        setCurrentEvent(tagEvents.find((te) => te.eventId.toUpperCase() === option.id.toUpperCase()))
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
        <div className={classes.pageWrapper}>
            <Navbar />
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

                {eventRoom && eventRoom.kudos && <KudoList kudos={eventRoom?.kudos} horizontal={true} />}
            </div>
        </div>
    );
}

export default EventRoom;