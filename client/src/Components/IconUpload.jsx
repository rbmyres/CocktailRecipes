import axios from "axios";
import React, { useRef, useState } from "react";
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import getCroppedImage from "../utils/getCroppedImage";
import { useLoading } from "../LoadingContext";
import toast from 'react-hot-toast';

const minDimension = 150;
const aspectRatio = 1;

export default function FileUpload({ onUpload }){
    const API_URL = import.meta.env.VITE_API_URL;
    const iconRef = useRef(null);
    const canvasRef = useRef(null);
    const { setLoading } = useLoading();

    const [iconSrc, setIconSrc] = useState("");
    const [crop, setCrop] = useState();
    const [buttonOpen, setButtonOpen] = useState(false);

    const onSelectFile = (e) => {
        setButtonOpen(false);
        const iconFile = e.target.files[0];
        if (!iconFile) return;

        const reader = new FileReader();
        reader.onload = () => {
            const iconURL = reader.result;
            setIconSrc(iconURL);
        }
        reader.readAsDataURL(iconFile);
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
        setLoading(true);
        const loadingToast = toast.loading("Uploading icon...");
        const pixelCrop = convertToPixelCrop(crop, iconRef.current.width, iconRef.current.height );

        try{
            const iconFile = await getCroppedImage(iconRef.current, canvasRef.current, pixelCrop, "user_icon.png");
        
            const formData = new FormData();
            formData.append("user_icon", iconFile);
            const { data } = await axios.post(`${API_URL}/upload/icon`, formData);

            toast.dismiss(loadingToast);
            toast.success("Icon uploaded successfully!");

            if (onUpload) onUpload(data.iconURL);

        } catch (err){
            console.error(err);
            toast.dismiss(loadingToast);
            toast.error("Failed to upload icon");
        } finally {
            setLoading(false);
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
