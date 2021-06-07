import Navbar from '../components/Navbar/Navbar'
import PageTab from '../components/PageTab/PageTab'
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import Link from 'next/link'
import 'emoji-mart/css/emoji-mart.css'
import { BaseEmoji, Picker } from 'emoji-mart'
import { EmojiEmotions } from '@material-ui/icons';
import { Tabs } from '../components/PageTab/PageTab';
import classes from '../styles/NewKudo.module.scss';
import DebounceAutoComplete, { Option } from '../components/DebounceAutoComplete/DebounceAutoComplete';
import AutoCompleteOption from '../components/AutoCompleteOption/AutoCompleteOption';
import { AutocompleteRenderInputParams } from '@material-ui/lab';
import { useHttpKudoClient, useHttpEventClient, useHttpUserClient } from '../hooks/clients'
import { useToasts } from 'react-toast-notifications';
import { useRouter } from 'next/router';

export default function NewKudo() {
    const [theme, setTheme] = useState("");
    const [kudoText, setKudoText] = useState("");
    const [emojiPopup, setEmojiPopup] = useState(false);
    const [eventAutoCompleteOptions, setEventAutoCompleteOptions] = useState<Option[]>([]);
    const [userAutoCompleteOptions, setUserAutoCompleteOptions] = useState<Option[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Option | null>(null);
    const [selectedUser, setSelectedUser] = useState<Option | null>(null);
    const { createKudo } = useHttpKudoClient();
    const { getEventsWithOwnedTag } = useHttpEventClient();
    const { getUserByName } = useHttpUserClient();
    const router = useRouter()
    const { addToast } = useToasts();
    const canvas = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const theme = router.query.image;
        const eventId = router.query.eventId;
        const eventTitle = router.query.eventTitle;
        if (theme) {
            setTheme(theme as string)
        }
        if (eventId && eventTitle) {
            setSelectedEvent({ id: eventId as string, mainText: eventTitle as string })
        }
    }, [])

    const addEmoji = (selectedEmoji: BaseEmoji): void => {
        setKudoText(kudoText + selectedEmoji.native);
        setEmojiPopup(!emojiPopup);
    };

    const handleTypedText = (text: ChangeEvent<HTMLTextAreaElement>): void => {
        setKudoText(text.target.value)
    }

    const onAddEmojiClick = () => {
        setEmojiPopup(!emojiPopup);
    };

    const createKudoImage = () => {
        const image = new Image();
        image.src = theme;
        const canv = canvas.current;
        if (!canv) return
        const ctx2d = canv.getContext('2d');
        if (!ctx2d) return
        image.onload = () => {
            ctx2d.drawImage(image, 0, 0, 1000, 1000);
            wrapText(ctx2d, kudoText);

            const imageUrl = canv.toDataURL('image/webp');
            try {
                createKudo(imageUrl, selectedUser?.id, selectedEvent?.id)
                router.push('/');
                addToast('Kudo Created Successfully', {
                    appearance: 'success',
                    autoDismiss: true,
                    placement: 'top-center'
                });
            } catch (error) {
                addToast('Kudo Creation Failed', {
                    appearance: 'error',
                    autoDismiss: true,
                    placement: 'top-center'
                });
            }
        };
    };

    const wrapText = (context: CanvasRenderingContext2D, text: string) => {
        let x = 160;
        let y = 310;
        let maxWidth = 700;
        let lineHeight = 70;
        let words = text.split(' ');
        let line = '';
        context.font = "36px cursive";

        words.forEach((word, index) => {
            let currentLine = line + word + ' ';
            let currentLineWidth = context.measureText(currentLine).width;
            if (currentLineWidth > maxWidth && index > 0) {
                context.fillText(line, x, y);
                line = word + ' ';
                y += lineHeight;
            } else {
                line = currentLine;
            }
        })
        context.fillText(line, x, y);
    }

    const handleEventSelectChange = (option: Option | null) => {
        setSelectedEvent(option);
    }
    const handleUserSelectChange = (option: Option | null) => {
        setSelectedUser(option);
    }

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

    const handleEventDebounceCancel = () => {
        setEventAutoCompleteOptions([]);
    }

    const handleUserDebounceCancel = () => {
        setUserAutoCompleteOptions([]);
    }

    const renderOption = (option: Option) => {
        return (
            <AutoCompleteOption mainText={option.mainText} subText={option.subText} />
        )
    }

    const renderEventInput = (params: AutocompleteRenderInputParams) => {
        return (
            <div ref={params.InputProps.ref}>
                <input type="text" placeholder="event/tag" {...params.inputProps} />
            </div>
        )
    }

    const renderUserInput = (params: AutocompleteRenderInputParams) => {
        return (
            <div ref={params.InputProps.ref}>
                <input type="text" placeholder="Name" {...params.inputProps} />
            </div>
        )
    }

    return (
        <>
            <div className={classes.contentHolder}>
                <Navbar />
                <h1 >Create Kudo</h1>
                <PageTab
                    isRouting={true}
                    firstTab={{ text: 'Scan', href: '/ScanKudo' }}
                    secondTab={{ text: 'Create', href: '/ChooseTheme' }}
                    selectedTab={Tabs.SECOND}
                />

                <div className={classes.imageHolder}>
                    {theme && <img src={theme} alt="kudo" className={classes.image} />}
                    <button
                        className={classes.emojiButton}
                        onClick={onAddEmojiClick}>
                        <EmojiEmotions className={classes.icon} />
                    </button>
                    <textarea
                        value={kudoText}
                        onChange={handleTypedText}
                        placeholder="Write something nice !"
                        className={classes.kudoText}
                    />
                    <div className={classes.tags}>
                        <DebounceAutoComplete
                            options={eventAutoCompleteOptions}
                            selectedOption={selectedEvent}
                            onSelectChange={handleEventSelectChange}
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
                        selectedOption={selectedUser}
                        onSelectChange={handleUserSelectChange}
                        onDebounceComplete={handleUsersDebounceComplete}
                        onDebounceCancel={handleUserDebounceCancel}
                        renderOption={renderOption}
                        renderInput={renderUserInput}
                    />
                </div>
            </div>

            <div className={classes.buttonHolder}>
                <Link href="/">
                    <a >Cancel</a>
                </Link>
                <Link href="/">
                    <a onClick={createKudoImage}>Create Kudo</a>
                </Link>
            </div>
            <canvas ref={canvas} width="1000" height="1000" id="canvas" className={classes.canvas}></canvas>
        </>
    )
}
