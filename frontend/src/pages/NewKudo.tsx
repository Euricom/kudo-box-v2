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
import { Autocomplete } from '@material-ui/lab';
import DebounceTextInput from '../components/DebounceTextInput/DebounceTextInput';


export default function NewKudo() {
    const [theme, setTheme] = useState("");
    const [kudoText, setKudoText] = useState("");
    const [emojiPopup, setEmojiPopup] = useState(false);
    const [tagText, setTagText] = useState<string>('');
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
        };
        const imageUrl = canv.toDataURL('image/webp');
        sendKudo(imageUrl)
    }

    const sendKudo = async (imageUrl: string) => {
        const formData = new FormData();
        formData.append('kudoImage', new File([imageUrl], "kudo.webp", {
            type: 'image/webp'
        }));
        //temp id's
        formData.append('senderId', "bdd002c9-51d9-4bea-a48a-46cc46eab912");
        formData.append('receiverId', "05983dd0-1995-4697-b741-4154ee945e7f");

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
                    {/* <input type="text" placeholder="Tags" className={classes.tags} /> */}
                    <div className={classes.tags}>
                        <DebounceTextInput 
                            
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
