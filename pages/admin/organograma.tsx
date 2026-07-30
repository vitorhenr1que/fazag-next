import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  ArrowLeft,
  ArrowSquareOut,
  Buildings,
  CheckCircle,
  DotsSixVertical,
  Eye,
  EyeSlash,
  GraduationCap,
  PencilSimple,
  Plus,
  Trash,
  TreeStructure,
  X,
} from 'phosphor-react';
import { useAdminPermission } from '../../hooks/useAdminPermission';
import {
  ORGANIZATION_NODE_TYPES,
  ORGANIZATION_TYPE_LABELS,
  OrganizationChartData,
  OrganizationNodeData,
  OrganizationNodeType,
} from '../../types/organizationChart';
import styles from '../../styles/admin-organograma.module.scss';

const emptyForm = {
  title: '',
  personName: '',
  description: '',
  type: 'DEPARTMENT' as OrganizationNodeType,
  parentId: '',
  order: 0,
  active: true,
};

const getNodeDepth = (node: OrganizationNodeData, nodes: OrganizationNodeData[]) => {
  let depth = 0;
  let parentId = node.parentId;
  const visited = new Set<string>();
  while (parentId && !visited.has(parentId)) {
    visited.add(parentId);
    depth += 1;
    parentId = nodes.find((item) => item.id === parentId)?.parentId || null;
  }
  return depth;
};

const sortHierarchy = (nodes: OrganizationNodeData[]) => {
  const sorted: OrganizationNodeData[] = [];
  const appendChildren = (parentId: string | null) => {
    nodes
      .filter((node) => node.parentId === parentId)
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'pt-BR'))
      .forEach((node) => {
        sorted.push(node);
        appendChildren(node.id);
      });
  };
  appendChildren(null);
  nodes.filter((node) => !sorted.some((item) => item.id === node.id)).forEach((node) => sorted.push(node));
  return sorted;
};

