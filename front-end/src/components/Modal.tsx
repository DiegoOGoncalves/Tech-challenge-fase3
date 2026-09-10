import { AlertTriangle, X } from 'lucide-react';
import styled from 'styled-components';
import { Button, Row, Stack } from '../styles';
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(23, 33, 27, 0.48);
`;
const Dialog = styled.div`
  width: min(440px, 100%);
  padding: 28px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
`;
export function ConfirmModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Backdrop role="presentation" onMouseDown={onClose}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Row style={{ justifyContent: 'space-between' }}>
          <AlertTriangle color="#b63a3a" />
          <button aria-label="Fechar" onClick={onClose}>
            <X />
          </button>
        </Row>
        <Stack $gap={10}>
          <h2 id="confirm-title">Excluir postagem?</h2>
          <p style={{ color: '#68736a', lineHeight: 1.6 }}>
            Esta ação é permanente e não poderá ser desfeita.
          </p>
          <Row style={{ justifyContent: 'flex-end', marginTop: 12 }}>
            <Button $variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button $variant="danger" onClick={onConfirm}>
              Excluir postagem
            </Button>
          </Row>
        </Stack>
      </Dialog>
    </Backdrop>
  );
}
