import styled from 'styled-components';
const Shimmer = styled.div`
  height: 260px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: linear-gradient(100deg, #edf0e9 30%, #f8faf4 50%, #edf0e9 70%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  @keyframes shimmer {
    to {
      background-position: -200% 0;
    }
  }
`;
export function Skeleton() {
  return <Shimmer aria-label="Carregando postagens" />;
}
