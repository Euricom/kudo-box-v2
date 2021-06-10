import { ChangeEvent, useRef } from 'react';
import classes from './PictureInput.module.scss';

interface Props {
    imageFile?: File;
    onImageChange: (e: File) => void;
}

const PictureInput = ({imageFile, onImageChange}: Props) => {
    const image = useRef<HTMLImageElement>(null);
    const label = useRef<HTMLLabelElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files || !e.target.files[0] || !image.current || !label.current) return;

        image.current.src = URL.createObjectURL(e.target.files[0]);
        label.current.innerText = "Change image"

        onImageChange(e.target.files[0]);
    }
    
    return (
        <div>
            <div className={classes.imgHolder}>
                <img ref={image} alt="event image" className={`${imageFile ? "" : classes.imageVis}`} />
            </div>

            <div className={classes.fileHolder}>
                <input type="file" name="image" id="file" accept="image/*"
                    onChange={handleChange} className={classes.file} />
                <label ref={label} className={classes.fileLabel} htmlFor="file">Choose an image</label>
            </div>
        </div>
    )
}

export default PictureInput;