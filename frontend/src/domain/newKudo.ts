import { Option } from "../components/DebounceAutoComplete/DebounceAutoComplete";

export default interface NewKudo {
    text: string;
    selectedEvent: Option | null;
    selectedUser: Option | null;
}