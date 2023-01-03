import styles from './style.module.scss'
import fazaglogo from '../../public/images/logo-fazag.png'
import Image from 'next/image'
import Link from 'next/link'
export function Header(){
  
    return (
        <>
         <header>
        <nav className={`navbar navbar-expand-lg bg-light ${styles.navbar}`}>
            <div className={"container-md"}>
                  <Link href='/' className={"navbar-brand"}>
                    <Image className={styles.fazagLogo} src={fazaglogo} width='100' alt=""></Image>
                  </Link>
                  
                  <button className={"navbar-toggler"} type={"button"} data-bs-toggle={"collapse"} data-bs-target={"#navbarNavDropdown"} aria-controls={"navbarNavDropdown"} aria-expanded={"false"} aria-label={"Toggle navigation"}>
                <span className={"navbar-toggler-icon"}></span>
              </button>

              <div className={`collapse navbar-collapse ${styles.navbarCollapse}`} id={"navbarNavDropdown"}> 
                <ul className={`navbar-nav ${styles.navbarNav}`}> 
                  <li className={`nav-item dropdown ${styles.dropdown}`}>
                  
                    <a className={"nav-link dropdown-toggle active"} aria-current={"page"} role={"button"} data-bs-toggle={"dropdown"}>A Faculdade</a>
                    <ul className={`dropdown-menu ${styles.dropdownMenu}`}>
                      <li><a className={"dropdown-item"}>Quem somos</a></li>
                      <li><a className={"dropdown-item"}>Missão, Visão e Valores</a></li>
                      <li><a className={"dropdown-item"}>Regimento Geral</a></li>
                      <li><a className={"dropdown-item"}>Publicações Institucionais</a></li>
                      <li><a className={"dropdown-item"}>Ouvidoria</a></li>
                    </ul>
                  </li>

                 
                  <li className={`nav-item dropdown ${styles.dropdown}`}> 
                    
                     <a className={"nav-link dropdown-toggle"} role={"button"} data-bs-toggle={"dropdown"} aria-expanded={"false"}>Cursos de <br/><strong>Graduação</strong></a> 
                    
                    <ul className={`dropdown-menu ${styles.dropdownMenu}`}> 
                      <li><a className={"dropdown-item"}>Administração</a></li>
                      <li><a className={"dropdown-item"}>Ciências Contábeis</a></li>
                      <li><a className={"dropdown-item"}>Educação Física</a></li>
                      <li><a className={"dropdown-item"}>Engenharia Civil</a></li>
                      <li><a className={"dropdown-item"}>Enfermagem</a></li>
                      <li><a className={"dropdown-item"}>Estética</a></li>
                      <li><a className={"dropdown-item"}>Farmácia</a></li>
                      <li><a className={"dropdown-item"}>Fisioterapia</a></li>
                      <li><a className={"dropdown-item"}>Nutrição</a></li>
                      <li><a className={"dropdown-item"}>Pedagogia</a></li>
                      <li><a className={"dropdown-item"}>Serviço Social</a></li>
                    </ul>
                  </li>

                  <li className={`nav-item dropdown ${styles.dropdown}`}> 
                    
                    <a className={"nav-link dropdown-toggle"} href={"#"} role={"button"} data-bs-toggle={"dropdown"} aria-expanded={"false"}>Cursos de <br/><strong>Pós-Graduação</strong></a> 
                    
                    <ul className={`dropdown-menu ${styles.dropdownMenu}`}>
                      <li><a className={"dropdown-item"}>Enfermagem em Obstetrícia</a></li>
                      <li><a className={"dropdown-item"}>Gestão Estratégica de Pessoas</a></li>
                      <li><a className={"dropdown-item"}>Educação Inclusiva</a></li>
                    </ul>
                  </li>

                  <li className={"nav-item"}> 
                    <a className={"nav-link"}>Aluno FAZAG</a>
                  </li>

                  <li className={`nav-item dropdown ${styles.dropdown}`}> 
                    <a className={"nav-link dropdown-toggle"} role={"button"} data-bs-toggle={"dropdown"} aria-expanded={"false"}>Diferenciais</a>
                    <ul className={`dropdown-menu ${styles.dropdownMenu}`}>
                        <li><a className={"dropdown-item"}>Bolsas e Financiamentos</a></li>
                        <li><a className={"dropdown-item"}>Monitoria</a></li>
                        <li><a className={"dropdown-item"}>Feira de Inovação</a></li>
                        <li><a className={"dropdown-item"}>Núcleo de Tec. e Manutenção Pedag.</a></li>
                    </ul>
                  </li>
                  <li className={"nav-item"}> 
                   <a className={"nav-link"}>CPA</a>
                    
                  </li>
                  <li>
                 
                  </li>
                </ul>
                <a className={`navbar-brand ${styles.aEntrar}`} href="http://sistemajaguar.com.br">
                <button className={`btn btn-primary entrar ${styles.entrar}`}>
                      <img src="" alt="" />
                      Entrar</button>
                </a>
                
                
              </div>
            </div>
          </nav>
    </header>
        </>
    )
}