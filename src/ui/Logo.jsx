import styled from 'styled-components'
import { useDarkMode } from '../context/DarkModeContext'
import logoLight from '../../public/logo-light.png'
import logoDark from '../../public/logo-dark.png'

const StyledLogo = styled.div`
  text-align: center;
`

const Img = styled.img`
  height: 9.6rem;
  width: auto;
  @media (max-width: 768px) {
    display: block;
    margin: 0 auto;
    height: 6.4rem;
  }
`

function Logo () {
  const { isDarkMode } = useDarkMode()
  const src = isDarkMode ? logoDark : logoLight
  return (
    <StyledLogo>
      <Img src={src} alt='Logo' />
    </StyledLogo>
  )
}

export default Logo
