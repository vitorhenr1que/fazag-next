
import { useState, useEffect } from "react";
import { PostDestaque } from "../components/FazagInforma/PostDestaque";
import { Postlist } from "../components/FazagInforma/PostList";
import avatarfazag from '../public/images/logo-fazag.png'
import { api } from "../services/api";
import styles from '../styles/fazaginfo.module.scss'


const testPosts = [
    {
        image: 'https://images.ecycle.com.br/wp-content/uploads/2021/05/20195924/o-que-e-paisagem.jpg',
        date: '31 de agosto de 2022',
        title: 'Titulo 1',
        description: 'Mussum Ipsum, cacilds vidis litro abertis. In elementis mé pra quem é amistosis quis leo.Quem manda na minha terra sou euzis!Admodum accumsan disputationi eu sit. Vide electram sadipscing et per.Todo mundo vê os porris que eu tomo.'
    },
    {
        image: 'https://www.estudokids.com.br/wp-content/uploads/2020/02/o-que-e-paisagem-1200x675.jpg',
        date: '31 de agosto de 2022',
        title: 'Titulo 2',
        description: 'Mussum Ipsum, cacilds vidis litro abertis. Pra lá , depois divoltis porris, paradis.Aenean aliquam molestie leo, vitae iaculis nisl.Praesent malesuada urna nisi, quis volutpat erat hendrerit non. Nam vulputate dapibus.Manduma pindureta quium dia nois paga.'
    },
    {
        image: 'https://cdn.shopify.com/s/files/1/0001/9202/0527/products/quadros-democrart-gustavo-jacob-paisagem-baixa-luz-milford-sound-NZ-galeria-de-arte-obras-de-arte_875x.jpg?v=1528207674',
        date: '31 de agosto de 2022',
        title: 'Titulo 3',
        description: 'Mussum Ipsum, cacilds vidis litro abertis. Interessantiss quisso pudia ce receita de bolis, mais bolis eu num gostis.Si num tem leite então bota uma pinga aí cumpadi!Manduma pindureta quium dia nois paga.Per aumento de cachacis, eu reclamis.'
    },
    {
        image: 'https://cdn.leroymerlin.com.br/products/papel_de_parede_paisagem_lago_natureza_sala_painel_052pcp_1567477748_af15_600x600.jpg',
        date: '31 de agosto de 2022',
        title: 'Titulo 4',
        description: 'Mussum Ipsum, cacilds vidis litro abertis. Interessantiss quisso pudia ce receita de bolis, mais bolis eu num gostis.Sapien in monti palavris qui num significa nadis i pareci latim.Casamentiss faiz malandris se pirulitá.Diuretics paradis num copo é motivis de denguis.'
    },
    {
        image: 'https://3.bp.blogspot.com/-JXOKBhitPjU/V2v_yxqaTzI/AAAAAAAAADo/_fZEO81oq2oeudlSrXpm3Cyzamns9KytACLcB/s1600/NATUREZA_1.jpg',
        date: '05 de setembro de 2022',
        title: 'Titulo 5',
        description: 'Mussum Ipsum, cacilds vidis litro abertis. Interessantiss quisso pudia ce receita de bolis, mais bolis eu num gostis.Sapien in monti palavris qui num significa nadis i pareci latim.Casamentiss faiz malandris se pirulitá.Diuretics paradis num copo é motivis de denguis.'
    }
    
]


export default function Fazaginfo(){

const [Posts, setPosts] = useState([testPosts]);

// setPost receberá a arr final (Response da promise) -> setPosts(response.data)



useEffect(() => {

    async function getPosts(){
        try {
           const response = await api.get('posts/allposts')
           const {allPosts} = await response.data
           await setPosts(allPosts.reverse())
          
      } catch (error) {
          console.log(error)}
    }
        
    getPosts()    
    
    },[])
    
return (

    

    <div>
        <div className={styles.cabecalho}>
        <h1 className={styles.title}>FAZAG Informa</h1>
        <hr className={styles.hr} />
        </div>

    <div className={`${styles.fazaginforma} container`}>
    
        { Posts && Posts.length > 0 && <PostDestaque variavelRecebida={Posts[0]}/>}
        <div className={styles.order}>
        <Postlist props={Posts}/>
        </div>

    </div>
    </div>
    
    
)
}