import styled from 'styled-components'

const StyledFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;
  padding: 1.2rem 0;
  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
    
  }

  &:has(button) {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 1.2rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    overflow: hidden;
    gap: 1.6rem;
    &:has(button) {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
    
  }
  }

  @media (max-width: 480px) {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    align-items: flex-start;
  }
`

const Label = styled.label`
  font-weight: 500;
`

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
  white-space: nowrap;
`
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`

export default function FormRow ({ label, error, children }) {
  return (
    <StyledFormRow>
      <>
        {label && <Label htmlFor={children.props.id}>{label}</Label>}
        <InputWrapper>
          {children}
          {error && <Error>{error}</Error>}
        </InputWrapper>
      </>
    </StyledFormRow>
  )
}
