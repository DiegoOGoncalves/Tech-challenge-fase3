import { Search, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { api } from '../api';
import { ConfirmModal } from '../components/Modal';
import { PostCard } from '../components/PostCard';
import { Skeleton } from '../components/Skeleton';
import { useToast } from '../contexts/ToastContext';
import { Button, Input, Page, Row } from '../styles';
import type { Post } from '../types';

const Hero = styled.section`
  padding: 54px 0 38px;
  max-width: 760px;
  h1 {
    max-width: 720px;
    margin: 14px 0;
    font: 700 clamp(2.5rem, 7vw, 5.3rem)/0.98
      ${({ theme }) => theme.fonts.display};
    letter-spacing: -0.04em;
  }
  p {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 1.12rem;
    line-height: 1.65;
    max-width: 600px;
  }
  @media (min-width: 769px) {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    p {
      margin-left: auto;
      margin-right: auto;
    }
  }
`;
const SearchBox = styled.form`
  display: flex;
  gap: 10px;
  padding: 8px;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 10px;
  max-width: 620px;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  input {
    border: 0;
    outline: 0;
  }
  @media (min-width: 769px) {
    margin-left: auto;
    margin-right: auto;
    text-align: left;
  }
  @media (max-width: 520px) {
    button {
      width: 48px;
      padding: 0;
      span {
        display: none;
      }
    }
  }
`;
const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 18px;
`;

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Post>();
  const { show } = useToast();

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const url = query.trim()
          ? `/posts/search?q=${encodeURIComponent(query.trim())}`
          : '/posts';
        const response = await api.get<Post[]>(url);
        setPosts(response.data);
      } catch {
        show('Não foi possível carregar as postagens.', 'error');
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [query, show]);

  const remove = async () => {
    if (!selected) return;
    try {
      await api.delete(`/posts/${selected.id}`);
      setPosts((items) => items.filter((post) => post.id !== selected.id));
      show('Postagem excluída.');
    } catch {
      show('Não foi possível excluir a postagem.', 'error');
    } finally {
      setSelected(undefined);
    }
  };

  return (
    <Page>
      <Hero>
        <Row $gap={8}>
          <Sparkles size={17} color="#e87856" />
          <strong
            style={{
              color: '#356859',
              fontSize: '.82rem',
              textTransform: 'uppercase',
              letterSpacing: '.1em',
            }}
          >
            Biblioteca aberta
          </strong>
        </Row>
        <h1>Ideias que merecem espaço para crescer.</h1>
        <p>
          Um lugar para acompanhar pesquisas, ensaios e descobertas da nossa
          comunidade acadêmica.
        </p>
        <SearchBox onSubmit={(event) => event.preventDefault()}>
          <Search size={20} style={{ margin: '13px 4px 0 8px' }} />
          <Input
            aria-label="Buscar postagens"
            placeholder="Buscar por título ou assunto"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button type="submit">
            <Search size={17} />
            <span>Buscar</span>
          </Button>
        </SearchBox>
      </Hero>
      <Row style={{ justifyContent: 'space-between', marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontFamily: 'Fraunces, serif' }}>
          {query ? `Resultados para "${query}"` : 'Últimas publicações'}
        </h2>
        <span style={{ color: '#68736a', fontSize: '.9rem' }}>
          {!loading &&
            `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`}
        </span>
      </Row>
      {loading ? (
        <Grid>
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} />
          ))}
        </Grid>
      ) : posts.length ? (
        <Grid>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={setSelected} />
          ))}
        </Grid>
      ) : (
        <div
          style={{
            padding: '48px 20px',
            textAlign: 'center',
            border: '1px dashed #cfd8cb',
            borderRadius: 16,
          }}
        >
          <h3>Nada encontrado por aqui</h3>
          <p style={{ color: '#68736a' }}>Tente uma palavra diferente.</p>
        </div>
      )}
      {selected && (
        <ConfirmModal
          onClose={() => setSelected(undefined)}
          onConfirm={remove}
        />
      )}
    </Page>
  );
}
