import { useState } from 'react';
import { registerUser } from '../../lib/authenticate';
import { Button, Card, Form, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function Register() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [warning, setWarning] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await registerUser(userName, password, password2);
      router.push('/login');
    } catch (err) {
      setWarning(err.message);
    }
  }

  return (
    <Card>
      <Card.Body>
        <h2>Register</h2>
        {warning && <Alert variant="danger">{warning}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>User Name</Form.Label>
            <Form.Control type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} required />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">Register</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
