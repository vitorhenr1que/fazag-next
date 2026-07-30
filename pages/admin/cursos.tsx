import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  BookOpen,
  CheckCircle,
  FilePdf,
  Layout,
  PencilSimple,
  Plus,
  SignOut,
  Trash,
  UploadSimple,
  CloudArrowUp,
  X,
} from 'phosphor-react';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/admin-cursos.module.scss';

type CourseDocument = {
  id: string;
  title: string;
  category: string;
  fileName: string;
  fileUrl: string;
  size: number;
};

type Course = {
  id: string;
  name: string;
  slug: string;
  summary: string | null;
  description: string | null;
  degree: string | null;
  modality: string | null;
  duration: string | null;
  shift: string | null;
  coordinator: string | null;
  active: boolean;
  featured: boolean;
  order: number;
  documents: CourseDocument[];
};

const emptyForm = {
  name: '',
  slug: '',
  summary: '',
  description: '',
  degree: 'Bacharelado',
  modality: 'Presencial',
  duration: '',
  shift: '',
  coordinator: '',
  active: true,
  featured: false,
  order: 0,
};

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const formatSize = (size: number) =>
  size < 1024 * 1024 ? `${(size / 1024).toFixed(1)} KB` : `${(size / 1024 / 1024).toFixed(1)} MB`;

