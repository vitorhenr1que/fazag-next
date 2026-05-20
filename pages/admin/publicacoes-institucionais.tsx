import React, { ChangeEvent, DragEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  CheckCircle,
  CaretDown,
  CaretUp,
  FilePdf,
  Files,
  Check,
  Image as ImageIcon,
  Layout,
  PencilSimple,
  Link as LinkIcon,
  SignOut,
  X,
  Trash,
  DotsSixVertical,
  UploadSimple,
} from 'phosphor-react';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/admin-publicacoes.module.scss';

type Publication = {
  id: string;
  title: string;
  category: string;
  fileName: string;
  fileUrl: string;
  fileType: 'pdf' | 'image';
  size: number;
  description?: string | null;
  published: boolean;
  order: number;
  alwaysPublished: boolean;
  publishAt: string | null;
  unpublishAt: string | null;
};

type PublicationApiResponse = Publication | (Omit<Publication, 'alwaysPublished' | 'publishAt' | 'unpublishAt'> & {
  alwaysPublished?: boolean | null;
  publishAt?: string | null;
  unpublishAt?: string | null;
});

type PublicationForm = {
  title: string;
  category: string;
  description: string;
  published: boolean;
  alwaysPublished: boolean;
  publishAt: string;
  unpublishAt: string;
};

const initialForm: PublicationForm = {
  title: '',
  category: '',
  description: '',
  published: true,
  alwaysPublished: true,
  publishAt: '',
  unpublishAt: '',
};

const formatSize = (size: number) => {
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const toDateTimeLocal = (value?: string | null) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  const timezoneOffset = parsed.getTimezoneOffset() * 60000;
  return new Date(parsed.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

const getDateTimeForApi = (value: string) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
};

const getVisibilityStatus = (publication: Publication) => {
  if (!publication.published) return 'Rascunho';
  if (publication.alwaysPublished) return 'Publicado';

  const now = new Date();
  const publishAt = publication.publishAt ? new Date(publication.publishAt) : null;
  const unpublishAt = publication.unpublishAt ? new Date(publication.unpublishAt) : null;

  if (publishAt && publishAt > now) return 'Agendado';
  if (unpublishAt && unpublishAt <= now) return 'Expirado';

  return 'Publicado';
};

const formatDateTime = (value?: string | null) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleString('pt-BR');
};

const normalizePublication = (payload: PublicationApiResponse): Publication => ({
  id: String(payload.id || ''),
  title: String(payload.title || ''),
  category: String(payload.category || ''),
  fileName: String(payload.fileName || ''),
  fileUrl: String(payload.fileUrl || ''),
  fileType: (payload.fileType === 'image' ? 'image' : 'pdf') as 'pdf' | 'image',
  size: Number(payload.size || 0),
  description: payload.description || null,
  published: Boolean(payload.published),
  order: Number(payload.order || 0),
  alwaysPublished: payload.alwaysPublished === undefined ? true : Boolean(payload.alwaysPublished),
  publishAt: typeof payload.publishAt === 'string' ? payload.publishAt : null,
  unpublishAt: typeof payload.unpublishAt === 'string' ? payload.unpublishAt : null,
});

