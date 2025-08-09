import { Container } from 'react-bootstrap';
import MainNav from './MainNav';

export default function Layout({ children }) {
  return (
    <>
      <MainNav />
      {/* <br /> */}
      <Container style={{ paddingTop: '40px' }}>
        {children}
      </Container>
      {/* <br /> */}
    </>
  );
}
