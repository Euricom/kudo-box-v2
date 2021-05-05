import Navbar from '../components/Navbar'
import CreateKudoBar from '../components/CreateKudoBar'
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import Link from 'next/link'
// import Image from 'next/image'
import 'emoji-mart/css/emoji-mart.css'
import { Picker, PickerProps } from 'emoji-mart'
import { EmojiEmotions } from '@material-ui/icons';
import axios from '../services/Axios';
import { Tabs } from '../components/CreateKudoBar';
import classes from '../styles/NewKudo.module.scss';


export default function NewKudo() {
    const [theme, setTheme] = useState("");
    const [kudoText, setKudoText] = useState("");
    const [emojiPopup, setEmojiPopup] = useState(false);
    const canvas = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const theme = localStorage.getItem('kudoTheme')
        if (theme !== null) {
            setTheme(theme)
        }
    }, [])

    //thomas vragen
    const addEmoji = (selectedEmoji: any) => {
        setKudoText(kudoText + selectedEmoji.native);
        setEmojiPopup(!emojiPopup);
    };

    const handleTypedText = (text: ChangeEvent<HTMLTextAreaElement>): void => {
        setKudoText(text.target.value)
    }

    const onAddEmojiClick = () => {
        setEmojiPopup(!emojiPopup);
    };

    const createKudo = async () => {
        const ctx = canvas.current
        let imageUrl = ""
        if (ctx) {
            imageUrl = ctx.toDataURL('image/webp');
            const ctx2d = ctx.getContext('2d');
            if (ctx2d) {
                ctx2d.fillText(kudoText, 40, 45, 80);
            }
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
    }

    useEffect(() => {
        if (theme != null) {
            const image = new Image();
            image.src = theme;

            image.onload = () => {
                const ctx = canvas.current
                if (ctx) {
                    const ctx2d = ctx.getContext('2d');
                    if (ctx2d) {
                        ctx2d.drawImage(image, 0, 0, ctx.width, ctx.height);
                    }
                }

            }
        }
    }, [theme])

    return (
        <>
            <div className={classes.contentHolder}>
                <Navbar />
                <h1 className={classes.title}>Create Kudo</h1>
                <CreateKudoBar tab={Tabs.Kudo} />
                <div className={classes.image}>
                    <canvas ref={canvas} id="canvas" className={classes.canvas}></canvas>
                    {/* {theme && <Image src={theme} alt="kudo" layout="fill" />} */}
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
                    <input type="text" placeholder="Tags" className={classes.tags} />
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
                {/* <Link href="/"> */}
                <a onClick={createKudo}>Create Kudo</a>
                {/* </Link> */}
            </div>
        </>
    )
}
