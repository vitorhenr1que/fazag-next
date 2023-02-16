import Galeria from "../../components/Galeria";

export default function EventosInstitucionais(){

    const images = [
        {
           src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
           width: 320,
           height: 174,
        },
        {
           src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
           width: 320,
           height: 212,
           alt: "Boats (Jeshu John - designerspics.com)",
        },
     
        {
           src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
           width: 320,
           height: 212,
        },
        {
            src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
            width: 320,
            height: 212,
            
          },
          {
            src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
            width: 320,
            height: 212,
           
          },
          {
            src: "https://c7.staticflickr.com/9/8546/28354329294_bb45ba31fa_b.jpg",
            width: 320,
            height: 213,
            
          },
     ];
return (
    <div className="container">
        <h1>Eventos Institucionais</h1>
        <Galeria name={"SICFAZ 2022"} images={images}/>
        <Galeria name={"FEIRA INTERDISCIPLINAR"} images={images}/>
    </div>
    
)
}