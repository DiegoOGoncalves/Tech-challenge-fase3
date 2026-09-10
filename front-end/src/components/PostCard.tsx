import {
  ArrowUpRight,
  CalendarDays,
  Edit3,
  MoreVertical,
  Trash2,
  UserRound,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import type { Post } from '../types';

const Card = styled.article`
  position: relative;
  padding: 24px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  flex-direction: column;
  min-height: 260px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.soft};
  }
`;
const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.84rem;
  margin-top: auto;
  padding-top: 20px;
  @media (max-width: 768px) {
    .date {
      display: none;
    }
  }
`;
const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.55rem;
  line-height: 1.15;
  margin: 12px 0 10px;
`;
const Summary = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.65;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
const Read = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.colors.moss};
  font-weight: 700;
  margin-top: 18px;
  font-size: 0.9rem;
`;
const Actions = styled.div`
  position: absolute;
  top: 18px;
  right: 18px;
  display: flex;
  gap: 4px;
  .mobile-actions {
    display: none;
  }
  @media (max-width: 768px) {
    .desktop-actions {
      display: none;
    }
    .mobile-actions {
      display: block;
      position: relative;
    }
  }
`;
const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.colors.mossDark};
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.mint};
  }
`;
const Popover = styled.div`
  position: absolute;
  top: 42px;
  right: 0;
  z-index: 2;
  min-width: 140px;
  padding: 6px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  display: grid;
  gap: 2px;
`;
const MenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: ${({ theme, $danger }) => ($danger ? theme.colors.danger : theme.colors.ink)};
  text-align: left;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.mint};
  }
`;

interface PostCardProps {
  post: Post;
  onDelete: (post: Post) => void;
}
export function PostCard({ post, onDelete }: PostCardProps) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isOwner = Boolean(
    user &&
    (post.authorId !== undefined
      ? String(user.id) === String(post.authorId)
      : user.username === post.author),
  );

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  return (
    <Card>
      <div>
        <span
          style={{
            color: 'var(--moss)',
            fontSize: '.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '.08em',
          }}
        >
          Ensaio acadêmico
        </span>
        <Title>{post.title}</Title>
        <Summary>{post.content}</Summary>
      </div>
      <Meta>
        <span>
          <UserRound size={14} /> {post.author}
        </span>
        <span className="date">
          <CalendarDays size={14} />{' '}
          {new Date(post.createdAt).toLocaleDateString('pt-BR')}
        </span>
      </Meta>
      <Read to={`/posts/${post.id}`}>
        Continuar leitura <ArrowUpRight size={16} />
      </Read>
      {isOwner && (
        <Actions ref={menuRef}>
          <div className="desktop-actions">
            <ActionButton
              as={Link}
              to={`/admin/edit/${post.id}`}
              aria-label={`Editar ${post.title}`}
              title="Editar"
            >
              <Edit3 size={17} />
            </ActionButton>
            <ActionButton
              onClick={() => onDelete(post)}
              aria-label={`Excluir ${post.title}`}
              title="Excluir"
            >
              <Trash2 size={17} />
            </ActionButton>
          </div>
          <div className="mobile-actions">
            <ActionButton
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Mais ações"
              aria-expanded={menuOpen}
            >
              <MoreVertical size={20} />
            </ActionButton>
            {menuOpen && (
              <Popover>
                <MenuItem
                  as={Link}
                  to={`/admin/edit/${post.id}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <Edit3 size={16} /> Editar
                </MenuItem>
                <MenuItem
                  $danger
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(post);
                  }}
                >
                  <Trash2 size={16} /> Excluir
                </MenuItem>
              </Popover>
            )}
          </div>
        </Actions>
      )}
    </Card>
  );
}
