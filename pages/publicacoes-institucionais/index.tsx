import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import axios from 'axios'
import {
    CaretDown,
    FilePdf,
    Image as ImageIcon,
    MagnifyingGlass,
    WarningCircle,
} from 'phosphor-react'
import styles from '../../styles/publicInstitucionais.module.scss'

type Publication = {
    id: string;
    title: string;
    category: string;
    fileUrl: string;
    fileType: string;
}

const slugify = (value: string) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

export default function PublicacoesInstitucionais(){
    const [publications, setPublications] = useState<Publication[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Todas')
    const [collapsedCategories, setCollapsedCategories] = useState<string[]>([])

    useEffect(() => {
        let isMounted = true

        async function fetchPublications() {
            try {
                const response = await axios.get<Publication[]>('/api/publicacoes-institucionais')

                if (isMounted) {
                    setPublications(response.data)
                }
            } catch (err) {
                if (isMounted) {
                    setError('Não foi possível carregar as publicações institucionais.')
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        fetchPublications()

        return () => {
            isMounted = false
        }
    }, [])

    const categories = useMemo(() => {
        return Array.from(new Set(publications.map((publication) => publication.category)))
    }, [publications])

    const filteredPublications = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        return publications.filter((publication) => {
            const matchesCategory = selectedCategory === 'Todas' || publication.category === selectedCategory
            const matchesSearch = !normalizedSearch
                || publication.title.toLowerCase().includes(normalizedSearch)
                || publication.category.toLowerCase().includes(normalizedSearch)

            return matchesCategory && matchesSearch
        })
    }, [publications, search, selectedCategory])

    const publicationsByCategory = useMemo(() => {
        return filteredPublications.reduce<Record<string, Publication[]>>((acc, publication) => {
            acc[publication.category] = acc[publication.category] || []
            acc[publication.category].push(publication)
            return acc
        }, {})
    }, [filteredPublications])

    const toggleCategory = (category: string) => {
        setCollapsedCategories((currentCategories) =>
            currentCategories.includes(category)
                ? currentCategories.filter((item) => item !== category)
                : [...currentCategories, category]
        )
    }

    const clearFilters = () => {
        setSearch('')
        setSelectedCategory('Todas')
    }

    return (
        <>
            <Head>
                <title>Publicações Institucionais | FAZAG</title>
                <meta
                    name="description"
                    content="Consulte documentos oficiais, editais, regulamentos e arquivos institucionais publicados pela FAZAG."
                />
            </Head>

            <main className={styles.page}>
                <section className={styles.hero}>
                    <div>
                        <h1>Publicações Institucionais</h1>
                        <p>Consulte documentos oficiais, editais, regulamentos e arquivos publicados pela FAZAG.</p>
                    </div>

                    <div className={styles.heroStats} aria-label="Resumo das publicações">
                        <strong>{publications.length}</strong>
                        <span>{publications.length === 1 ? 'publicação disponível' : 'publicações disponíveis'}</span>
                    </div>
                </section>

                <section className={styles.toolbar} aria-label="Filtros de publicações">
                    <label className={styles.searchBox}>
                        <MagnifyingGlass size={20} />
                        <input
                            type="search"
                            placeholder="Buscar por título ou categoria"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </label>

                    <div className={styles.categoryFilters} aria-label="Categorias">
                        {['Todas', ...categories].map((category) => (
                            <button
                                key={category}
                                type="button"
                                className={selectedCategory === category ? styles.activeFilter : ''}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </section>

                {isLoading && (
                    <section className={styles.stateBox}>
                        <div className={styles.spinner} />
                        <h2>Carregando publicações</h2>
                        <p>Estamos buscando os arquivos publicados no painel administrativo.</p>
                    </section>
                )}

                {!isLoading && error && (
                    <section className={styles.stateBox}>
                        <WarningCircle size={34} />
                        <h2>Não foi possível carregar</h2>
                        <p>{error}</p>
                    </section>
                )}

                {!isLoading && !error && publications.length === 0 && (
                    <section className={styles.stateBox}>
                        <FilePdf size={34} />
                        <h2>Nenhuma publicação disponível</h2>
                        <p>Assim que houver arquivos publicados, eles aparecerão nesta página.</p>
                    </section>
                )}

                {!isLoading && !error && publications.length > 0 && filteredPublications.length === 0 && (
                    <section className={styles.stateBox}>
                        <MagnifyingGlass size={34} />
                        <h2>Nenhum resultado encontrado</h2>
                        <p>Tente buscar por outro termo ou selecione outra categoria.</p>
                        <button type="button" onClick={clearFilters}>Limpar filtros</button>
                    </section>
                )}

                {!isLoading && !error && filteredPublications.length > 0 && (
                    <section className={styles.publicationsGrid} aria-label="Lista de publicações institucionais">
                        {Object.entries(publicationsByCategory).map(([category, items]) => {
                            const isCollapsed = collapsedCategories.includes(category)
                            const sectionId = `categoria-${slugify(category)}`

                            return (
                                <article className={styles.categorySection} key={category}>
                                    <button
                                        type="button"
                                        className={styles.categoryHeader}
                                        onClick={() => toggleCategory(category)}
                                        aria-expanded={!isCollapsed}
                                        aria-controls={sectionId}
                                    >
                                        <span>
                                            <strong>{category}</strong>
                                            <small>{items.length} {items.length === 1 ? 'arquivo' : 'arquivos'}</small>
                                        </span>
                                        <CaretDown className={isCollapsed ? styles.collapsedIcon : ''} size={22} />
                                    </button>

                                    <div className={`${styles.publicationList} ${isCollapsed ? styles.publicationListCollapsed : ''}`} id={sectionId}>
                                        {items.map((publication) => {
                                            const isImage = publication.fileType === 'image'

                                            return (
                                                <a
                                                    key={publication.id}
                                                    className={styles.publicationCard}
                                                    href={publication.fileUrl}
                                                    target={publication.fileUrl.startsWith('http') ? '_blank' : undefined}
                                                    rel={publication.fileUrl.startsWith('http') ? 'noreferrer' : undefined}
                                                    download={publication.fileUrl.startsWith('http') ? undefined : publication.title}
                                                >
                                                    <span className={styles.fileIcon}>
                                                        {isImage ? <ImageIcon size={24} /> : <FilePdf size={24} />}
                                                    </span>
                                                    <span className={styles.fileInfo}>
                                                        <strong>{publication.title}</strong>
                                                        <small>{isImage ? 'Imagem' : 'PDF'}</small>
                                                    </span>
                                                    <span className={styles.fileAction}>Abrir</span>
                                                </a>
                                            )
                                        })}
                                    </div>
                                </article>
                            )
                        })}
                    </section>
                )}
            </main>
        </>
    )
}
