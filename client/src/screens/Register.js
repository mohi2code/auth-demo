import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios'; 
import { isValidEmail, isValidPassword } from '../schemas';

export default function Register({ API_URL }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const history = useHistory();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token)
        history.push('/profile');
        
    }, []);

    function submit(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!isValidEmail(email) || !isValidPassword(password))
        return false;
      
      axios({
        method: 'POST',
        url: `${API_URL}/register`,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ email, password })
      })
        .then(response => {
          console.log(response.data);
          history.push('/login', { email, password });
        })
        .catch(error => {
          const msg = error.response.data.message;
          const alert = document.getElementById('alert');
          alert.classList.remove('d-none');
          alert.innerText = msg;
          console.log(msg);
        });
    }

    function validateEmail(e) {
      if (isValidEmail(e.target.value)) {
        document.getElementById('email').classList.remove('is-invalid');
        document.getElementById('email').classList.add('is-valid');
      } else {
        document.getElementById('email').classList.remove('is-valid');
        document.getElementById('email').classList.add('is-invalid');
      }
    }

    function validatePassword(e) {
      if (isValidPassword(e.target.value)) {
        document.getElementById('password').classList.remove('is-invalid');
        document.getElementById('password').classList.add('is-valid');
      } else {
        document.getElementById('password').classList.remove('is-valid');
        document.getElementById('password').classList.add('is-invalid');
      }
    }

    return (
      <Container className="w-100 h-100">
        <Row className="w-100 h-100 p-0 m-0">
          <Col lg={{ span: 4, offset: 4 }} md={{ span: 6, offset: 3 }} className="d-flex flex-column justify-content-center align-items-center p-0">
            <Form onSubmit={submit} className="w-100 p-0 py-5 p-sm-5 d-flex flex-column justify-content-center align-items-center box" noValidate>
                <img src="/devchallenges.svg" className="mr-auto mb-3"/>
                <p className="mr-auto"><strong>Join thousands of learners from around the world</strong></p>
                <p className="mr-auto"><small>Master web development by making real-life projects. There are multiple paths for you to choose</small></p>
                <div id="alert" className="d-none w-100 alert alert-danger alert-dismissible fade show" role="alert">
                  <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <Form.Group className="w-100 inner-addon left-addon">
                  <i className="icon bi-envelope-fill text-black-50"></i>
                  <Form.Control type="email" onChange={e => setEmail(e.target.value)} onKeyUp={validateEmail} id="email" placeholder="Enter email" required></Form.Control>
                </Form.Group>
                <Form.Group className="w-100 inner-addon left-addon">
                  <i className="icon bi-lock-fill text-black-50"></i>
                  <Form.Control type="password" onChange={e => setPassword(e.target.value)} onKeyUp={validatePassword} id="password" placeholder="Password" required></Form.Control>
                  <div className="invalid-feedback">
                    Password should be atleast 8 characters containing upper and lowercase letters and numbers.
                  </div>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Start coding now
                </Button>
                <p><small>or continue with these social profiles</small></p>
                <a href="#" className="mb-3"><img src="/Google.svg"/></a>
                <p><small>Already a member ? <Link to="/login">Login</Link></small></p>
            </Form>

            <footer className="d-flex w-100">
                <p className="mr-auto text-black-50"><small>create by <a href="#">mohi2code</a></small></p>
            </footer>
          </Col>
        </Row>
      </Container>
    );
  }