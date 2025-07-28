import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { PAGE_SIZE } from '../utils/constant'

const StyledPagination = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: start;
    gap: 0.6rem;
    align-items: center;
  }
`

const P = styled.p`
  font-size: 1.4rem;
  margin-left: 0.8rem;

  & span {
    font-weight: 600;
  }
  
`

const Buttons = styled.div`
  display: flex;
  gap: 0.6rem;
`
const ButtonNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  @media (max-width: 480px) {
    display: none;
  }
`
const PaginationButton = styled.button`
  background-color: ${props =>
    props.active ? ' var(--color-brand-600)' : 'var(--color-grey-50)'};
  color: ${props => (props.active ? ' var(--color-brand-50)' : 'inherit')};
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s;

  &:has(span:last-child) {
    padding-left: 0.4rem;
  }

  &:has(span:first-child) {
    padding-right: 0.4rem;
  }

  & svg {
    height: 1.8rem;
    width: 1.8rem;
  }

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
 
`

function Pagination ({ count }) {
  const [searchParams, setSearchParams] = useSearchParams()
  //   const currentPage = !searchParams.get('page')    ? 1
  //     : Number(searchParams.get('page'))

  // 🔹 Initially, there is no page in the URL, unless you manually include it like ?page=1.
  // So when the user first visits:

  // There is no page query parameter, so this line:

  // searchParams.get('page') returns null

  // Number(null) becomes 0 (falsy)

  // 0 || 1 → 1 ✅

  // So currentPage defaults to 1.

  // we don’t require the URL to have ?page=1 — the logic handles it gracefully.

  const currentPage = Number(searchParams.get('page')) || 1 //0 || 1 = 1

  const pageCount = Math.ceil(count / PAGE_SIZE) // 50 / 10 = 5
  if (pageCount <= 1) return null // if there is only one page, don't show the pagination

  function nextPage () {
    const next = currentPage === pageCount ? 1 : currentPage + 1
    searchParams.set('page', next)
    setSearchParams(searchParams)
  }

  function previousPage () {
    const previous = currentPage === 1 ? pageCount : currentPage - 1
    searchParams.set('page', previous)
    setSearchParams(searchParams)
  }

  function goToPage (page) {
    searchParams.set('page', page)
    setSearchParams(searchParams)
  }

  return (
    <StyledPagination>
      <P>
        Showing <span>{(currentPage - 1) * PAGE_SIZE + 1}</span> to{' '}
        <span>
          {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
        </span>{' '}
        of<span> {count}</span> results
      </P>
      <Buttons>
        <PaginationButton onClick={previousPage} disabled={currentPage === 1}>
          <HiChevronLeft />
          <span>Previous</span>
        </PaginationButton>

        {Array.from({ length: pageCount }, (_, i) => i + 1).map(pageNum => (
            <ButtonNumber>
          <PaginationButton
            key={pageNum}
            active={pageNum === currentPage}
            onClick={() => goToPage(pageNum)}
            >
            {pageNum}
          </PaginationButton>
            </ButtonNumber>
          ))}
        <PaginationButton
          onClick={nextPage}
          disabled={currentPage === pageCount}
        >
          <HiChevronRight onClick={nextPage} />
          <span>Next</span>
        </PaginationButton>
      </Buttons>
    </StyledPagination>
  )
}
export default Pagination
