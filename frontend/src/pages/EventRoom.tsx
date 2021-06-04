import classes from "../styles/EventRoom.module.scss";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar/NavBar";
import { BasicKudo, TagEvent } from "../domain";
import { useHttpEventClient } from "../hooks/clients";
import useWsKudoClient from "../hooks/clients/ws/useWsKudoClient";
import EventRoomInfo from "../components/EventRoomInfo/EventRoomInfo";
import { EventRoomInfo as Eri } from '../domain';
import DebouncedSearch from "../components/DebouncedSearch/DebouncedSearch";
import SearchIcon from '@material-ui/icons/Search';
import DebounceAutoComplete, { Option } from "../components/DebounceAutoComplete/DebounceAutoComplete";
import Search from "../components/Search/Search";
import AutoCompleteOption from "../components/AutoCompleteOption/AutoCompleteOption";
import { AutocompleteRenderInputParams } from "@material-ui/lab";

const eventIdVerjaardagJos = 'f14c73cd-133b-4944-af3a-883de2962267';

const eventRoomMock: Eri = {
    firstnameHost: 'Tim',
    lastnameHost: 'François',
    tagName: 'R101',
    title: 'React 101'
}

interface Props {

}

const EventRoom = ({ }: Props) => {
    const [kudos, setKudos] = useState<BasicKudo[]>([])
    const [searchEventValue, setSearchEventValue] = useState<string>();
    const [tagEvents, setTagEvents] = useState<TagEvent[]>([]);
    const [currentEvent, setCurrentEvent] = useState<TagEvent | undefined>();

    const { joinEventRoom, connect } = useWsKudoClient(handleNewKudo);
    const { getWsEventRoomUrl, getEventsWithOwnedTag } = useHttpEventClient();

    useEffect(() => {
        (async function () {
            const wsUrl = await getWsEventRoomUrl();
            connect(wsUrl);
        })()
    }, [])

    useEffect(() => {
        if (!currentEvent) return;

        joinEventRoom(currentEvent.eventId, handleKudosReceive);
    }, [currentEvent])

    const handleEventSelect = (option: Option | null) => {
        if (!option) return setCurrentEvent(undefined);
        setCurrentEvent(tagEvents.find((te) => te.eventId === option.id))
    }

    const handleKudosReceive = (kudos: BasicKudo[]) => {
        setKudos(kudos);
    }

    function handleNewKudo(kudo: BasicKudo) {
        setKudos([...kudos, kudo]);
    }

    const handleSearchInputChange = (eventFilterValue: string) => {
        setSearchEventValue(eventFilterValue);
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
                    onChange={handleSearchInputChange}
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
                <div className={classes.headerWrapper}>
                    <EventRoomInfo eventInfo={eventRoomMock} />
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