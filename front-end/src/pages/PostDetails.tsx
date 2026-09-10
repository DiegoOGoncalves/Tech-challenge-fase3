import {
  ArrowLeft,
  CalendarDays,
  Edit3,
  MessageCircle,
  Send,
  Trash2,
  UserRound,
} from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../api';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Page, Stack } from '../styles';
import type { Comment, Post } from '../types';
const Article = styled.article`
  max-width: 760px;
  margin: 0 auto;
  padding-top: 34px;
  h1 {
    font: 700 clamp(2.4rem, 6vw, 4.8rem)/1.02
      ${({ theme }) => theme.fonts.display};
    letter-spacing: -0.04em;
    margin: 26px 0 18px;
  }
  .lead {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.muted};
  }
  .content {
    margin-top: 42px;
    white-space: pre-wrap;
    font-size: 1.1rem;
    line-height: 1.9;
  }
`;
const Comments = styled.section`
  max-width: 760px;
  margin: 64px auto 0;
  padding-top: 28px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
`;
const CommentItem = styled.article`
  padding: 14px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
`;
const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;
const CommentActions = styled.div`
  display: flex;
  gap: 4px;
`;
const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: ${({ theme }) => theme.colors.mossDark};
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.mint};
  }
`;
export function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState('');
  const [editingId, setEditingId] = useState<number>();
  const [editingContent, setEditingContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { show } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;

    Promise.all([
      api.get<Post>(`/posts/${id}`),
      api.get<Comment[]>(`/posts/${id}/comments`),
    ])
      .then(([postResponse, commentsResponse]) => {
        setPost(postResponse.data);
        setComments(commentsResponse.data);
      })
      .catch(() => show('Postagem não encontrada.', 'error'));
  }, [id, show]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const content = comment.trim();
    if (!content || !id || isSending) return;

    setIsSending(true);
    try {
      const response = await api.post<Comment>(`/posts/${id}/comments`, {
        content,
      });
      setComments((current) => [...current, response.data]);
      setComment('');
      show('Comentário publicado com sucesso.');
    } catch {
      show('Não foi possível publicar o comentário.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const editComment = async (item: Comment) => {
    const content = editingContent.trim();
    if (!content) return;
    try {
      const response = await api.put<Comment>(`/comments/${item.id}`, {
        content,
      });
      setComments((current) =>
        current.map((commentItem) =>
          commentItem.id === item.id ? response.data : commentItem,
        ),
      );
      setEditingId(undefined);
      setEditingContent('');
      show('Comentário atualizado.');
    } catch {
      show('Não foi possível atualizar o comentário.', 'error');
    }
  };

  const removeComment = async (item: Comment) => {
    if (!window.confirm('Excluir este comentário?')) return;
    try {
      await api.delete(`/comments/${item.id}`);
      setComments((current) =>
        current.filter((commentItem) => commentItem.id !== item.id),
      );
      show('Comentário excluído.');
    } catch {
      show('Não foi possível excluir o comentário.', 'error');
    }
  };

  if (!post)
    return (
      <Page>
        <p>Carregando leitura...</p>
      </Page>
    );

  return (
    <Page>
      <Article>
        <Link
          to="/posts"
          style={{
            display: 'inline-flex',
            gap: 8,
            color: '#356859',
            fontWeight: 700,
          }}
        >
          <ArrowLeft size={17} /> Voltar para a lista
        </Link>
        <h1>{post.title}</h1>
        <p className="lead">Uma reflexão publicada por {post.author}.</p>
        <div
          style={{
            display: 'flex',
            gap: 16,
            color: '#68736a',
            fontSize: '.9rem',
          }}
        >
          <span>
            <UserRound size={15} /> {post.author}
          </span>
          <span>
            <CalendarDays size={15} />{' '}
            {new Date(post.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
        <div className="content">{post.content}</div>
      </Article>
      <Comments>
        <h2>
          <MessageCircle size={22} /> Comentários
        </h2>
        <Stack $gap={12}>
          {comments.map((item) => {
            const isAuthor = String(user?.id) === String(item.authorId);
            const canDelete = isAuthor || user?.role === 'professor';
            return (
              <CommentItem key={item.id}>
                <CommentHeader>
                  <strong>{item.author?.username ?? 'Usuário'}</strong>
                  <CommentActions>
                    {isAuthor && (
                      <IconButton
                        onClick={() => {
                          setEditingId(item.id);
                          setEditingContent(item.content);
                        }}
                        aria-label="Editar comentário"
                        title="Editar"
                      >
                        <Edit3 size={15} />
                      </IconButton>
                    )}
                    {canDelete && (
                      <IconButton
                        onClick={() => removeComment(item)}
                        aria-label="Excluir comentário"
                        title="Excluir"
                      >
                        <Trash2 size={15} />
                      </IconButton>
                    )}
                  </CommentActions>
                </CommentHeader>
                {editingId === item.id ? (
                  <Stack $gap={8}>
                    <Input
                      value={editingContent}
                      onChange={(event) =>
                        setEditingContent(event.target.value)
                      }
                    />
                    <div>
                      <Button type="button" onClick={() => editComment(item)}>
                        Salvar
                      </Button>
                      <Button
                        type="button"
                        $variant="ghost"
                        onClick={() => setEditingId(undefined)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </Stack>
                ) : (
                  <p>{item.content}</p>
                )}
              </CommentItem>
            );
          })}
          {comments.length === 0 && (
            <p>Ainda não há comentários. Seja o primeiro a comentar.</p>
          )}
        </Stack>
        <form onSubmit={submit}>
          <Stack $gap={12}>
            <label htmlFor="comment">
              Compartilhe uma observação construtiva
            </label>
            <Input
              id="comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Escreva seu comentário..."
              disabled={isSending}
            />
            <Button
              type="submit"
              style={{ alignSelf: 'flex-start' }}
              disabled={isSending}
            >
              <Send size={16} />{' '}
              {isSending ? 'Publicando...' : 'Enviar comentário'}
            </Button>
          </Stack>
        </form>
      </Comments>
    </Page>
  );
}
