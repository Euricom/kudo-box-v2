import classes from './CreateKudoForm.module.scss';
import { EmojiEmotions } from '@material-ui/icons';
import { ChangeEvent, TextareaHTMLAttributes, useContext, useState } from 'react';
import DebounceAutoComplete, { Option } from '../DebounceAutoComplete/DebounceAutoComplete';
import { BaseEmoji, Picker } from 'emoji-mart';
import { AutocompleteRenderInputParams } from '@material-ui/lab';
import ValidatableInput from '../ValidatableInput/ValidateableInput';
import AutoCompleteOption from '../AutoCompleteOption/AutoCompleteOption';
import { useHttpEventClient, useHttpUserClient } from '../../hooks/clients';
import { useToasts } from 'react-toast-notifications';
import NewKudo from '../../domain/newKudo';
import GlobalFormError from '../GlobalFormError/GlobalFormError';
import { ShowErrorContext } from '../../pages/NewKudo';

interface Props {
    theme: string;
    kudo: NewKudo;
    errors: string[];
    onKudoTextChange: (text: string) => void;
    onEventSelect: (option: Option | null) => void;
    onUserSelect: (option: Option | null) => void;
}

const CreateKudoForm = ({ theme, kudo, errors, onKudoTextChange, onEventSelect, onUserSelect }: Props) => {
    const [emojiPopup, setEmojiPopup] = useState<boolean>(false);
    const [eventAutoCompleteOptions, setEventAutoCompleteOptions] = useState<Option[]>([]);
    const [userAutoCompleteOptions, setUserAutoCompleteOptions] = useState<Option[]>([]);

    const showErrorContext = useContext(ShowErrorContext);

    const { addToast } = useToasts();
    const { getEventsWithOwnedTag } = useHttpEventClient();
    const { getUserByName } = useHttpUserClient();

    const handleEventsDebounceComplete = async (inputValue: string) => {
        try {
            const eventTags = await getEventsWithOwnedTag(inputValue);
            const options = eventTags.map<Option>(te => {
                return {
                    id: te.eventId,
                    mainText: te.eventTitle,
                    subText: te.tagName
                }
            })
            setEventAutoCompleteOptions(options);
        } catch (error) {
            addToast('Getting events failed failed', {
                appearance: 'error',
                autoDismiss: true,
                placement: 'top-center'
            });
        }
    }

    const handleUsersDebounceComplete = async (inputValue: string) => {
        try {
            const users = await getUserByName(inputValue);
            const options = users.map<Option>(u => {
                return {
                    id: u.id,
                    mainText: `${u.firstName} ${u.lastName}`
                }
            })
            setUserAutoCompleteOptions(options);
        } catch (error) {
            addToast('Getting User Failed', {
                appearance: 'error',
                autoDismiss: true,
                placement: 'top-center'
            });
        }
    }

    const openEmojiPopup = () => setEmojiPopup(!emojiPopup);

    const addEmoji = (selectedEmoji: BaseEmoji): void => {
        onKudoTextChange(kudo.text + selectedEmoji.native);
        setEmojiPopup(!emojiPopup);
    };

    const handleChangeKudoText = (e: ChangeEvent<HTMLTextAreaElement>) => onKudoTextChange(e.target.value)

    const handleEventDebounceCancel = () => setEventAutoCompleteOptions([]);

    const handleUserDebounceCancel = () => setUserAutoCompleteOptions([]);


    const renderEventInput = (params: AutocompleteRenderInputParams) =>
        <ValidatableInput
            placeholder="Event/Tag"
            autocompleteRef={params.InputProps.ref}
            autocompleteInputProps={params.inputProps}
        />

    const renderUserInput = (params: AutocompleteRenderInputParams) =>
        <ValidatableInput
            placeholder="Name"
            autocompleteRef={params.InputProps.ref}
            autocompleteInputProps={params.inputProps}
        />

    const renderOption = (option: Option) => <AutoCompleteOption mainText={option.mainText} subText={option.subText} />

    return (
        <div className={classes.formWrapper}>
            <div className={classes.imageHolder}>
                {theme && <img src={theme} alt="kudo" className={classes.image} />}
                <button
                    className={classes.emojiButton}
                    onClick={openEmojiPopup}>
                    <EmojiEmotions className={classes.icon} />
                </button>
                <textarea
                    value={kudo.text}
                    onChange={handleChangeKudoText}
                    placeholder="Write something nice !"
                    className={classes.kudoText}
                />
                <div className={classes.tags}>
                    <DebounceAutoComplete
                        options={eventAutoCompleteOptions}
                        selectedOption={kudo.selectedEvent}
                        onSelectChange={onEventSelect}
                        onDebounceComplete={handleEventsDebounceComplete}
                        onDebounceCancel={handleEventDebounceCancel}
                        renderOption={renderOption}
                        renderInput={renderEventInput}
                    />
                </div>
            </div>

            {emojiPopup && <Picker
                title=""
                style={{ position: 'absolute', top: '10vh', left: '10vw', width: '70vw' }}
                onSelect={addEmoji}
            />}

            <div className={classes.to}>
                <label>To:</label>
                <DebounceAutoComplete
                    options={userAutoCompleteOptions}
                    selectedOption={kudo.selectedUser}
                    onSelectChange={onUserSelect}
                    onDebounceComplete={handleUsersDebounceComplete}
                    onDebounceCancel={handleUserDebounceCancel}
                    renderOption={renderOption}
                    renderInput={renderUserInput}
                />
            </div>
            {showErrorContext && errors.length > 0 && <GlobalFormError errors={errors} />}
        </div>
    )
}

export default CreateKudoForm;