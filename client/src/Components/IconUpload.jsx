import axios from "axios";
import React, { useRef, useState } from "react";
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import getCroppedImage from "../utils/getCroppedImage";

const minDimension = 150;
const aspectRatio = 1;

export default function FileUpload({ onUpload }){
    const API_URL = import.meta.env.VITE_API_URL;
    const iconRef = useRef(null);
    const canvasRef = useRef(null);

    const [iconSrc, setIconSrc] = useState("");
    const [crop, setCrop] = useState();
    const [buttonOpen, setButtonOpen] = useState(false);

    const onSelectFile = (e) => {
        setButtonOpen(false);
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const iconURL = reader.result;
            setIconSrc(iconURL);
        }
        reader.readAsDataURL(file);
    }

    const onIconLoad = (e) => {
        const { width, height } = e.currentTarget;
        const cropWidthInPercent = (minDimension / width) * 100;

        const crop = makeAspectCrop(
            { unit: "%", width: cropWidthInPercent}, 
            aspectRatio,
            width, 
            height
        );
        setCrop(centerCrop(crop, width, height));
        setButtonOpen(true);
    }

    const upload = async () => {
        const pixelCrop = convertToPixelCrop(crop, iconRef.current.width, iconRef.current.height );

        try{
            const file = await getCroppedImage(iconRef.current, canvasRef.current, pixelCrop);
        
            const formData = new FormData();
            formData.append("icon", file);
            const { data } = await axios.post(`${API_URL}/upload/icon`, formData, {withCredentials: true});

            if (onUpload) onUpload(data.iconURL);

        } catch (err){
            console.error(err);
        }
    }

    return (
        <>
        <div className="iconUploadContainer">

            <input className='iconUploadInput' type="file" accept="image/*" onChange={ onSelectFile } />

            { iconSrc && 
                <div className="iconCropperContainer">
                    <ReactCrop
                        crop={crop}
                        onChange={(percentCrop) => setCrop(percentCrop)}
                        circularCrop
                        keepSelection
                        aspect={aspectRatio}
                        minWidth={minDimension}
                    >
                        <img ref={iconRef} className="iconCropper" src={ iconSrc } alt="Uploaded Icon" onLoad={ onIconLoad } style={{maxHeight: "50vh"}}/>
                    </ReactCrop>
                </div>
            }

            {buttonOpen ? (
                <button className='iconUploadButton' onClick={upload}>Upload</button>
            ) : null }
        </div>

        {crop && 
            <canvas ref={canvasRef} style={{display: "none"}}/>
        }
        </>
    )





}
