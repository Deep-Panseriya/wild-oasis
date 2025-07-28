import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import Header from "./Header";
import styled from "styled-components";

const StyledAppLayOut = styled.div`
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
  @media (max-width: 768px) {
    grid-template-columns: 120px auto;
  }
`;

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
  overflow-y: scroll;
  @media (max-width: 768px) {
    width: auto;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    height: max-content;
  }
`;

const Container = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  max-width: 120rem;
  gap: 3.2rem;
  @media (max-width: 768px) {
    width: auto;
    margin: 0;
    overflow-y: scroll;
  }
`;

function AppLayOut() {
  return (
    <StyledAppLayOut>
      <Header />
      <Sidebar />
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayOut>
  );
}

export default AppLayOut;
