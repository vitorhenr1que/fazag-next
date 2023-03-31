import Galeria from "../../components/Galeria";
import emBreve from '../../public/images/embreve.png'
export default function EventosInstitucionais(){

    const images = [
        {
           src: "http://wordpress-direta.s3.sa-east-1.amazonaws.com/wp-content/uploads/sites/5/2019/11/11150435/em-breve-1.png",
           width: 325,
           height: 363,
        },
        {
           src: "http://wordpress-direta.s3.sa-east-1.amazonaws.com/wp-content/uploads/sites/5/2019/11/11150435/em-breve-1.png",
           width: 325,
           height: 363,
           alt: "Boats (Jeshu John - designerspics.com)",
        },
     
        {
           src: "http://wordpress-direta.s3.sa-east-1.amazonaws.com/wp-content/uploads/sites/5/2019/11/11150435/em-breve-1.png",
           width: 325,
           height: 363,
        },
        {
            src: "http://wordpress-direta.s3.sa-east-1.amazonaws.com/wp-content/uploads/sites/5/2019/11/11150435/em-breve-1.png",
            width: 325,
            height: 363,
            
          },
          {
            src: "http://wordpress-direta.s3.sa-east-1.amazonaws.com/wp-content/uploads/sites/5/2019/11/11150435/em-breve-1.png",
            width: 325,
            height: 363,
           
          },
          {
            src: "http://wordpress-direta.s3.sa-east-1.amazonaws.com/wp-content/uploads/sites/5/2019/11/11150435/em-breve-1.png",
            width: 325,
            height: 363,
            
          },
     ];
return (
    <div className="container">
        <h1>Eventos Institucionais</h1>
        <Galeria name={"FEIRA INTERDISCIPLINAR"} images={images}/>
        <Galeria name={"SICFAZ"} images={images}/>
        
    </div>
    
)
}