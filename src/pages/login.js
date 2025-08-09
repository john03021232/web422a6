
import { useState } from 'react';
import { useRouter } from 'next/router';
import { authenticateUser } from '../../lib/authenticate';
import { useAtom , useSetAtom} from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { getFavourites, getHistory } from '../../lib/userData';
import { Button, Card, Form, Alert } from 'react-bootstrap';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [warning, setWarning] = useState(null);
  const router = useRouter();

  // const [setFavouritesList] = useAtom(favouritesAtom);
  // const [setSearchHistory] = useAtom(searchHistoryAtom);

  const setFavouritesList = useSetAtom(favouritesAtom);
const setSearchHistory = useSetAtom(searchHistoryAtom);

  async function updateAtoms() {
    try {
      const favourites = await getFavourites();
      const history = await getHistory();
      setFavouritesList(favourites);
      setSearchHistory(history);
    } catch (error) {
      console.error('Error updating atoms:', error);
    }
  }


async function handleSubmit(e) {
  e.preventDefault();
  setWarning(null);

  try {
    // 1. Authenticate & store token
    await authenticateUser(userName, password);

    // 2. Update atoms after token exists
    await updateAtoms();

    // 3. (NEW) Force MainNav to refresh immediately
    if (typeof window !== 'undefined') {
      const event = new Event('storage'); // triggers auth checks in MainNav
      window.dispatchEvent(event);
    }

    // 4. Redirect AFTER token is set
    await router.push('/favourites');
  } catch (err) {
    console.error('Login error:', err);
    setWarning(err.message);
  }
}



  return (
    <Card>
      <Card.Body>
        <h2>Login</h2>
        <p>Login to your account:</p>
        {warning && <Alert variant="danger">{warning}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">Login</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
