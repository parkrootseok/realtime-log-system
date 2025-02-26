import styled from 'styled-components';

const BUTTON_VARIANTS = {
  primary: {
    background: '#3b82f6',
    hoverBackground: '#2563eb',
    color: '#ffffff',
  },
  secondary: {
    background: '#64748b',
    hoverBackground: '#475569',
    color: '#ffffff',
  },
  danger: {
    background: '#dc2626',
    hoverBackground: '#b91c1c',
    color: '#ffffff',
  },
  ghost: {
    background: 'transparent',
    hoverBackground: '#f1f5f9',
    color: '#64748b',
    border: '1px solid #e2e8f0',
  },
};

const BUTTON_SIZES = {
  sm: {
    padding: '6px 12px',
    fontSize: '12px',
  },
  md: {
    padding: '8px 16px',
    fontSize: '14px',
  },
  lg: {
    padding: '10px 20px',
    fontSize: '16px',
  },
};

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;

  /* 크기 */
  ${(props) => {
    const size = BUTTON_SIZES[props.$size || 'md'];
    return `
      padding: ${size.padding};
      font-size: ${size.fontSize};
    `;
  }}

  /* 변형 */
  ${(props) => {
    const variant = BUTTON_VARIANTS[props.$variant || 'primary'];
    return `
      background: ${variant.background};
      color: ${variant.color};
      border: ${variant.border || 'none'};

      &:hover:not(:disabled) {
        background: ${variant.hoverBackground};
      }
    `;
  }}

  /* 전체 너비 */
  ${(props) => props.$fullWidth && 'width: 100%;'}

  /* 비활성화 상태 */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* 로딩 상태 */
  ${(props) =>
    props.$loading &&
    `
    position: relative;
    color: transparent;
    pointer-events: none;

    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid #ffffff;
      border-radius: 50%;
      border-right-color: transparent;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `}
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  ${(props) =>
    props.$vertical &&
    `
    flex-direction: column;
    align-items: stretch;
  `}
`;
