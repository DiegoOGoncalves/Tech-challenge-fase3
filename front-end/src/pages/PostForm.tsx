import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Button, Input, Page, Stack, Textarea } from '../styles';
import type { Post } from '../types';

const FormShell = styled.div`
  max-width: 760px;
  margin: 0 auto;
  h1 {
    font: 700 3.2rem/1 ${({ theme }) => theme.fonts.display};
    letter-spacing: -0.04em;
    margin: 30px 0 8px;
  }
  .intro {
    color: ${({ theme }) => theme.colors.muted};
    margin-bottom: 34px;
  }
`;
const Field = styled.label`
  display: grid;
  gap: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  span {
    color: ${({ theme }) => theme.colors.danger};
    font-size: 0.8rem;
  }
`;
interface FormValues {
  title: string;
  content: string;
}
const initial: FormValues = { title: '', content: '' };

export function PostForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const { user } = useAuth();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { show } = useToast();

  useEffect(() => {
    if (!id) return;
    api
      .get<Post>(`/posts/${id}`)
      .then(({ data }) =>
        setValues({ title: data.title, content: data.content }),
      )
      .catch(() => show('Não foi possível carregar a postagem.', 'error'))
      .finally(() => setLoading(false));
  }, [id, show]);

  const update = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const next: Partial<FormValues> = {};
    (Object.keys(values) as (keyof FormValues)[]).forEach((field) => {
      if (!values[field].trim()) next[field] = 'Campo obrigatório';
    });
    if (values.content.trim().length < 30)
      next.content = 'Escreva pelo menos 30 caracteres';
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setSaving(true);
    try {
      if (editing) await api.put(`/posts/${id}`, values);
      else await api.post('/posts', { ...values, author: user?.username });
      show(editing ? 'Postagem atualizada.' : 'Postagem criada.');
      navigate('/admin');
    } catch {
      show('Não foi possível salvar a postagem.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Page>
        <p>Carregando formulário...</p>
      </Page>
    );
  return (
    <Page>
      <FormShell>
        <Link
          to="/admin"
          style={{
            display: 'inline-flex',
            gap: 8,
            color: '#356859',
            fontWeight: 700,
          }}
        >
          <ArrowLeft size={17} /> Voltar para o painel
        </Link>
        <h1>{editing ? 'Editar postagem' : 'Nova postagem'}</h1>
        <p className="intro">Dê forma a uma nova ideia para a comunidade.</p>
        <form onSubmit={submit}>
          <Stack $gap={22}>
            <Field>
              Título
              <Input
                value={values.title}
                onChange={(event) => update('title', event.target.value)}
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title && <span>{errors.title}</span>}
            </Field>
            <Field>
              Conteúdo
              <Textarea
                rows={14}
                value={values.content}
                onChange={(event) => update('content', event.target.value)}
                aria-invalid={Boolean(errors.content)}
              />
              {errors.content && <span>{errors.content}</span>}
            </Field>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <Button as={Link} to="/admin" $variant="ghost">
                Cancelar
              </Button>
              <Button disabled={saving}>
                <Save size={17} /> {saving ? 'Salvando...' : 'Salvar postagem'}
              </Button>
            </div>
          </Stack>
        </form>
      </FormShell>
    </Page>
  );
}
