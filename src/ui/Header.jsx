import styled from 'styled-components'
import HeaderMenu from './HeaderMenu'
import UserAvtar from '../features/authentication/UserAvatar'
import SearchableList from '../features/search/ SearchableList'
import useBookings from '../features/bookings/useBookings'

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;
  justify-content: flex-end;
  gap: 2.4rem;
  align-items: center;
`

function Header () {
    //const {bookings} = useBookings()
return (
    <StyledHeader>
        {/* <SearchableList bookings={bookings} darkMode={true} /> */}
        <UserAvtar />
        <HeaderMenu />
    </StyledHeader>
)
}

export default Header
