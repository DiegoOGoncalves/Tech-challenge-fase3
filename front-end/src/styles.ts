import { createGlobalStyle, styled } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');
  :root { font-family: ${({ theme }) => theme.fonts.body}; color: ${({ theme }) => theme.colors.ink}; background: ${({ theme }) => theme.colors.paper}; }
  * { box-sizing: border-box; }
  body { margin: 0; min-width: 320px; background: radial-gradient(circle at 90% 0%, #edf5e8 0, transparent 30%), ${({ theme }) => theme.colors.paper}; }
  button, input, textarea { font: inherit; }
  button, a { -webkit-tap-highlight-color: transparent; }
  a { color: inherit; text-decoration: none; }
  :focus-visible { outline: 3px solid ${({ theme }) => theme.colors.coral}; outline-offset: 3px; }
`;

export const Page = styled.main`
  max-width: 1180px;
  margin: 0 auto;
  padding: 42px 24px 80px;
  @media (max-width: 640px) {
    padding: 28px 16px 56px;
  }
`;
export const Stack = styled.div<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap = 20 }) => `${$gap}px`};
`;
export const Row = styled.div<{ $gap?: number }>`
  display: flex;
  align-items: center;
  gap: ${({ $gap = 12 }) => `${$gap}px`};
`;
export const Button = styled.button<{
  $variant?: 'primary' | 'ghost' | 'danger';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  font-weight: 700;
  transition:
    transform 0.2s,
    background 0.2s;
  background: ${({ theme, $variant = 'primary' }) => ($variant === 'primary' ? theme.colors.moss : $variant === 'danger' ? '#fae4df' : 'transparent')};
  color: ${({ theme, $variant = 'primary' }) => ($variant === 'primary' ? '#fff' : $variant === 'danger' ? theme.colors.danger : theme.colors.mossDark)};
  &:hover {
    transform: translateY(-1px);
    filter: brightness(0.97);
  }
  &:disabled {
    cursor: wait;
    opacity: 0.65;
    transform: none;
  }
`;
export const Input = styled.input`
  width: 100%;
  min-height: 48px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 0 14px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.ink};
  &:focus {
    border-color: ${({ theme }) => theme.colors.moss};
    outline: 2px solid ${({ theme }) => theme.colors.mint};
  }
`;
export const Textarea = styled.textarea`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 14px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.ink};
  resize: vertical;
  &:focus {
    border-color: ${({ theme }) => theme.colors.moss};
    outline: 2px solid ${({ theme }) => theme.colors.mint};
  }
`;
