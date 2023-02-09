import styles from './style.module.scss'
import fazaglogo from '../../public/images/logo-fazag.png'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useEffect } from 'react'
import { LinkHeader } from './LinkHeader'

export function Header(){

const dropDownRef = useRef<any>(null)
function closeToggle(){
  dropDownRef.current.classList.remove('show')
}
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

              <div className={`collapse navbar-collapse ${styles.navbarCollapse}`} ref={dropDownRef} id={"navbarNavDropdown"}> 
                <ul className={`navbar-nav ${styles.navbarNav}`}> 
                  <li className={`nav-item dropdown ${styles.dropdown}`}>
                  
                    <a className={"nav-link dropdown-toggle active"} aria-current={"page"} role={"button"} data-bs-toggle={"dropdown"}>A Faculdade</a>
                    <ul className={`dropdown-menu ${styles.dropdownMenu}`}>
                      <LinkHeader linkName={'Quem somos'} url={"/fazaginforma/quem-somos"} closeToggle={closeToggle}/>
                      <LinkHeader linkName={'Missão, Visão e Valores'} url={"/fazaginforma/a-faculdade-zacarias-de-goes-tem-como-missao-contribuir"} closeToggle={closeToggle}/>
                      <LinkHeader linkName={'Regimento Geral'} url={"#"} closeToggle={closeToggle}/>
                      <LinkHeader linkName={'Publicações Institucionais'} url={"/publicacoes-institucionais"} closeToggle={closeToggle}/>
                      
                    </ul>
                  </li>

                 
                  <li className={`nav-item dropdown ${styles.dropdown}`}> 
                    
                     <a className={"nav-link dropdown-toggle"} role={"button"} data-bs-toggle={"dropdown"} aria-expanded={"false"}>Cursos de <br/><strong>Graduação</strong></a> 
                    
                    <ul className={`dropdown-menu ${styles.dropdownMenu}`}> 
                    <LinkHeader linkName={'Administração'} url={"#"} closeToggle={closeToggle}/>
                    <LinkHeader linkName={'Ciências Contábeis'} url={"#"} closeToggle={closeToggle}/>
                    <LinkHeader linkName={'Educação Física'} url={"#"} closeToggle={closeToggle}/>
                    <LinkHeader linkName={'Engenharia Civil'} url={"#"} closeToggle={closeToggle}/>
                    <LinkHeader linkName={'Enfermagem'} url={"#"} closeToggle={closeToggle}/>
                    <LinkHeader linkName={'Estética'} url={"#"} closeToggle={closeToggle}/>
                    <LinkHeader linkName={'Farmácia'} url={"#"} closeToggle={closeToggle}/>
                    <LinkHeader linkName={'Fisioterapia'} url={"#"} closeToggle={closeToggle}/>
                    <LinkHeader linkName={'Nutrição'} url={"#"} closeToggle={closeToggle}/>
                    <LinkHeader linkName={'Pedagogia'} url={"#"} closeToggle={closeToggle}/>
                    <LinkHeader linkName={'Psicologia'} url={"#"} closeToggle={closeToggle}/>
                    <LinkHeader linkName={'Serviço Social'} url={"#"} closeToggle={closeToggle}/>
                    </ul>
                  </li>

                  <li className={`nav-item dropdown ${styles.dropdown}`}> 
                    
                    <a className={"nav-link dropdown-toggle"} href={"#"} role={"button"} data-bs-toggle={"dropdown"} aria-expanded={"false"}>Cursos de <br/><strong>Pós-Graduação</strong></a> 
                    
                    <ul className={`dropdown-menu ${styles.dropdownMenu}`}>
                    <LinkHeader linkName={'Enfermagem em Obstetrícia'} url={"#"} closeToggle={closeToggle}/>
                    <LinkHeader linkName={'Gestão Estratégica de Pessoas'} url={"#"} closeToggle={closeToggle}/>
                    <LinkHeader linkName={'Educação Inclusiva'} url={"#"} closeToggle={closeToggle}/>
                    </ul>
                  </li>

                  <li className={"nav-item"}> 
                    <a className={"nav-link"}>Aluno FAZAG</a>
                  </li>

                  <li className={`nav-item dropdown ${styles.dropdown}`}> 
                    <a className={"nav-link dropdown-toggle"} role={"button"} data-bs-toggle={"dropdown"} aria-expanded={"false"}>Diferenciais</a>
                    <ul className={`dropdown-menu ${styles.dropdownMenu}`}>
                        <li><Link href="/fazaginforma/bolsas-descontos-financiamentos" className={"dropdown-item"}>Bolsas e Financiamentos</Link></li>
                        <LinkHeader linkName={'Monitoria'} url={"#"} closeToggle={closeToggle}/>
                        <LinkHeader linkName={'Feira de Inovação'} url={"#"} closeToggle={closeToggle}/>
                        <LinkHeader linkName={'Núcleo de Tec. e Manutenção Pedag.'} url={"#"} closeToggle={closeToggle}/>
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