export default function AdminPublicacoesInstitucionais() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [draggedPublicationId, setDraggedPublicationId] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState('');
  const [loadError, setLoadError] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingPublicationId, setEditingPublicationId] = useState<string | null>(null);
  const [editingPublicationSchedule, setEditingPublicationSchedule] = useState({
    alwaysPublished: true,
    publishAt: '',
    unpublishAt: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  const fetchPublications = async () => {
    try {
      setLoadError('');
      const response = await axios.get('/api/publicacoes-institucionais?admin=true');
      const data = response?.data;

      if (!Array.isArray(data)) {
        throw new Error('Resposta inválida do endpoint de publicações.');
      }

      setPublications(data.map(normalizePublication));
    } catch (error: any) {
      const apiError = error?.response?.data?.error || error?.message || 'Erro ao carregar publicações.';
      console.error('Erro ao carregar publicações:', error);
      setLoadError(String(apiError));
      setPublications([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPublications();
    }
  }, [user]);

  const categories = useMemo(() => {
    const names = publications.map((publication) => publication.category);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [publications]);

  const orderedCategories = useMemo(() => {
    const names: string[] = [];
    for (const publication of publications) {
      if (!names.includes(publication.category)) {
        names.push(publication.category);
      }
    }
    return names;
  }, [publications]);

  const isReorderingCategory = Object.keys(updatingIds).length > 0;

  const applySelectedFile = (selectedFile?: File | null) => {
    if (!selectedFile) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Envie apenas PDF, JPG, PNG ou WEBP.');
      return;
    }

    setFile(selectedFile);
    setForm((current) => ({
      ...current,
      title: current.title || selectedFile.name.replace(/\.[^/.]+$/, ''),
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    applySelectedFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleFileDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDraggingFile(false);
    applySelectedFile(event.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      alert('Selecione um arquivo.');
      return;
    }

    setIsSaving(true);
    try {
      const fileBase64 = await fileToBase64(file);
      await axios.post('/api/publicacoes-institucionais', {
        ...form,
        fileName: file.name,
        mimeType: file.type,
        fileBase64,
        order: publications.length,
        publishAt: form.alwaysPublished ? null : getDateTimeForApi(form.publishAt),
        unpublishAt: form.alwaysPublished ? null : getDateTimeForApi(form.unpublishAt),
      });

      setForm(initialForm);
      setFile(null);
      setFeedback('Publicacao enviada com sucesso!');
      await fetchPublications();
      setTimeout(() => setFeedback(''), 3000);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao enviar publicacao.');
    } finally {
      setIsSaving(false);
    }
  };

  const togglePublished = async (publication: Publication) => {
    setUpdatingIds((current) => ({ ...current, [publication.id]: 'status' }));
    try {
      await axios.put(`/api/publicacoes-institucionais/${publication.id}`, {
        published: !publication.published,
      });
      await fetchPublications();
    } finally {
      setUpdatingIds((current) => {
        const next = { ...current };
        delete next[publication.id];
        return next;
      });
    }
  };

  const persistOrder = async (orderedPublications: Publication[]) => {
    const updates = orderedPublications
      .map((publication, index) => ({ ...publication, order: index }))
      .filter((publication, index) => publication.order !== publications[index]?.order || publication.id !== publications[index]?.id);

    if (updates.length === 0) return;

    setUpdatingIds((current) =>
      updates.reduce((acc, publication) => ({ ...acc, [publication.id]: 'order' }), current)
    );

    try {
      await Promise.all(
        orderedPublications.map((publication, index) =>
          axios.put(`/api/publicacoes-institucionais/${publication.id}`, {
            order: index,
          })
        )
      );
      setPublications(orderedPublications.map((publication, index) => ({ ...publication, order: index })));
    } finally {
      setUpdatingIds((current) => {
        const next = { ...current };
        updates.forEach((publication) => delete next[publication.id]);
        return next;
      });
    }
  };

  const reorderPublications = async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;

    const nextPublications = [...publications];
    const [movedPublication] = nextPublications.splice(fromIndex, 1);
    nextPublications.splice(toIndex, 0, movedPublication);
    setPublications(nextPublications);
    await persistOrder(nextPublications);
  };

  const movePublicationInCategory = async (
    categoryItems: Publication[],
    currentIndexInCategory: number,
    direction: -1 | 1
  ) => {
    const targetIndex = currentIndexInCategory + direction;
    if (targetIndex < 0 || targetIndex >= categoryItems.length) return;

    const movedPublication = categoryItems[currentIndexInCategory];
    const targetPublication = categoryItems[targetIndex];
    const fromIndex = getGlobalIndexById(movedPublication.id);
    const toIndex = getGlobalIndexById(targetPublication.id);

    if (fromIndex < 0 || toIndex < 0) return;
    await reorderPublications(fromIndex, toIndex);
  };

  const reorderCategories = async (categoryIndex: number, direction: -1 | 1) => {
    const newIndex = categoryIndex + direction;
    if (newIndex < 0 || newIndex >= orderedCategories.length) return;

    const nextCategoryOrder = [...orderedCategories];
    [nextCategoryOrder[categoryIndex], nextCategoryOrder[newIndex]] = [
      nextCategoryOrder[newIndex],
      nextCategoryOrder[categoryIndex],
    ];

    const reorderedPublications = nextCategoryOrder.flatMap((category) =>
      publications.filter((publication) => publication.category === category)
    );

    await persistOrder(reorderedPublications);
  };

  const startCategoryEdition = (category: string) => {
    setEditingCategory(category);
    setEditingCategoryName(category);
  };

  const cancelCategoryEdition = () => {
    setEditingCategory(null);
    setEditingCategoryName('');
  };

  const saveCategoryName = async (currentCategory: string) => {
    const nextCategory = editingCategoryName.trim();
    if (!nextCategory || nextCategory === currentCategory) {
      cancelCategoryEdition();
      return;
    }

    const impacted = publications.filter((publication) => publication.category === currentCategory);
    if (impacted.length === 0) {
      cancelCategoryEdition();
      return;
    }

    setUpdatingIds((current) =>
      impacted.reduce((acc, publication) => ({ ...acc, [publication.id]: 'category' }), current)
    );

    try {
      await Promise.all(
        impacted.map((publication) =>
          axios.put(`/api/publicacoes-institucionais/${publication.id}`, {
            category: nextCategory,
          })
        )
      );
      await fetchPublications();
      setFeedback('Nome da categoria atualizado.');
      setTimeout(() => setFeedback(''), 2500);
    } catch (error: any) {
      alert(error?.response?.data?.error || 'Erro ao atualizar categoria.');
    } finally {
      setUpdatingIds((current) => {
        const next = { ...current };
        impacted.forEach((publication) => delete next[publication.id]);
        return next;
      });
      cancelCategoryEdition();
    }
  };

  const startPublicationScheduleEdition = (publication: Publication) => {
    setEditingPublicationId(publication.id);
    setEditingPublicationSchedule({
      alwaysPublished: publication.alwaysPublished,
      publishAt: publication.alwaysPublished ? '' : toDateTimeLocal(publication.publishAt),
      unpublishAt: publication.alwaysPublished ? '' : toDateTimeLocal(publication.unpublishAt),
    });
  };

  const cancelPublicationScheduleEdition = () => {
    setEditingPublicationId(null);
    setEditingPublicationSchedule({
      alwaysPublished: true,
      publishAt: '',
      unpublishAt: '',
    });
  };

  const savePublicationSchedule = async (publication: Publication) => {
    const payload = {
      alwaysPublished: editingPublicationSchedule.alwaysPublished,
      ...(editingPublicationSchedule.alwaysPublished
        ? {}
        : {
            publishAt: getDateTimeForApi(editingPublicationSchedule.publishAt),
            unpublishAt: getDateTimeForApi(editingPublicationSchedule.unpublishAt),
          }),
    };

    setUpdatingIds((current) => ({ ...current, [publication.id]: 'schedule' }));
    try {
      await axios.put(`/api/publicacoes-institucionais/${publication.id}`, payload);
      await fetchPublications();
      setFeedback('Agendamento atualizado.');
      setTimeout(() => setFeedback(''), 2500);
    } catch (error: any) {
      alert(error?.response?.data?.error || 'Erro ao atualizar agendamento.');
    } finally {
      setUpdatingIds((current) => {
        const next = { ...current };
        delete next[publication.id];
        return next;
      });
      cancelPublicationScheduleEdition();
    }
  };

  const deletePublication = async (publication: Publication) => {
    const confirmed = window.confirm(`Excluir "${publication.title}"?`);
    if (!confirmed) return;

    await axios.delete(`/api/publicacoes-institucionais/${publication.id}`);
    await fetchPublications();
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const publicationsByCategory = useMemo(() => {
    const grouped: Array<{ category: string; items: Publication[] }> = [];
    orderedCategories.forEach((category) => {
      grouped.push({
        category,
        items: publications.filter((publication) => publication.category === category),
      });
    });

    return grouped;
  }, [orderedCategories, publications]);

  const getGlobalIndexById = (publicationId: string) => publications.findIndex((item) => item.id === publicationId);

  if (loading || !user) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
        <p>Verificando autenticacao...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Admin | Publicacoes Institucionais</title>
      </Head>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <button className={styles.backBtn} onClick={() => router.push('/admin')} title="Voltar ao Painel">
              <Layout size={20} />
              Painel
            </button>
            <h1>Publicacoes Institucionais</h1>
            <p>Envie documentos para o site e para consumo pelo app React Native.</p>
          </div>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <SignOut size={20} />
            Sair
          </button>
        </header>

        <section className={styles.statsRow}>
          <div className={styles.statCard}>
            <Files size={28} />
            <div>
              <span>Total</span>
              <strong>{publications.length}</strong>
            </div>
          </div>
          <div className={styles.statCard}>
            <FilePdf size={28} />
            <div>
              <span>PDFs</span>
              <strong>{publications.filter((publication) => publication.fileType === 'pdf').length}</strong>
            </div>
          </div>
          <div className={styles.statCard}>
            <ImageIcon size={28} />
            <div>
              <span>Imagens</span>
              <strong>{publications.filter((publication) => publication.fileType === 'image').length}</strong>
            </div>
          </div>
        </section>

        <div className={styles.contentGrid}>
          <section className={styles.formCard}>
            <h2>Nova publicacao</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>
                Titulo
                <input
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  required
                  placeholder="Ex: Edital Monitoria 2026"
                />
              </label>

              <label>
                Categoria
                <input
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  list="publication-categories"
                  required
                  placeholder="Ex: Monitoria"
                />
                <datalist id="publication-categories">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </label>

              <label>
                Descricao
                <textarea
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  placeholder="Opcional"
                />
              </label>

              <label
                className={`${styles.fileDrop} ${isDraggingFile ? styles.fileDropActive : ''}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDraggingFile(true);
                }}
                onDragLeave={() => setIsDraggingFile(false)}
                onDrop={handleFileDrop}
              >
                <UploadSimple size={28} />
                <span>{file ? file.name : 'Arraste o arquivo aqui ou clique para selecionar'}</span>
                <small>{file ? `${file.type || 'Arquivo'} - ${formatSize(file.size)}` : 'PDF, JPG, PNG ou WEBP ate 30 MB'}</small>
                <input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={handleFileChange} />
              </label>

              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(event) => setForm({ ...form, published: event.target.checked })}
                />
                Publicar no site
              </label>

              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={form.alwaysPublished}
                  onChange={(event) => {
                    const alwaysPublished = event.target.checked;
                    setForm({
                      ...form,
                      alwaysPublished,
                      publishAt: alwaysPublished ? '' : form.publishAt,
                      unpublishAt: alwaysPublished ? '' : form.unpublishAt,
                    });
                  }}
                />
                Manter sempre publicado
              </label>

              {!form.alwaysPublished && (
                <>
                  <label>
                    Publicar em
                    <input
                      type="datetime-local"
                      value={form.publishAt}
                      onChange={(event) => setForm({ ...form, publishAt: event.target.value })}
                    />
                  </label>
                  <label>
                    Despublicar em
                    <input
                      type="datetime-local"
                      value={form.unpublishAt}
                      onChange={(event) => setForm({ ...form, unpublishAt: event.target.value })}
                    />
                  </label>
                </>
              )}

              <button className={styles.primaryBtn} disabled={isSaving}>
                <UploadSimple size={20} />
                {isSaving ? 'Enviando...' : 'Enviar para R2'}
              </button>
            </form>
          </section>

          <section className={styles.tableCard}>
                <h2>Arquivos cadastrados</h2>
              {loadError ? <div className={styles.feedback}>{loadError}</div> : null}
              {publications.length === 0 ? (
                <div className={styles.emptyState}>Nenhuma publicacao cadastrada.</div>
              ) : (
              <div className={styles.categoryList}>
                {publicationsByCategory.map(({ category, items }, categoryIndex) => {
                  const isCategoryUpdating = items.some((publication) => Boolean(updatingIds[publication.id]));
                  return (
                    <section key={category} className={styles.categorySection}>
                      <div className={styles.categoryHeaderRow}>
                        <div className={styles.categoryTitleRow}>
                          <span className={styles.categoryIndex}>{`${categoryIndex + 1}.`}</span>
                          {editingCategory === category ? (
                            <input
                              className={styles.categoryTitleInput}
                              value={editingCategoryName}
                              onChange={(event) => setEditingCategoryName(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                  event.preventDefault();
                                  saveCategoryName(category);
                                }
                                if (event.key === 'Escape') {
                                  cancelCategoryEdition();
                                }
                              }}
                              autoFocus
                              required
                              maxLength={80}
                            />
                          ) : (
                            <h3 className={styles.categoryTitle}>{category}</h3>
                          )}
                        </div>
                        <div className={styles.categoryOrderActions}>
                          {editingCategory === category ? (
                            <>
                              <button
                                type="button"
                                onClick={() => saveCategoryName(category)}
                                disabled={isCategoryUpdating}
                                title="Salvar nome da categoria"
                                aria-label={`Salvar nome da categoria ${category}`}
                              >
                                <Check size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={cancelCategoryEdition}
                                disabled={isCategoryUpdating}
                                title="Cancelar edição"
                                aria-label={`Cancelar edição da categoria ${category}`}
                              >
                                <X size={14} />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => startCategoryEdition(category)}
                              disabled={isReorderingCategory || isCategoryUpdating}
                              title="Editar nome da categoria"
                              aria-label={`Editar categoria ${category}`}
                            >
                              <PencilSimple size={14} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => reorderCategories(categoryIndex, -1)}
                            disabled={categoryIndex === 0 || isReorderingCategory || isCategoryUpdating || editingCategory !== null}
                            title="Subir categoria"
                            aria-label={`Subir categoria ${category}`}
                          >
                            <CaretUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => reorderCategories(categoryIndex, 1)}
                            disabled={
                              categoryIndex === publicationsByCategory.length - 1 ||
                              isReorderingCategory ||
                              isCategoryUpdating ||
                              editingCategory !== null
                            }
                            title="Descer categoria"
                            aria-label={`Descer categoria ${category}`}
                          >
                            <CaretDown size={14} />
                          </button>
                        </div>
                      </div>

                      <div className={styles.tableContainer}>
                        <table>
                          <thead>
                            <tr>
                              <th>Ordem</th>
                              <th>Arquivo</th>
                              <th>Tipo</th>
                              <th>Status</th>
                              <th>Agendamento</th>
                              <th>Acoes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((publication, localIndex) => {

                              return (
                                <React.Fragment key={publication.id}>
                                <tr
                                  draggable
                                  onDragStart={() => setDraggedPublicationId(publication.id)}
                                  onDragOver={(event) => event.preventDefault()}
                                  onDrop={() => {
                                    if (!draggedPublicationId) return;

                                    const draggedPublication = publications.find((item) => item.id === draggedPublicationId);
                                    if (!draggedPublication || draggedPublication.category !== category) return;

                                    const fromIndex = getGlobalIndexById(draggedPublicationId);
                                    const toIndex = getGlobalIndexById(publication.id);
                                    if (fromIndex >= 0 && toIndex >= 0) {
                                      reorderPublications(fromIndex, toIndex);
                                    }

                                    setDraggedPublicationId(null);
                                  }}
                                  onDragEnd={() => setDraggedPublicationId(null)}
                                  className={draggedPublicationId === publication.id ? styles.draggingRow : ''}
                                >
                                  <td>
                                    <div className={styles.orderCell}>
                                      <DotsSixVertical size={20} />
                                      <strong>{localIndex + 1}</strong>
                                      <div className={styles.orderActions}>
                                        <button
                                          type="button"
                                          onClick={() => movePublicationInCategory(items, localIndex, -1)}
                                          disabled={
                                            localIndex === 0 ||
                                            updatingIds[publication.id] === 'order' ||
                                            publication.category !== category
                                          }
                                          title="Subir na fila"
                                          aria-label={`Subir ${publication.title} na fila`}
                                        >
                                          <CaretUp size={14} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => movePublicationInCategory(items, localIndex, 1)}
                                          disabled={
                                            localIndex === items.length - 1 ||
                                            updatingIds[publication.id] === 'order' ||
                                            publication.category !== category
                                          }
                                          title="Mover para baixo"
                                          aria-label={`Mover ${publication.title} para baixo`}
                                        >
                                          <CaretDown size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <strong>{publication.title}</strong>
                                    <small>{publication.fileName} - {formatSize(publication.size)}</small>
                                  </td>
                                  <td>{publication.fileType === 'pdf' ? 'PDF' : 'Imagem'}</td>
                                  <td>
                                    <button
                                      className={`${styles.statusBtn} ${publication.published ? styles.published : styles.draft}`}
                                      onClick={() => togglePublished(publication)}
                                      disabled={Boolean(updatingIds[publication.id])}
                                    >
                                      {updatingIds[publication.id] === 'status' && <span className={styles.miniSpinner} />}
                                      {updatingIds[publication.id] === 'status'
                                        ? 'Atualizando...'
                                        : getVisibilityStatus(publication)}
                                    </button>
                                  </td>
                                  <td>
                                    <div className={styles.actions}>
                                      <small>
                                        {publication.alwaysPublished
                                          ? 'Sempre publicado'
                                          : `${publication.publishAt ? `Publica em ${formatDateTime(publication.publishAt)}` : 'Sem data inicial'} | ${
                                              publication.unpublishAt ? `Despublica em ${formatDateTime(publication.unpublishAt)}` : 'Sem data de termino'
                                            }`}
                                      </small>
                                      <button
                                        type="button"
                                        onClick={() => startPublicationScheduleEdition(publication)}
                                        title="Editar agendamento"
                                        disabled={Boolean(updatingIds[publication.id]) || editingPublicationId === publication.id}
                                        aria-label={`Editar agendamento de ${publication.title}`}
                                      >
                                        <PencilSimple size={16} />
                                      </button>
                                    </div>
                                  </td>
                                  <td>
                                    <div className={styles.actions}>
                                      <a href={publication.fileUrl} target="_blank" rel="noreferrer" title="Abrir arquivo">
                                        <LinkIcon size={18} />
                                      </a>
                                      <button onClick={() => deletePublication(publication)} title="Excluir">
                                        <Trash size={18} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                {editingPublicationId === publication.id && (
                                  <tr key={`${publication.id}-schedule`}>
                                    <td colSpan={6}>
                                      <div className={styles.scheduleEditor}>
                                        <label className={styles.checkRow}>
                                          <input
                                            type="checkbox"
                                            checked={editingPublicationSchedule.alwaysPublished}
                                            onChange={(event) => {
                                              const alwaysPublished = event.target.checked;
                                              setEditingPublicationSchedule({
                                                ...editingPublicationSchedule,
                                                alwaysPublished,
                                                publishAt: alwaysPublished ? '' : editingPublicationSchedule.publishAt,
                                                unpublishAt: alwaysPublished ? '' : editingPublicationSchedule.unpublishAt,
                                              });
                                            }}
                                          />
                                          Manter sempre publicado
                                        </label>
                                        {!editingPublicationSchedule.alwaysPublished && (
                                          <>
                                            <label>
                                              Publicar em
                                              <input
                                                type="datetime-local"
                                                value={editingPublicationSchedule.publishAt}
                                                onChange={(event) =>
                                                  setEditingPublicationSchedule({
                                                    ...editingPublicationSchedule,
                                                    publishAt: event.target.value,
                                                  })
                                                }
                                              />
                                            </label>
                                            <label>
                                              Despublicar em
                                              <input
                                                type="datetime-local"
                                                value={editingPublicationSchedule.unpublishAt}
                                                onChange={(event) =>
                                                  setEditingPublicationSchedule({
                                                    ...editingPublicationSchedule,
                                                    unpublishAt: event.target.value,
                                                  })
                                                }
                                              />
                                            </label>
                                          </>
                                        )}
                                        <div className={styles.scheduleActions}>
                                          <button
                                            type="button"
                                            className={styles.primaryBtn}
                                            onClick={() => savePublicationSchedule(publication)}
                                            disabled={Boolean(updatingIds[publication.id])}
                                          >
                                            <Check size={14} />
                                            Salvar
                                          </button>
                                            <button
                                            type="button"
                                            onClick={cancelPublicationScheduleEdition}
                                            disabled={Boolean(updatingIds[publication.id])}
                                          >
                                            <X size={14} />
                                            Cancelar
                                          </button>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {feedback && (
        <div className={styles.feedback}>
          <CheckCircle size={22} weight="fill" />
          {feedback}
        </div>
      )}
    </div>
  );
}

