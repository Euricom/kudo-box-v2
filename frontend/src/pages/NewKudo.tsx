import Drawer from '../components/Drawer/Drawer'
import PageTab from '../components/PageTab/PageTab'
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import Link from 'next/link'
import 'emoji-mart/css/emoji-mart.css'
import { Tabs } from '../components/PageTab/PageTab';
import classes from '../styles/NewKudo.module.scss';
import { useHttpKudoClient } from '../hooks/clients'
import { useToasts } from 'react-toast-notifications';
import { useRouter } from 'next/router';
import CreateKudoForm from '../components/CreateKudoForm/CreateKudoForm';
import { Option } from '../components/DebounceAutoComplete/DebounceAutoComplete';
import NewKudo from '../domain/newKudo';
import useNewKudoValidator from '../hooks/validation/useNewKudoValidator';

export const ShowErrorContext = React.createContext<boolean>(false);


export default function NewKudoPage() {
    const [theme, setTheme] = useState("");
    const [newKudo, setNewKudo] = useState<NewKudo>({
        text: '',
        selectedEvent: null,
        selectedUser: null
    })
    const [showError, setShowError] = useState<boolean>(false);

    const canvas = useRef<HTMLCanvasElement | null>(null);

    const router = useRouter()
    const { addToast } = useToasts();
    const { createKudo } = useHttpKudoClient();
    const { errors, validateGlobalErrors } = useNewKudoValidator();

    useEffect(() => {
        const theme = router.query.image;
        const eventId = router.query.eventId;
        const eventTitle = router.query.eventTitle;
        if (theme) setTheme(theme as string)
        if (eventId && eventTitle) {
            setNewKudo((prevState: NewKudo) => {
                return { ...prevState, selectedEvent: { id: eventId as string, mainText: eventTitle as string } }
            });
        }
    }, [router.query])

    useEffect(() => {
        if (showError) validateGlobalErrors(newKudo);
    }, [newKudo, showError])

    useEffect(() => {
        if (showError && errors.length === 0) toggleShowError();
    }, [errors])

    const handleKudoTextChange = (text: string): void => {
        setNewKudo((prevState: NewKudo) => {
            return { ...prevState, text };
        })
    }

    const handleEventSelect = (event: Option | null) => {
        setNewKudo((prevState: NewKudo) => {
            return { ...prevState, selectedEvent: event }
        })
    }

    const handleUserSelect = (option: Option | null) => {
        setNewKudo((prevState: NewKudo) => {
            return { ...prevState, selectedUser: option }
        })
    }

    const toggleShowError = () => setShowError(!showError);

    const handleSubmit = async () => {
        const errors = validateGlobalErrors(newKudo);
        if (errors.length > 0) return toggleShowError();

        const imageUrl = await createKudoImage();
        if (!imageUrl) return;

        try {
            await createKudo(imageUrl, newKudo.selectedUser?.id, newKudo.selectedEvent?.id)
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
    }

    async function createKudoImage(): Promise<string | undefined> {
        const image = new Image();
        image.src = theme;
        const canv = canvas.current;
        if (!canv) return
        const ctx2d = canv.getContext('2d');
        if (!ctx2d) return
        return new Promise((res, rej) => {
            image.onload = () => {
                ctx2d.drawImage(image, 0, 0, 1000, 1000);
                wrapText(ctx2d, newKudo.text);

                res(canv.toDataURL('image/webp'));
            }

            image.onerror = ((_event, _source, _lineo, _colno, error?: Error) => {
                rej(error);
            })
        })
    };

    const wrapText = (context: CanvasRenderingContext2D, text: string) => {
        let x = 160;
        let y = 310;
        let maxWidth = 700;
        let lineHeight = 70;
        let words = text.split(' ');
        let line = '';
        context.font = "36px arial";

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
        <ShowErrorContext.Provider value={showError}>
            <div className={classes.contentHolder}>
                <div className={classes.topHolder}>
                    <Drawer />
                    <h1 >Create Kudo</h1>
                </div>

                <CreateKudoForm
                    kudo={newKudo}
                    theme={theme}
                    errors={errors}
                    onKudoTextChange={handleKudoTextChange}
                    onEventSelect={handleEventSelect}
                    onUserSelect={handleUserSelect}
                />

                <div className={classes.buttonHolder}>
                    <Link href="/">
                        <a>Cancel</a>
                    </Link>
                    <button onClick={handleSubmit}>Create Kudo</button>
                </div>
            </div>
            <canvas ref={canvas} width="1000" height="1000" id="canvas" className={classes.canvas}></canvas>
        </ShowErrorContext.Provider>
    )
}