export default function AdminOrganograma() {
  const router = useRouter();
  const { user, loading, allowed, hasPermission } = useAdminPermission('organization_chart');
  const [chart, setChart] = useState<OrganizationChartData>({ nodes: [], courses: [] });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const loadChart = useCallback(async () => {
    try {
      const response = await axios.get<OrganizationChartData>('/api/organograma?admin=true');
      setChart(response.data);
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || 'Não foi possível carregar o organograma.');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (user && allowed) loadChart();
  }, [user, allowed, loadChart]);

  const orderedNodes = useMemo(() => sortHierarchy(chart.nodes), [chart.nodes]);
  const previewParent = chart.nodes.find((node) => node.id === form.parentId);
  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setFeedback('');
  };

  const editNode = (node: OrganizationNodeData) => {
    setEditingId(node.id);
    setForm({
      title: node.title,
      personName: node.personName || '',
      description: node.description || '',
      type: node.type,
      parentId: node.parentId || '',
      order: node.order,
      active: node.active,
    });
    setError('');
    setFeedback('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateField = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = event.target;
    const value =
      target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target.value;
    setForm((current) => ({ ...current, [target.name]: value }));
  };

  const saveNode = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setFeedback('');
    try {
      if (editingId) {
        await axios.put(`/api/organograma/${editingId}`, form);
        setFeedback('Item atualizado com sucesso.');
      } else {
        await axios.post('/api/organograma', form);
        setFeedback('Item adicionado ao organograma.');
      }
      await loadChart();
      setForm(emptyForm);
      setEditingId(null);
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || 'Não foi possível salvar o item.');
    } finally {
      setSaving(false);
    }
  };

  const deleteNode = async (node: OrganizationNodeData) => {
    if (!window.confirm(`Excluir "${node.title}" do organograma?`)) return;
    setError('');
    setFeedback('');
    try {
      await axios.delete(`/api/organograma/${node.id}`);
      if (editingId === node.id) resetForm();
      await loadChart();
      setFeedback('Item excluído do organograma.');
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || 'Não foi possível excluir o item.');
    }
  };

  const isInsideDraggedBranch = (targetId: string | null) => {
    if (!draggedId || !targetId) return false;
    let currentId: string | null = targetId;
    const visited = new Set<string>();
    while (currentId && !visited.has(currentId)) {
      if (currentId === draggedId) return true;
      visited.add(currentId);
      currentId = chart.nodes.find((node) => node.id === currentId)?.parentId || null;
    }
    return false;
  };

  const moveNode = async (parentId: string | null, position: number) => {
    if (!draggedId || isInsideDraggedBranch(parentId)) return;
    setSaving(true);
    setError('');
    setFeedback('');
    try {
      await axios.post('/api/organograma/reorder', {
        nodeId: draggedId,
        parentId,
        position,
      });
      await loadChart();
      setFeedback('Estrutura reorganizada com sucesso.');
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || 'Não foi possível mover o item.');
    } finally {
      setSaving(false);
      setDraggedId(null);
      setActiveDropZone(null);
    }
  };

  const dropBeforeNode = (target: OrganizationNodeData) => {
    const siblings = chart.nodes
      .filter((node) => node.parentId === target.parentId && node.id !== draggedId)
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'pt-BR'));
    const position = Math.max(0, siblings.findIndex((node) => node.id === target.id));
    return moveNode(target.parentId, position);
  };

  const dropInsideNode = (target: OrganizationNodeData) => {
    const position = chart.nodes.filter(
      (node) => node.parentId === target.id && node.id !== draggedId
    ).length;
    return moveNode(target.id, position);
  };

  if (loading || !user || !allowed || fetching) {
    return <div className={styles.loading}>Carregando organograma...</div>;
  }

  return (
    <div className={styles.page}>
      <Head><title>Admin | Organograma Institucional</title></Head>

      <header className={styles.header}>
        <button className={styles.back} onClick={() => router.push('/admin')}>
          <ArrowLeft size={19} /> Painel
        </button>
        <div>
          <span className={styles.eyebrow}>Estrutura institucional</span>
          <h1>Gestão do organograma</h1>
          <p>Organize cargos, responsáveis, setores e relações de subordinação.</p>
        </div>
        <Link className={styles.publicLink} href="/organograma" target="_blank">
          Ver página pública <ArrowSquareOut size={18} />
        </Link>
      </header>

      <main>
        {(error || feedback) && (
          <div className={`${styles.notice} ${error ? styles.noticeError : styles.noticeSuccess}`}>
            {error ? <X size={20} /> : <CheckCircle size={20} />}
            {error || feedback}
          </div>
        )}

        <div className={styles.editorLayout}>
          <section className={styles.formCard}>
            <div className={styles.cardHeading}>
              <span className={styles.headingIcon}>
                {editingId ? <PencilSimple size={23} /> : <Plus size={23} />}
              </span>
              <div>
                <h2>{editingId ? 'Editar item' : 'Novo item'}</h2>
                <p>Defina o superior para criar automaticamente a ligação hierárquica.</p>
              </div>
              {editingId && (
                <button className={styles.closeEdit} onClick={resetForm} title="Cancelar edição">
                  <X size={20} />
                </button>
              )}
            </div>

            <div className={styles.formWorkspace}>
              <form className={styles.form} onSubmit={saveNode}>
                <label className={styles.full}>
                Cargo, setor ou unidade
                <input
                  name="title"
                  value={form.title}
                  onChange={updateField}
                  placeholder="Ex.: Coordenação Acadêmica"
                  required
                />
                </label>
                <label>
                Responsável
                <input
                  name="personName"
                  value={form.personName}
                  onChange={updateField}
                  placeholder="Nome do responsável"
                />
                </label>
                <label>
                Tipo de item
                <select name="type" value={form.type} onChange={updateField}>
                  {ORGANIZATION_NODE_TYPES.map((type) => (
                    <option key={type} value={type}>{ORGANIZATION_TYPE_LABELS[type]}</option>
                  ))}
                </select>
                </label>
                <label>
                Vinculado a
                <select name="parentId" value={form.parentId} onChange={updateField}>
                  <option value="">Sem superior (nível principal)</option>
                  {orderedNodes
                    .filter((node) => node.id !== editingId)
                    .map((node) => (
                      <option key={node.id} value={node.id}>
                        {'— '.repeat(Math.min(getNodeDepth(node, chart.nodes), 3))}{node.title}
                      </option>
                    ))}
                </select>
                </label>
                <label>
                Ordem no mesmo nível
                <input
                  type="number"
                  min="0"
                  name="order"
                  value={form.order}
                  onChange={updateField}
                />
                </label>
                <label className={styles.full}>
                Informações complementares
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  rows={4}
                  placeholder="Use uma linha para cada informação adicional."
                />
                </label>
                <label className={styles.active}>
                <input type="checkbox" name="active" checked={form.active} onChange={updateField} />
                <span><strong>Visível no site</strong><small>Itens desativados permanecem salvos no painel.</small></span>
                </label>
                <button className={styles.save} disabled={saving}>
                  {saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Adicionar ao organograma'}
                </button>
              </form>

              <section className={styles.livePreview} aria-live="polite">
                <div className={styles.previewHeading}>
                  <div>
                    <span className={styles.previewEyebrow}>
                      <Eye size={16} /> Pré-visualização em tempo real
                    </span>
                    <p>Assim este item aparecerá no organograma público.</p>
                  </div>
                  <span className={`${styles.visibilityBadge} ${!form.active ? styles.hiddenBadge : ''}`}>
                    {form.active ? <Eye size={15} /> : <EyeSlash size={15} />}
                    {form.active ? 'Visível' : 'Oculto'}
                  </span>
                </div>

                <div className={`${styles.previewStage} ${!form.active ? styles.previewHidden : ''}`}>
                  <div className={styles.previewRelation}>
                    <span>{previewParent ? 'Vinculado a' : 'Nível principal'}</span>
                    <strong>{previewParent?.title || 'Estrutura institucional'}</strong>
                  </div>
                  <div className={styles.previewConnector} aria-hidden="true" />
                  <article
                    className={`${styles.previewCard} ${styles[`preview${form.type}`]}`}
                  >
                    <span className={styles.previewType}>
                      {form.type === 'ADVISORY'
                        ? 'Apoio à direção'
                        : form.type === 'ENTITY'
                          ? 'Mantenedora'
                          : form.type === 'LEADERSHIP'
                            ? 'Faculdade Zacarias de Góes'
                            : 'Área institucional'}
                    </span>
                    <h3>{form.title.trim() || 'Cargo, setor ou unidade'}</h3>
                    {form.personName.trim() && <strong>{form.personName}</strong>}
                    {form.description.trim() && (
                      <p>
                        {form.description.split('\n').map((line, index) => (
                          line.trim() && <span key={`${line}-${index}`}>{line}</span>
                        ))}
                      </p>
                    )}
                  </article>
                  {!form.active && (
                    <p className={styles.hiddenMessage}>
                      Este item ficará salvo, mas não aparecerá na página pública.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </section>

          <aside className={styles.courseCard}>
            <div className={styles.cardHeading}>
              <span className={`${styles.headingIcon} ${styles.courseIcon}`}><GraduationCap size={24} /></span>
              <div>
                <h2>Coordenação de cursos</h2>
                <p>Sincronizada automaticamente com os cursos.</p>
              </div>
            </div>
            <div className={styles.courseList}>
              {chart.courses.length ? chart.courses.map((course) => (
                <div className={styles.courseRow} key={course.id}>
                  <span><GraduationCap size={18} /></span>
                  <div><strong>{course.name}</strong><small>{course.coordinator}</small></div>
                </div>
              )) : (
                <div className={styles.empty}>Nenhum curso possui coordenador informado.</div>
              )}
            </div>
            {hasPermission('courses') && (
              <button className={styles.manageCourses} onClick={() => router.push('/admin/cursos')}>
                Editar coordenadores nos cursos <ArrowSquareOut size={17} />
              </button>
            )}
          </aside>
        </div>

        <section className={styles.structureCard}>
          <div className={styles.structureHeading}>
            <div>
              <span className={styles.eyebrow}>Hierarquia cadastrada</span>
              <h2>Estrutura atual</h2>
            </div>
            <div className={styles.total}><TreeStructure size={18} /> {chart.nodes.length} itens</div>
          </div>

          {orderedNodes.length ? (
            <div className={`${styles.nodeList} ${draggedId ? styles.dragMode : ''}`}>
              <div className={styles.dragHelp}>
                <DotsSixVertical size={19} />
                Arraste pelo marcador. Use a linha para ordenar ou solte dentro de um cartão para criar um vínculo.
              </div>
              <div
                className={`${styles.rootDropZone} ${activeDropZone === 'root' ? styles.rootDropZoneActive : ''}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setActiveDropZone('root');
                }}
                onDragLeave={() => setActiveDropZone(null)}
                onDrop={(event) => {
                  event.preventDefault();
                  const position = chart.nodes.filter(
                    (node) => node.parentId === null && node.id !== draggedId
                  ).length;
                  moveNode(null, position);
                }}
              >
                Soltar aqui para mover ao nível principal
              </div>
              {orderedNodes.map((node) => {
                const parent = chart.nodes.find((item) => item.id === node.parentId);
                const depth = getNodeDepth(node, chart.nodes);
                const invalidChildTarget = isInsideDraggedBranch(node.id);
                const dropBeforeId = `before-${node.id}`;
                const dropInsideId = `inside-${node.id}`;
                return (
                  <div className={styles.draggableGroup} key={node.id}>
                    <div
                      className={`${styles.dropLine} ${activeDropZone === dropBeforeId ? styles.dropLineActive : ''}`}
                      style={{ '--node-depth': Math.min(depth, 5) } as React.CSSProperties}
                      onDragOver={(event) => {
                        if (!draggedId || draggedId === node.id || isInsideDraggedBranch(node.parentId)) return;
                        event.preventDefault();
                        event.stopPropagation();
                        setActiveDropZone(dropBeforeId);
                      }}
                      onDragLeave={() => setActiveDropZone(null)}
                      onDrop={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        dropBeforeNode(node);
                      }}
                    >
                      <span>Posicionar aqui</span>
                    </div>
                    <article
                      className={[
                        styles.nodeRow,
                        !node.active ? styles.inactive : '',
                        draggedId === node.id ? styles.dragging : '',
                        activeDropZone === dropInsideId ? styles.childDropActive : '',
                        invalidChildTarget && draggedId ? styles.invalidDrop : '',
                      ].filter(Boolean).join(' ')}
                      style={{ '--node-depth': Math.min(depth, 5) } as React.CSSProperties}
                      onDragOver={(event) => {
                        if (!draggedId || invalidChildTarget) return;
                        event.preventDefault();
                        event.dataTransfer.dropEffect = 'move';
                        setActiveDropZone(dropInsideId);
                      }}
                      onDragLeave={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                          setActiveDropZone(null);
                        }
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        if (!invalidChildTarget) dropInsideNode(node);
                      }}
                    >
                      <span
                        className={styles.dragHandle}
                        draggable={!saving}
                        role="button"
                        tabIndex={0}
                        title={`Arrastar ${node.title}`}
                        aria-label={`Arrastar ${node.title}`}
                        onDragStart={(event) => {
                          event.dataTransfer.effectAllowed = 'move';
                          event.dataTransfer.setData('text/plain', node.id);
                          setDraggedId(node.id);
                        }}
                        onDragEnd={() => {
                          setDraggedId(null);
                          setActiveDropZone(null);
                        }}
                      >
                        <DotsSixVertical size={23} weight="bold" />
                      </span>
                      <span className={styles.nodeIcon}>
                        {node.type === 'ENTITY' || node.type === 'LEADERSHIP'
                          ? <Buildings size={21} />
                          : <TreeStructure size={21} />}
                      </span>
                      <div className={styles.nodeInfo}>
                        <span>{ORGANIZATION_TYPE_LABELS[node.type]} · ordem {node.order}</span>
                        <h3>{node.title}</h3>
                        <p>
                          {node.personName || 'Sem responsável informado'}
                          {parent ? ` · vinculado a ${parent.title}` : ' · nível principal'}
                        </p>
                      </div>
                      {!node.active && <span className={styles.inactiveBadge}>Oculto</span>}
                      <span className={styles.childDropLabel}>
                        {invalidChildTarget ? 'Movimento inválido' : `Vincular dentro de ${node.title}`}
                      </span>
                      <div className={styles.rowActions}>
                        <button onClick={() => editNode(node)}><PencilSimple size={18} /> Editar</button>
                        <button className={styles.delete} onClick={() => deleteNode(node)} title="Excluir">
                          <Trash size={18} />
                        </button>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.empty}>Nenhum item cadastrado no organograma.</div>
          )}
        </section>
      </main>
    </div>
  );
}
