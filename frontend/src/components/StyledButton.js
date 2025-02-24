import styled from 'styled-components'

export const Button = styled.button`
    padding: ${(props) => props.theme.spacing.sm};
    background-color: ${(props) => props.theme.colors.primary};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        opacity: 0.9;
    }
`