export default function AdminCursos() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentCategory, setDocumentCategory] = useState('GRADE_DOCENTE');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [storage, setStorage] = useState({ configured: false, pending: 0, loading: true });

  useEffect(() => {
    if (!loading && !user) router.push('/admin/login');
  }, [loading, user, router]);

  const loadCourses = async (preferredId?: string) => {
    const response = await axios.get<Course[]>('/api/cursos?admin=true');
    setCourses(response.data);
    const targetId = preferredId || selectedCourse?.id;
    setSelectedCourse(response.data.find((course) => course.id === targetId) || response.data[0] || null);
  };

  useEffect(() => {
    if (!user) return;
    Promise.all([
      axios.get<Course[]>('/api/cursos?admin=true'),
      axios.get<{ configured: boolean; pending: number }>('/api/cursos/migrar-documentos'),
    ])
      .then(([coursesResponse, storageResponse]) => {
        setCourses(coursesResponse.data);
        setSelectedCourse(coursesResponse.data[0] || null);
        setStorage({ ...storageResponse.data, loading: false });
      })
      .catch(() => setFeedback('Não foi possível carregar os cursos.'));
  }, [user]);

  const refreshStorage = async () => {
    const response = await axios.get<{ configured: boolean; pending: number }>('/api/cursos/migrar-documentos');
    setStorage({ ...response.data, loading: false });
  };

  const migrateLegacyDocuments = async () => {
    if (!window.confirm(`Enviar ${storage.pending} documento(s) existentes para o Cloudflare R2?`)) return;
    setSaving(true);
    setFeedback('Enviando documentos existentes para o R2...');
    try {
      const response = await axios.post<{ migrated: number; failed: number }>('/api/cursos/migrar-documentos');
      await Promise.all([loadCourses(selectedCourse?.id), refreshStorage()]);
      setFeedback(`${response.data.migrated} documento(s) migrado(s) para o R2.${response.data.failed ? ` ${response.data.failed} falharam.` : ''}`);
    } catch (error: any) {
      setFeedback(error.response?.data?.error || 'Erro ao migrar documentos para o R2.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = event.target;
    const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value;
    setForm((current) => ({ ...current, [target.name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const editCourse = (course: Course) => {
    setEditingId(course.id);
    setSelectedCourse(course);
    setForm({
      name: course.name,
      slug: course.slug,
      summary: course.summary || '',
      description: course.description || '',
      degree: course.degree || '',
      modality: course.modality || '',
      duration: course.duration || '',
      shift: course.shift || '',
      coordinator: course.coordinator || '',
      active: course.active,
      featured: course.featured,
      order: course.order,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveCourse = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFeedback('');
    try {
      const response = editingId
        ? await axios.put<Course>(`/api/cursos/${editingId}`, form)
        : await axios.post<Course>('/api/cursos', { ...form, order: courses.length });
      await loadCourses(response.data.id);
      setSelectedCourse({ ...response.data, documents: editingId ? selectedCourse?.documents || [] : [] });
      resetForm();
      setFeedback(editingId ? 'Curso atualizado com sucesso.' : 'Curso criado. Agora adicione os documentos.');
    } catch (error: any) {
      setFeedback(error.response?.data?.error || 'Erro ao salvar curso.');
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (course: Course) => {
    if (!window.confirm(`Excluir o curso "${course.name}" e todos os documentos dele?`)) return;
    await axios.delete(`/api/cursos/${course.id}`);
    if (selectedCourse?.id === course.id) setSelectedCourse(null);
    if (editingId === course.id) resetForm();
    await loadCourses();
  };

  const uploadDocument = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedCourse || !documentFile) return;
    setSaving(true);
    try {
      await axios.post(`/api/cursos/${selectedCourse.id}/documentos`, {
        title: documentTitle,
        category: documentCategory,
        fileName: documentFile.name,
        mimeType: documentFile.type,
        fileBase64: await fileToBase64(documentFile),
        order: selectedCourse.documents.filter((item) => item.category === documentCategory).length,
      });
      setDocumentTitle('');
      setDocumentFile(null);
      await loadCourses(selectedCourse.id);
      setFeedback('Documento enviado com sucesso.');
    } catch (error: any) {
      setFeedback(error.response?.data?.error || 'Erro ao enviar documento.');
    } finally {
      setSaving(false);
    }
  };

  const deleteDocument = async (document: CourseDocument) => {
    if (!window.confirm(`Excluir o documento "${document.title}"?`)) return;
    await axios.delete(`/api/cursos/documentos/${document.id}`);
    if (selectedCourse) await loadCourses(selectedCourse.id);
  };

  if (loading || !user) {
    return <div className={styles.loading}>Verificando autenticação...</div>;
  }

  return (
    <div className={styles.page}>
      <Head><title>Admin | Cursos</title></Head>
      <header className={styles.header}>
        <div>
          <button className={styles.back} onClick={() => router.push('/admin')}><Layout size={19} /> Painel</button>
          <h1>Gestão de cursos</h1>
          <p>Cadastre as páginas dos cursos e mantenha os documentos sempre atualizados.</p>
        </div>
        <button className={styles.logout} onClick={() => { logout(); router.push('/admin/login'); }}>
          <SignOut size={19} /> Sair
        </button>
      </header>

      {feedback && <div className={styles.feedback}><CheckCircle size={20} /> {feedback}</div>}

      <section className={`${styles.storageCard} ${storage.configured ? styles.storageReady : styles.storageWarning}`}>
        <CloudArrowUp size={32} />
        <div>
          <strong>Armazenamento Cloudflare R2</strong>
          <p>
            {storage.loading
              ? 'Verificando configuração...'
              : storage.configured
                ? storage.pending
                  ? `${storage.pending} documento(s) legado(s) ainda precisam ser enviados ao R2.`
                  : 'Todos os documentos dos cursos estão armazenados no R2.'
                : 'As credenciais do R2 ainda não estão configuradas neste ambiente.'}
          </p>
        </div>
        {storage.configured && storage.pending > 0 && (
          <button onClick={migrateLegacyDocuments} disabled={saving}>Migrar documentos para o R2</button>
        )}
      </section>

      <div className={styles.layout}>
        <section className={styles.card}>
          <div className={styles.sectionTitle}>
            <div><span>{editingId ? 'Editando curso' : 'Novo curso'}</span><h2>Informações da página</h2></div>
            {editingId && <button className={styles.iconButton} onClick={resetForm} title="Cancelar"><X /></button>}
          </div>
          <form className={styles.form} onSubmit={saveCourse}>
            <label>Nome do curso<input name="name" value={form.name} onChange={updateField} required /></label>
            <label>Endereço (slug)<input name="slug" value={form.slug} onChange={updateField} placeholder="gerado pelo nome se ficar vazio" /></label>
            <label className={styles.full}>Resumo<textarea name="summary" value={form.summary} onChange={updateField} rows={3} /></label>
            <label className={styles.full}>Apresentação do curso<textarea name="description" value={form.description} onChange={updateField} rows={9} placeholder="Use uma linha em branco para separar parágrafos." /></label>
            <label>Titulação<input name="degree" value={form.degree} onChange={updateField} placeholder="Bacharelado" /></label>
            <label>Modalidade<input name="modality" value={form.modality} onChange={updateField} placeholder="Presencial" /></label>
            <label>Duração<input name="duration" value={form.duration} onChange={updateField} placeholder="10 semestres" /></label>
            <label>Turno<input name="shift" value={form.shift} onChange={updateField} placeholder="Noturno" /></label>
            <label className={styles.full}>Coordenação<input name="coordinator" value={form.coordinator} onChange={updateField} /></label>
            <label className={styles.check}><input type="checkbox" name="active" checked={form.active} onChange={updateField} /> Publicado no site</label>
            <label className={styles.check}><input type="checkbox" name="featured" checked={form.featured} onChange={updateField} /> Curso em destaque</label>
            <button className={styles.primary} disabled={saving}>{saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Criar curso'}</button>
          </form>
        </section>

        <aside className={styles.card}>
          <div className={styles.sectionTitle}>
            <div><span>Biblioteca</span><h2>Documentos do curso</h2></div>
            <FilePdf size={28} />
          </div>
          {!selectedCourse ? (
            <div className={styles.empty}>Selecione um curso abaixo para gerenciar seus PDFs.</div>
          ) : (
            <>
              <div className={styles.selected}><strong>{selectedCourse.name}</strong><small>{selectedCourse.documents.length} documento(s)</small></div>
              <form className={styles.documentForm} onSubmit={uploadDocument}>
                <label>Título<input value={documentTitle} onChange={(event) => setDocumentTitle(event.target.value)} required placeholder="Ex.: Matriz curricular 2026" /></label>
                <label>Categoria
                  <select value={documentCategory} onChange={(event) => setDocumentCategory(event.target.value)}>
                    <option value="GRADE_DOCENTE">Grade e corpo docente</option>
                    <option value="MATRIZ_CURRICULAR">Matriz curricular</option>
                    <option value="OUTRO">Outro documento</option>
                  </select>
                </label>
                <label className={styles.file}><UploadSimple size={22} />{documentFile?.name || 'Selecionar PDF'}
                  <input type="file" accept="application/pdf" onChange={(event) => setDocumentFile(event.target.files?.[0] || null)} required />
                </label>
                <button className={styles.secondary} disabled={saving || !documentFile}>Enviar documento</button>
              </form>
              <div className={styles.documents}>
                {selectedCourse.documents.length === 0 && <div className={styles.empty}>Nenhum documento anexado a este curso.</div>}
                {selectedCourse.documents.map((document) => (
                  <div className={styles.document} key={document.id}>
                    <FilePdf size={24} />
                    <div><a href={document.fileUrl} target="_blank" rel="noreferrer">{document.title}</a><small>{formatSize(document.size)}</small></div>
                    <button onClick={() => deleteDocument(document)} title="Excluir"><Trash /></button>
                  </div>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>

      <section className={styles.card}>
        <div className={styles.sectionTitle}><div><span>Catálogo</span><h2>Cursos cadastrados</h2></div><BookOpen size={28} /></div>
        {courses.length === 0 ? <div className={styles.empty}>Nenhum curso cadastrado.</div> : (
          <div className={styles.courseGrid}>
            {courses.map((course) => (
              <article className={`${styles.courseItem} ${!course.active ? styles.inactive : ''}`} key={course.id}>
                <div className={styles.courseTop}><span>{course.degree || 'Curso'}</span><small>{course.active ? 'Publicado' : 'Rascunho'}</small></div>
                <h3>{course.name}</h3><p>/{course.slug}</p>
                <div className={styles.courseMeta}>{course.documents.length} documento(s)</div>
                <div className={styles.actions}>
                  <button className={styles.manageDocuments} onClick={() => { setSelectedCourse(course); window.scrollTo({ top: 350, behavior: 'smooth' }); }}><FilePdf /> Gerenciar arquivos</button>
                  <button onClick={() => editCourse(course)}><PencilSimple /> Editar</button>
                  <button className={styles.danger} onClick={() => deleteCourse(course)}><Trash /></button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
