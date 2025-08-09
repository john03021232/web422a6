
// // components/MainNav.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { readToken, removeToken } from "../lib/authenticate"; // keep existing functions
import { addToHistory } from "../lib/userData"; // Add this import
import Link from "next/link";
import { Navbar, Container, Nav, NavDropdown, Form, FormControl, Button } from "react-bootstrap";

export default function MainNav() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");



  // Update nav whenever route changes (so login is reflected immediately)
  useEffect(() => {
    const token = readToken();
    if (token) {
      setLoggedIn(true);
      setUsername(token.userName || "");
    } else {
      setLoggedIn(false);
      setUsername("");
    }
  }, [router.asPath]); // <-- runs after every route change



  async function handleSubmit(e) {
    e.preventDefault();
    const searchField = e.target[0].value.trim();
    if (searchField) {
      // Save to history before navigating
      try {
        await addToHistory(`title=true&q=${searchField}`);
      } catch (error) {
        console.error("Error saving search to history:", error);
        // Continue with search even if history save fails
      }
      
      router.push(`/artwork?title=true&q=${searchField}`);
      
      // Clear the search input
      e.target[0].value = '';
    }
  }


  function handleLogout() {
    removeToken();
    setLoggedIn(false);
    setUsername("");
    router.push("/login");
  }

  return (
    <>
      <Navbar className="fixed-top navbar-dark bg-primary" expand="lg">
        <Container>
          <Navbar.Brand>John Wu</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref legacyBehavior>
                <Nav.Link active={router.pathname === '/'}>Home</Nav.Link>
              </Link>
              {loggedIn && (
                <Link href="/search" passHref legacyBehavior>
                  <Nav.Link active={router.pathname === '/search'}>Advanced Search</Nav.Link>
                </Link>
              )}
            </Nav>

            <div className="ms-auto d-flex align-items-center">
              {loggedIn && (
                <Form className="d-flex" onSubmit={handleSubmit}>
                  <FormControl type="text" placeholder="Search" className="me-2" />
                  <Button type="submit">Search</Button>
                </Form>
              )}

              {!loggedIn && (
                <>
                  <Link href="/register" passHref legacyBehavior>
                    <Nav.Link active={router.pathname === '/register'}>Register</Nav.Link>
                  </Link>
                  <Link href="/login" passHref legacyBehavior>
                    <Nav.Link active={router.pathname === '/login'} className="ms-3">Login</Nav.Link>
                  </Link>
                </>
              )}

              {loggedIn && (
                <NavDropdown title={username || 'User Name'} id="basic-nav-dropdown">
                  <Link href="/favourites" passHref legacyBehavior>
                    <NavDropdown.Item active={router.pathname === '/favourites'}>Favourites</NavDropdown.Item>
                  </Link>
                  <Link href="/history" passHref legacyBehavior>
                    <NavDropdown.Item active={router.pathname === '/history'}>Search History</NavDropdown.Item>
                  </Link>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br /><br />
    </>
  );
}
