import Navbar from '../components/Navbar/Navbar'
import CreateKudoBar from '../components/CreateKudoBar/CreateKudoBar'
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import Link from 'next/link'
import NextImage from 'next/image'
import 'emoji-mart/css/emoji-mart.css'
import { BaseEmoji, Picker } from 'emoji-mart'
import { EmojiEmotions } from '@material-ui/icons';
import axios from '../services/Axios';
import { Tabs } from '../components/CreateKudoBar/CreateKudoBar';
import classes from '../styles/NewKudo.module.scss';
import DebounceTextInput, { Option } from '../components/DebounceTextInput/DebounceTextInput';
import AutoCompleteOption from '../components/AutoCompleteOption/AutoCompleteOption';
import { AutocompleteRenderInputParams } from '@material-ui/lab';

interface TagEvent {
    eventId: string;
    eventTitle: string;
    tagName: string;
}

export default function NewKudo() {
    const [theme, setTheme] = useState("");
    const [kudoText, setKudoText] = useState("");
    const [emojiPopup, setEmojiPopup] = useState(false);
    const [autoCompleteOptions, setAutoCompleteOptions] = useState<Option[]>([]);
    const [selectedAutoCompleteOption, setSelectedAutoCompleteOption] = useState<Option | null>(null);
    const canvas = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const theme = localStorage.getItem('kudoTheme')
        if (theme) {
            setTheme(theme)
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

    const createKudo = () => {
        const image = new Image();
        image.src = theme;
        const canv = canvas.current;
        if (!canv) return
        const ctx2d = canv.getContext('2d');
        if (!ctx2d) return
        image.onload = () => {
            ctx2d.drawImage(image, 0, 0, 1000, 1000);
            wrapText(ctx2d, kudoText);
            ctx2d.font = "30px caption";
            if (selectedAutoCompleteOption) {
                ctx2d.fillText(selectedAutoCompleteOption.mainText, 160, 800);
            }
            const imageUrl = canv.toDataURL('image/webp');
            sendKudo(imageUrl)
        };
    }

    const sendKudo = async (imageUrl: string) => {
        const formData = new FormData();
        formData.append('kudoImage', new File([imageUrl], "kudo.webp", {
            type: 'image/webp'
        }));
        //temp id's
        formData.append('senderId', "4e636f54-841d-4967-a6a5-ba922e7235ea");
        formData.append('receiverId', "e1d5e4d8-1ee4-402b-92a9-c89632216b19");
        if (selectedAutoCompleteOption) formData.append('eventId', selectedAutoCompleteOption!.id);
        //todo rename 
        await axios.post(
            '/kudo/create', formData,
            false
        );
    }

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

    const handleSelectChange = (option: Option | null) => {
        setSelectedAutoCompleteOption(option);
    }

    const handleDebounceComplete = async (inputValue: string) => {
        const response = (await axios.get<TagEvent[]>(`event/with-owned-tag?event-name=${inputValue}`));
        if (!response) return;
        const options = response.data.map<Option>(te => {
            return {
                id: te.eventId,
                mainText: te.eventTitle,
                subText: te.tagName
            }
        })

        setAutoCompleteOptions(options);
    }

    const handleDebounceCancel = () => {
        setAutoCompleteOptions([]);
    }

    const renderOption = (option: Option) => {
        return (
            <AutoCompleteOption mainText={option.mainText} subText={option.subText} />
        )
    }

    const renderInput = (params: AutocompleteRenderInputParams) => {
        return (
            <div ref={params.InputProps.ref}>
                <input type="text" placeholder="event/tag" {...params.inputProps} />
            </div>
        )
    }

    return (
        <>
            <div className={classes.contentHolder}>
                <Navbar />
                <h1 >Create Kudo</h1>
                <CreateKudoBar tab={Tabs.Kudo} />
                <div className={classes.image}>
                    {theme && <NextImage src={theme} alt="kudo" layout="fill" />}
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
                        <DebounceTextInput
                            options={autoCompleteOptions}
                            selectedOption={selectedAutoCompleteOption}
                            //todo id mappen
                            onSelectChange={handleSelectChange}
                            onDebounceComplete={handleDebounceComplete}
                            onDebounceCancel={handleDebounceCancel}
                            renderOption={renderOption}
                            renderInput={renderInput}
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
                    <input type="text" placeholder="Name" />
                </div>
            </div>

            <div className={classes.buttonHolder}>
                <Link href="/">
                    <a >Cancel</a>
                </Link>
                <Link href="/">
                    <a onClick={createKudo}>Create Kudo</a>
                </Link>
            </div>
            <canvas ref={canvas} width="1000" height="1000" id="canvas" className={classes.canvas}></canvas>
        </>
    )
}
