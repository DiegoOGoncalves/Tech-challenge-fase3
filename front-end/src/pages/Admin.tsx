import { Edit3, FilePlus2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../api';
import { ConfirmModal } from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Button, Page, Row } from '../styles';
import type { Post } from '../types';

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  margin-bottom: 30px;
  h1 {
    font: 700 3.5rem/1 ${({ theme }) => theme.fonts.display};
    margin: 10px 0;
    letter-spacing: -0.04em;
  }
  p {
    color: ${({ theme }) => theme.colors.muted};
  }
  @media (max-width: 600px) {
    align-items: stretch;
    flex-direction: column;
    h1 {
      font-size: 2.8rem;
    }
    button {
      width: 100%;
    }
  }
`;
const TableWrap = styled.div`
  overflow: hidden;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 12px;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  th,
  td {
    text-align: left;
    padding: 17px 20px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
    overflow-wrap: anywhere;
  }
  th {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  tr:last-child td {
    border: 0;
  }
  @media (max-width: 768px) {
    display: block;
    min-width: 0;
    thead {
      display: none;
    }
    tbody,
    tr,
    td {
      display: block;
      width: 100%;
    }
    tr {
      padding: 16px;
      border-bottom: 1px solid ${({ theme }) => theme.colors.line};
    }
    tr:last-child {
      border-bottom: 0;
    }
    td {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 7px 0;
      border: 0;
      min-width: 0;
      &:first-child {
        display: block;
        padding-top: 0;
        font-size: 1rem;
      }
      &:first-child::before {
        content: 'Postagem';
        display: block;
        margin-bottom: 4px;
        color: ${({ theme }) => theme.colors.muted};
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      &:nth-child(2)::before {
        content: 'Autor';
        color: ${({ theme }) => theme.colors.muted};
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      &:nth-child(3)::before {
        content: 'Publicada em';
        color: ${({ theme }) => theme.colors.muted};
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      &:last-child {
        justify-content: flex-end;
        padding-bottom: 0;
      }
    }
  }
`;

export function Admin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selected, setSelected] = useState<number>();
  const { user } = useAuth();
  const { show } = useToast();
  useEffect(() => {
    void api
      .get<Post[]>('/posts')
      .then((response) => setPosts(response.data))
      .catch(() => show('Não foi possível carregar seu painel.', 'error'));
  }, [show]);
  const remove = async () => {
    if (!selected) return;
    try {
      await api.delete(`/posts/${selected}`);
      setPosts((items) => items.filter((post) => post.id !== selected));
      show('Postagem excluída.');
    } catch {
      show('Não foi possível excluir a postagem.', 'error');
    } finally {
      setSelected(undefined);
    }
  };
  const isOwner = (post: Post) =>
    Boolean(
      user &&
      (post.authorId !== undefined
        ? String(user.id) === String(post.authorId)
        : user.username === post.author),
    );
  return (
    <Page>
      <Top>
        <div>
          <span
            style={{
              color: '#e87856',
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: '.8rem',
            }}
          >
            Área docente
          </span>
          <h1>Seu painel</h1>
          <p>Publique, revise e mantenha sua biblioteca em movimento.</p>
        </div>
        <Button as={Link} to="/admin/create">
          <FilePlus2 size={18} /> Criar nova postagem
        </Button>
      </Top>
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th>Postagem</th>
              <th>Autor</th>
              <th>Publicada em</th>
              <th>
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <strong>{post.title}</strong>
                </td>
                <td>{post.author}</td>
                <td>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>
                  {isOwner(post) && (
                    <Row $gap={6} style={{ justifyContent: 'flex-end' }}>
                      <Button
                        as={Link}
                        to={`/admin/edit/${post.id}`}
                        $variant="ghost"
                        aria-label={`Editar ${post.title}`}
                      >
                        <Edit3 size={17} />
                      </Button>
                      <Button
                        $variant="danger"
                        aria-label={`Excluir ${post.title}`}
                        onClick={() => setSelected(post.id)}
                      >
                        <Trash2 size={17} />
                      </Button>
                    </Row>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
      {selected && (
        <ConfirmModal
          onClose={() => setSelected(undefined)}
          onConfirm={remove}
        />
      )}
    </Page>
  );
}
