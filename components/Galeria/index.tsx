import { useState } from "react";
import { Gallery } from "react-grid-gallery";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import styles from './style.module.scss'

interface GaleriaProps {
    name: string;
    images: (string | number | any)[];
}

export default function Galeria({name, images}: GaleriaProps){
    const [index, setIndex] = useState(-1)
    
     const currentImage = images[index]
     const handleClick = (index: number) => {setIndex(index)} 
     const handleClose = () => {setIndex(-1)}
    return (
        
       <div className={`container ${styles.containerGaleria}`}>
         <h3>{name}</h3>
         <Gallery 
         images={images} 
         onClick={handleClick}
         enableImageSelection={false}
         />

        {!!currentImage && 
        (<Lightbox
        open={!!index === true || index === 0 ? true : false}
        close={handleClose}
        index={index}
        styles={{container: {backgroundColor: 'rgba(0,0,0,.9)'}}}
        controller={{closeOnBackdropClick: true}}
        carousel={
            {
                finite: true,
                preload: 3,
                padding: 0,
                imageFit: 'contain'
            }
        }
        plugins={[Zoom]}
        zoom={
            {
                maxZoomPixelRatio: 2,
                zoomInMultiplier: 2,
                doubleTapDelay: 300,
                doubleClickDelay: 500,
                doubleClickMaxStops: 2,
                keyboardMoveDistance: 50,
                wheelZoomDistanceFactor: 100,
                pinchZoomDistanceFactor: 100,
                scrollToZoom: false
            }
        }
        slides={
           images
        }
        />)}
         

       </div>
        
    )
}