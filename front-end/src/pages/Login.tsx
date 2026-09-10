import { LockKeyhole } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Button, Input, Page, Stack } from '../styles';
const Shell = styled.div`
  max-width: 450px;
  margin: 7vh auto 0;
  padding: 34px;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  h1 {
    font: 700 2.4rem/1 ${({ theme }) => theme.fonts.display};
    margin: 20px 0 10px;
  }
  p {
    color: ${({ theme }) => theme.colors.muted};
    line-height: 1.55;
  }
`;
const Field = styled.label`
  display: grid;
  gap: 7px;
  font-weight: 700;
  font-size: 0.9rem;
  span {
    color: ${({ theme }) => theme.colors.danger};
    font-size: 0.8rem;
  }
`;
export function Login() {
  const { login, user } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!username || password.length < 6) {
      setError('Informe usuário e uma senha com pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      show('Login realizado. Bem-vindo de volta!');
      navigate(
        (location.state as { from?: { pathname: string } })?.from?.pathname ??
          '/posts',
      );
    } catch {
      setError(
        'Usuário ou senha inválidos. Confira seus dados e tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  };
  if (user) return <Navigate to="/posts" replace />;
  return (
    <Page>
      <Shell>
        <LockKeyhole size={28} color="#356859" />
        <h1>Bem-vindo ao Blogging Acadêmico</h1>
        <p>
          Entre para acompanhar pesquisas, ensaios e descobertas da nossa
          comunidade.
        </p>
        <form onSubmit={submit}>
          <Stack $gap={18}>
            <Field htmlFor="username">
              Usuário
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Field>
            <Field htmlFor="password">
              Senha
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Field>
            {error && (
              <div role="alert" style={{ color: '#b63a3a', fontSize: '.9rem' }}>
                {error}
              </div>
            )}
            <Button disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Stack>
        </form>
      </Shell>
    </Page>
  );
}
