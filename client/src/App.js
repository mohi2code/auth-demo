import './App.scss';
import { Button, Form } from 'react-bootstrap';

function App() {
  return (
    <main className="dark">
      <div>
        <h1>Hi from React</h1>
        <Button>Just a Button</Button>
        <Form.Control type="email" placeholder="Enter email" />
      </div>
    </main>
  );
}

export default App;
