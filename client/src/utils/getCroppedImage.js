export default function getCroppedImage(image, canvas, crop, fileName){
    return new Promise((resolve, reject) => {
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error ("No 2d content");

        const pixelRatio = window.devicePixelRatio;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const widthCSS = crop.width * scaleX;
        const heightCSS = crop.height * scaleY;

        canvas.width = Math.floor(widthCSS * pixelRatio);
        canvas.height = Math.floor(heightCSS * pixelRatio);

        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = "high";
        ctx.save();

        const cropX = crop.x * scaleX;
        const cropY = crop.y * scaleY;

        ctx.translate(-cropX, -cropY);
        ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight);

        canvas.toBlob(blob => {
            const file = new File([blob], fileName, {type: blob.type});
            resolve(file);
        })

        ctx.restore();
    })
}