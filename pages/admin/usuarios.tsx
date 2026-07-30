import { FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  ArrowLeft,
  Check,
  Lock,
  PencilSimple,
  Plus,
  ShieldCheck,
  User,
  Users,
  X,
} from 'phosphor-react';
import { AdminPermission, useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/admin-usuarios.module.scss';

interface ManagedUser {
  id: string;
  email: string;
  name: string | null;
  isSuperAdmin: boolean;
  permissions: AdminPermission[];
  active: boolean;
  createdAt: string;
}

const PERMISSIONS: Array<{ id: AdminPermission; label: string; description: string }> = [
  { id: 'courses', label: 'Cursos', description: 'Informações, publicação e documentos dos cursos' },
  { id: 'academic_calendar', label: 'Calendário acadêmico', description: 'Eventos, feriados e prazos letivos' },
  { id: 'nusp', label: 'NUSP', description: 'Configurações e consultas agendadas' },
  { id: 'ombudsman', label: 'Ouvidoria', description: 'Registros, relatórios e gráficos' },
  {
    id: 'institutional_publications',
    label: 'Publicações institucionais',
    description: 'Arquivos, publicação e agendamento',
  },
];

const emptyForm = {
  name: '',
  email: '',
  password: '',
  permissions: [] as AdminPermission[],
  active: true,
};

export default function AdminUsers() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [usersList, setUsersList] = useState<ManagedUser[]>([]);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/admin/login');
    else if (!user.isSuperAdmin) router.replace('/admin');
  }, [loading, user, router]);

  const loadUsers = useCallback(async () => {
    try {
      const response = await axios.get<ManagedUser[]>('/api/admin-users');
      setUsersList(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Não foi possível carregar os usuários.');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (user?.isSuperAdmin) loadUsers();
  }, [user, loadUsers]);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setSuccess('');
  };

  const startEdit = (managedUser: ManagedUser) => {
    setEditingId(managedUser.id);
    setForm({
      name: managedUser.name || '',
      email: managedUser.email,
      password: '',
      permissions: managedUser.permissions,
      active: managedUser.active,
    });
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePermission = (permission: AdminPermission) => {
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item) => item !== permission)
        : [...current.permissions, permission],
    }));
  };

  const editingUser = usersList.find((managedUser) => managedUser.id === editingId);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await axios.put(`/api/admin-users/${editingId}`, form);
        setSuccess('Usuário atualizado com sucesso.');
      } else {
        await axios.post('/api/admin-users', form);
        setSuccess('Usuário criado com sucesso.');
        setForm(emptyForm);
      }
      await loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Não foi possível salvar o usuário.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user?.isSuperAdmin || fetching) {
    return <div className={styles.loading}>Carregando usuários...</div>;
  }

  return (
    <div className={styles.page}>
      <Head><title>Admin | Usuários</title></Head>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => router.push('/admin')}>
          <ArrowLeft size={19} /> Painel
        </button>
        <div>
          <span className={styles.eyebrow}>Acesso administrativo</span>
          <h1>Usuários do painel</h1>
          <p>Crie contas e escolha exatamente quais áreas cada pessoa pode acessar.</p>
        </div>
        <button className={styles.newButton} onClick={startCreate}>
          <Plus size={19} /> Novo usuário
        </button>
      </header>

      <main className={styles.layout}>
        <section className={styles.formCard}>
          <div className={styles.cardHeading}>
            <div className={styles.headingIcon}>{editingId ? <PencilSimple size={22} /> : <Plus size={22} />}</div>
            <div>
              <h2>{editingId ? 'Editar usuário' : 'Cadastrar usuário'}</h2>
              <p>{editingId ? 'Deixe a senha vazia para mantê-la.' : 'A senha deve ter pelo menos 8 caracteres.'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className={styles.error}><X size={18} /> {error}</div>}
            {success && <div className={styles.success}><Check size={18} /> {success}</div>}

            <div className={styles.fields}>
              <label>
                Nome
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Nome completo"
                  required
                />
              </label>
              <label>
                E-mail
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="usuario@fazag.edu.br"
                  required
                />
              </label>
              <label className={styles.fullField}>
                <span>{editingId ? 'Nova senha (opcional)' : 'Senha inicial'}</span>
                <div className={styles.passwordField}>
                  <Lock size={19} />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                    minLength={form.password ? 8 : undefined}
                    required={!editingId}
                    placeholder={editingId ? 'Preencha somente para trocar a senha' : 'Mínimo de 8 caracteres'}
                  />
                </div>
              </label>
            </div>

            <div className={styles.permissionsHeader}>
              <div>
                <h3>Permissões de acesso</h3>
                <p>O usuário verá apenas as áreas selecionadas.</p>
              </div>
              {!editingUser?.isSuperAdmin && (
                <button
                  type="button"
                  className={styles.selectAll}
                  onClick={() =>
                    setForm({
                      ...form,
                      permissions:
                        form.permissions.length === PERMISSIONS.length
                          ? []
                          : PERMISSIONS.map((permission) => permission.id),
                    })
                  }
                >
                  {form.permissions.length === PERMISSIONS.length ? 'Desmarcar todas' : 'Selecionar todas'}
                </button>
              )}
            </div>

            {editingUser?.isSuperAdmin ? (
              <div className={styles.superNotice}>
                <ShieldCheck size={24} />
                Superadministradores possuem acesso integral. As permissões individuais não podem ser limitadas.
              </div>
            ) : (
              <div className={styles.permissionGrid}>
                {PERMISSIONS.map((permission) => {
                  const selected = form.permissions.includes(permission.id);
                  return (
                    <button
                      type="button"
                      key={permission.id}
                      className={`${styles.permission} ${selected ? styles.permissionSelected : ''}`}
                      onClick={() => togglePermission(permission.id)}
                      aria-pressed={selected}
                    >
                      <span className={styles.checkbox}>{selected && <Check size={15} weight="bold" />}</span>
                      <span><strong>{permission.label}</strong><small>{permission.description}</small></span>
                    </button>
                  );
                })}
              </div>
            )}

            {editingId && editingId !== user.id && (
              <label className={styles.activeToggle}>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) => setForm({ ...form, active: event.target.checked })}
                />
                <span><strong>Usuário ativo</strong><small>Desative para bloquear novos acessos ao painel.</small></span>
              </label>
            )}

            <div className={styles.actions}>
              {editingId && <button type="button" className={styles.cancel} onClick={startCreate}>Cancelar edição</button>}
              <button type="submit" className={styles.save} disabled={saving}>
                {saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Criar usuário'}
              </button>
            </div>
          </form>
        </section>

        <aside className={styles.listCard}>
          <div className={styles.listHeading}>
            <div><Users size={22} /><h2>Usuários cadastrados</h2></div>
            <span>{usersList.length}</span>
          </div>
          <div className={styles.userList}>
            {usersList.map((managedUser) => (
              <button
                key={managedUser.id}
                className={`${styles.userRow} ${editingId === managedUser.id ? styles.userRowActive : ''}`}
                onClick={() => startEdit(managedUser)}
              >
                <span className={styles.avatar}><User size={20} /></span>
                <span className={styles.userText}>
                  <strong>{managedUser.name || 'Sem nome'}</strong>
                  <small>{managedUser.email}</small>
                  <span className={styles.tags}>
                    {managedUser.isSuperAdmin ? (
                      <em className={styles.superTag}>Superadministrador</em>
                    ) : (
                      <em>{managedUser.permissions.length} acessos</em>
                    )}
                    {!managedUser.active && <em className={styles.inactiveTag}>Inativo</em>}
                  </span>
                </span>
                <PencilSimple size={18} />
              </button>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}
