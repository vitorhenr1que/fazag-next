import Image from 'next/image'
import banner2 from '../../../../public/images/banner2.jpg'
import styles from './style.module.scss' 

 export function Slide(){
    return (
        <div className={`slide ${styles.slide}`}>
          <div id={"carouselExampleIndicators"} className={"carousel slide"} data-bs-ride={"true"}>
            <div className={"carousel-indicators"}>
              <button type={"button"} data-bs-target={"#carouselExampleIndicators"} data-bs-slide-to={"0"} className={"active"} aria-current={"true"} aria-label={"Slide 1"}></button>
              <button type={"button"} data-bs-target={"#carouselExampleIndicators"} data-bs-slide-to={"1"} aria-label={"Slide 2"}></button>
              <button type={"button"} data-bs-target={"#carouselExampleIndicators"} data-bs-slide-to={"2"} aria-label={"Slide 3"}></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <Image priority quality={100} src={banner2} className={`d-block ${styles.imgSlide} w-100`} alt={"..."}/>
              </div>
          {/* <div className="carousel-item">
                <img src={bannerFAZAG} className={"d-block w-100"} alt={"..."}></img>
              </div>
              <div className="carousel-item">
                <img src={bannerFAZAG} className={"d-block w-100"} alt={"..."}></img> 
              </div> */}
            </div>
            <button className={"carousel-control-prev"} type={"button"} data-bs-target={"#carouselExampleIndicators"} data-bs-slide={"prev"}>
              <span className={"carousel-control-prev-icon"} aria-hidden={"true"}></span>
              <span className={"visually-hidden"}>Previous</span>
            </button>
            <button className={"carousel-control-next"} type={"button"} data-bs-target={"#carouselExampleIndicators"} data-bs-slide={"next"}>
              <span className={"carousel-control-next-icon"} aria-hidden={"true"}></span>
              <span className={"visually-hidden"}>Next</span>
            </button>
          </div>
        </div>
    )
 }