import type { ReactNode } from 'react';
import { BookOpen, LogOut, PenLine } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { Button, Row } from '../styles';
const Header = styled.header`
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  background: rgba(251, 250, 245, 0.9);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 10;
`;
const Nav = styled.nav`
  max-width: 1180px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  @media (max-width: 640px) {
    padding: 14px 16px;
  }
`;
const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors.mossDark};
  font-weight: 700;
  font-size: 1.02rem;
`;
const Actions = styled(Row)`
  @media (max-width: 560px) {
    span {
      display: none;
    }
  }
`;
export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return <>{children}</>;
  return (
    <>
      <Header>
        <Nav>
          <Brand to="/posts">
            <BookOpen size={24} />
            <span>BrainCodeSchool</span>
          </Brand>
          <Actions>
            <Link to="/posts">Explorar</Link>
            <span aria-label={`Usuário ${user.username}`}>{user.username}</span>
            {user.role === 'professor' && (
              <Button as={Link} to="/admin" $variant="ghost">
                <PenLine size={17} />
                <span>Docente</span>
              </Button>
            )}
            <Button
              $variant="ghost"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <LogOut size={17} />
              <span>Sair</span>
            </Button>
          </Actions>
        </Nav>
      </Header>
      {children}
    </>
  );
}
