import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/admin-login.module.scss';
import { Lock, Envelope, Warning } from 'phosphor-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading, login } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/admin/calendario-academico');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      login(response.data.user);
      router.push('/admin/calendario-academico');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className={styles.loginContainer}>
      <Head>
        <title>Admin | Login</title>
      </Head>

      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logo}>FAZAG</div>
          <h1 className={styles.title}>Painel Administrativo</h1>
          <p className={styles.subtitle}>Faça login para continuar</p>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
          {error && (
            <div className={styles.errorBadge}>
              <Warning size={20} />
              {error}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>E-mail</label>
            <div className={styles.inputWrapper}>
              <Envelope size={20} className={styles.icon} />
              <input 
                type="email" 
                placeholder="admin@fazag.edu.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Senha</label>
            <div className={styles.inputWrapper}>
              <Lock size={20} className={styles.icon} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

        <div className={styles.footer}>
          &copy; {new Date().getFullYear()} Faculdade de Guanambi
        </div>
      </div>
    </div>
  );
}
