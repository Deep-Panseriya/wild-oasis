import styled, { css } from 'styled-components'
import { useSearchParams } from 'react-router-dom'

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
  @media (max-width: 480px) {
    width: 90%;
    flex-direction: column;
    align-items: start;
    gap: 0.6rem;
    padding: 0.4rem 0.6rem;
    text-align: left;
    justify-content: flex-start;
    gap: 0.4rem;
  }
`

const FilterButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;
  border-radius: var(--border-radius-sm);
  ${props =>
    props.active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
  @media (max-width: 480px) {
    width: 100%;
    padding: 0.4rem 0.6rem;
    text-align: left;
    justify-content: flex-start;
    
  }
`

export default function Filter ({ filterField, options }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const filterValue = searchParams.get(filterField) || options[0].value
  //ANCHOR set the discount from the search params 
  function handleClick (value) {
    searchParams.set(filterField, value)
    setSearchParams(searchParams)
  }

  return (
    <StyledFilter>
      {options?.map(option => (
        <FilterButton
          key={option.value}
          onClick={() => handleClick(option.value)}
          active={option.value === filterValue}
          disabled={option.value === filterValue}
        >
          {option.label}
        </FilterButton>
      ))}
    </StyledFilter>
  )
}
