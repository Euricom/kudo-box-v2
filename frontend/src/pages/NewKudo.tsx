import Navbar from '../components/Navbar'
import CreateKudoBar from '../components/CreateKudoBar'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'
// import Image from 'next/image'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { EmojiEmotions } from '@material-ui/icons';
import axios from '../services/Axios';
import classes from '../styles/NewKudo.module.scss';

export default function NewKudo() {
    const [theme, setTheme] = useState(null);
    const [createdKudo, setCreatedKudo] = useState(null);
    const [kudoText, setKudoText] = useState("");
    const [emojiPopup, setEmojiPopup] = useState(null);
    const canvas = useRef(null);

    useEffect(() => {
        setTheme(localStorage.getItem('kudoTheme'))
    }, [])

    const addEmoji = (selectedEmoji) => {
        let emoji = selectedEmoji.native;
        setKudoText(kudoText + emoji);
        setEmojiPopup(!emojiPopup);
    };

    const handleTypedText = (text) => {
        setKudoText(text.target.value)
    }

    const onAddEmojiClick = () => {
        setEmojiPopup(!emojiPopup);
    };

    const createKudo = async () => {
        const ctx = canvas.current.getContext('2d');
        ctx.fillText(kudoText, 80, 150, 150);
        console.log(ctx);
        const imageUrl = canvas.current.toDataURL('image/webp');
        const formData = new FormData();
        formData.append('kudoImage', new File([imageUrl], "kudo.webp", {
            type: 'image/webp'
        }));
        formData.append('senderId', "bdd002c9-51d9-4bea-a48a-46cc46eab912");
        formData.append('receiverId', "05983dd0-1995-4697-b741-4154ee945e7f");

        console.log(formData)
        await axios.post(
            '/kudo/create', formData,
            false
        );
    }

    useEffect(() => {
        if (theme != null) {
            const image = new Image();
            image.src = theme;
            const ctx = canvas.current.getContext('2d');
            image.onload = () => {
                ctx.drawImage(image, 0, 0, canvas.current.width, canvas.current.height);
            }
            setCreatedKudo(image.src)
        }
    }, [theme])

    return (
        <>
            <div className={classes.contentHolder}>
                <Navbar />
                <h1 className={classes.title}>Create Kudo</h1>
                <CreateKudoBar tab={2} />
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
                <Link href="/">
                    <a onClick={createKudo}>Create Kudo</a>
                </Link>
            </div>
        </>
    )
}
