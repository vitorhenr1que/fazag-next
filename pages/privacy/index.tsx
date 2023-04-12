import { getClient } from "../../services/prismic"
import styles from '../../styles/id.module.scss'

export default function Privacy(){
    return (
        <div className={`${styles.postContainer} container`}>
        <h1 className={styles.title}>Política de Privacidade do FAZAG App</h1>
        <p>
        O FAZAG App respeita a privacidade dos seus usuários e está comprometido em proteger suas informações pessoais. Esta política de privacidade explica como coletamos, usamos e protegemos as informações dos usuários do FAZAG App.
        </p>
        <ol>
            <li>
                <p>Coleta de Informações</p>
                <p>
                O FAZAG App pode coletar informações pessoais dos usuários, tais como nome, CPF e endereço de e-mail quando acessam o aplicativo.
                </p>
            </li>
            <li>
                <p>Uso das Informações</p>
                <p>
                As informações coletadas pelo FAZAG App são usadas para se comunicar com o Sistema da Instituição. Além disso, podemos utilizar essas informações para enviar comunicações relevantes aos usuários, como notificações de atualização.                
                </p>
            </li>
            <li>
                <p>Compartilhamento de Informações</p>
                <p>
                O FAZAG App não compartilha as informações pessoais dos usuários com terceiros, exceto quando for necessário para cumprir uma obrigação legal ou quando o usuário autorizar expressamente.                
                </p>
            </li>
            <li>
                <p>Segurança das Informações</p>
                <p>
                O FAZAG App adota medidas de segurança para proteger as informações dos usuários contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, não podemos garantir a segurança absoluta das informações transmitidas por meio da internet.
                </p>
            </li>
            <li>
                <p>Atualização da Política de Privacidade</p>
                <p>
                O FAZAG App se reserva o direito de atualizar esta política de privacidade a qualquer momento. A versão mais recente da política de privacidade estará sempre disponível no aplicativo.                
                </p>

                <p>
                Ao utilizar o FAZAG App, o usuário concorda com os termos desta política de privacidade. Se o usuário não concordar com estes termos, não deve utilizar o aplicativo.
                </p>
            </li>
        </ol>
        </div>
    )
    
}
