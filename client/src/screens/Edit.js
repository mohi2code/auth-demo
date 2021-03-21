import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import { 
    Button,
    Col,
    Container,
    Form,
    Navbar,
    Row,
} from 'react-bootstrap';
import Footer from '../components/Footer'
import { isValidBio, isValidEmail, isValidName, isValidPhone } from '../schemas';

export default function Edit({ location, API_URL }) {
    const history = useHistory();
    const data = history.location.state;

    const [token, setToken] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [nameErrMsg, setNameErrMsg] = useState('');
    const [emailErrMsg, setEmailErrMsg] = useState('');
    const [phoneErrMsg, setPhoneErrMsg] = useState('');
    const [bioErrMsg, setBioErrMsg] = useState('');

    useEffect(() => {
        const tokenLocalStorage = localStorage.getItem('token');
        if (!tokenLocalStorage)
            history.push('/login');
        
        setToken(tokenLocalStorage);

        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setBio(data.bio);
    }, []);

    function submit(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!isValidForm())
            return false;
        
        axios({
            method: 'PUT',
            url: `${API_URL}/profile`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify({ name, email, bio, phone})
          })
            .then(response => {
                const data = response.data;
                history.push('/push');
            })
            .catch(error => {
                var errorResponse = error.response.data;
                var status = errorResponse.status;
                if (status == 401 || status == 403) {
                    localStorage.removeItem('token');
                    history.push('/login');
                }
                console.log(errorResponse);
            });

    }

    function isValidForm() {
        return ( isValidName(name).error ||
        isValidEmail(email).error ||
        isValidBio(bio).error ||
        isValidPhone(phone).error ) ? false : true 
    }

    function validateName(e) {
        const { value, error } = isValidName(e.target.value);
        showValidation(error, e => setNameErrMsg(error.message), e.target);
    }

    function validateBio(e) {
        const { value, error } = isValidBio(e.target.value);
        showValidation(error, e => setBioErrMsg(error.message), e.target);
    }

    function validateEmail(e) {
        const { value, error } = isValidEmail(e.target.value);
        showValidation(error, e => setEmailErrMsg(error.message), e.target);
    }

    function validatePhone(e) {
        const { value, error } = isValidPhone(e.target.value);
        showValidation(error, e => setPhoneErrMsg(error.message), e.target);
    }

    function showValidation(error, setMsgFunc, element) {
        if (error) {
            setMsgFunc();
            element.classList.remove('is-valid');
            element.classList.add('is-invalid');
        } else {
            element.classList.remove('is-invalid');
            element.classList.add('is-valid');
        }
    }


    return (
        <section className="w-100 h-100">
            <Navbar>
                <Navbar.Brand href="#home">
                <img alt="Logo" src="/devchallenges.svg" width="130" height="30" className="d-inline-block align-top"/>
                </Navbar.Brand>
            </Navbar>

            <Container className="w-100 h-100 p-0 p-sm-5"> 
                <div className="pb-3">
                    <h2 className="text-left">Change Info</h2>
                </div>

                <Form onSubmit={submit} className="w-100 mb-3" noValidate>
                    <Row className="m-0 p-0 pb-3">
                        <Col xs={12} md={8}>
                            <Form.Label>name</Form.Label>
                            <Form.Control id="name" type="text" value={name} onChange={e => setName(e.target.value)} onKeyUp={validateName} maxLength="50" placeholder="Enter your name"/>
                            <div className="invalid-feedback">
                                {nameErrMsg}
                            </div>
                        </Col>
                    </Row>
                    <Row className="m-0 p-0 pb-3">
                        <Col xs={12} md={8}>
                            <Form.Label>Bio</Form.Label>
                            <Form.Control id="bio" as="textarea" maxLength="300" value={bio} onChange={e => setBio(e.target.value)} onKeyUp={validateBio} rows={3} placeholder="Enter your bio"/>
                            <div className="invalid-feedback">
                                {bioErrMsg}
                            </div>
                        </Col>
                    </Row>
                    <Row className="m-0 p-0 pb-3">
                        <Col xs={12} md={8}>
                            <Form.Label>Phone</Form.Label>
                            <Form.Control id="phone" type="text" value={phone} onChange={e => setPhone(e.target.value)} onKeyUp={validatePhone} placeholder="Enter your phone number"/>
                            <div className="invalid-feedback">
                                {phoneErrMsg}
                            </div>
                        </Col>
                    </Row>
                    <Row className="m-0 p-0 pb-3 align-items-end">
                        <Col xs={7} md={5}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyUp={validateEmail} placeholder="Enter your email" disabled/>
                            <div className="invalid-feedback">
                                {emailErrMsg}
                            </div>
                        </Col>
                        <Col xs={5} md={3}>
                            <Button variant="info" className="w-100">Change Email</Button>
                        </Col>
                    </Row>
                    <Row className="m-0 p-0 pb-3 align-items-end">
                        <Col xs={7} md={5}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="text" value="********" disabled/>
                        </Col>
                        <Col xs={5} md={3}>
                            <Button variant="info" className="w-100">Change Password</Button>
                        </Col>
                    </Row>

                    <Row className="m-0 p-0 py-3">
                        <Col xs={12} md={3}>
                        <Button variant="primary" type="submit" className="w-100 mb-3">
                            Save
                        </Button>
                        </Col>
                    </Row>
                </Form>

                <Footer></Footer>
            </Container>
        </section>
    );
}