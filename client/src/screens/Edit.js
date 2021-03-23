import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import { 
    Modal,
    Button,
    Col,
    Container,
    Form,
    Navbar,
    Row,
} from 'react-bootstrap';
import Footer from '../components/Footer'
import { isValidBio, isValidEmail, isValidName, isValidPassword, isValidPhone } from '../schemas';
import NavigationBar from '../components/NavigationBar';

export default function Edit({ location, API_URL }) {
    const history = useHistory();
    const data = history.location.state;

    const [token, setToken] = useState('');

    const [name, setName] = useState('');
    const [imageURL, setImageURL] = useState();
    const [imageFile, setImageFile] = useState({});
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [password, setPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [nameErrMsg, setNameErrMsg] = useState('');
    const [emailErrMsg, setEmailErrMsg] = useState('');
    const [phoneErrMsg, setPhoneErrMsg] = useState('');
    const [bioErrMsg, setBioErrMsg] = useState('');
    const [passwordErrMsg, setPasswordErrMsg] = useState('');

    const [emailModalShow, setEmailModalShow] = useState(false);
    const [passwordModalShow, setPasswordModalShow] = useState(false);
    const [imageModalShow, setImageModalShow] = useState(false);

    useEffect(() => {
        const tokenLocalStorage = localStorage.getItem('token');
        if (!tokenLocalStorage)
            history.push('/login');
        
        setToken(tokenLocalStorage);

        setName(data.name);
        setImageURL(data.image);
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
                history.push('/profile');
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

    function changeEmail(e) {
        axios({
            method: 'PUT',
            url: `${API_URL}/profile`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify({ email })
          })
            .then(response => {
                const data = response.data;
                setEmailModalShow(false);
            })
            .catch(error => {
                var errorResponse = error.response.data;
                var status = errorResponse.status;
                if (status == 401 || status == 403) {
                    localStorage.removeItem('token');
                    history.push('/login');
                }

                const msg = errorResponse.message;
                const alert = document.getElementById('emailModalAlert');
                alert.classList.remove('d-none');
                alert.innerText = msg;
                console.log(msg);
            });
    }

    function changePassword(e) {
        axios({
            method: 'PUT',
            url: `${API_URL}/profile/password`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify({ oldPassword, newPassword: password })
          })
            .then(response => {
                const data = response.data;
                console.log(data);
                setPasswordModalShow(false);
            })
            .catch(error => {
                var errorResponse = error.response.data;
                var status = errorResponse.status;
                if (status == 401 || status == 403) {
                    localStorage.removeItem('token');
                    history.push('/login');
                }

                const msg = errorResponse.message;
                const alert = document.getElementById('passwordModalAlert');
                alert.classList.remove('d-none');
                alert.innerText = msg;
                console.log(msg);
            });
    }

    function changeImage(imageUrlEncoded) {
        axios({
            method: 'POST',
            url: `${API_URL}/profile/image`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify({ imageUrlEncoded })
          })
            .then(response => {
                const data = response.data;
                setImageURL(data.imageURL)
                console.log(data);
            })
            .catch(error => {
                var errorResponse = error.response.data;
                var status = errorResponse.status;
                if (status == 401 || status == 403) {
                    localStorage.removeItem('token');
                    history.push('/login');
                }

                const msg = errorResponse.message;
                console.log(msg);
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

    function validatePassword(e) {
        const { value, error } = isValidPassword(e.target.value);
        showValidation(error, e => setPasswordErrMsg(error.message), e.target);
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

    function onImageFileChange(e) {
        const file = e.target.files[0];   
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                changeImage(reader.result)
            }
            reader.onerror = error => console.log(error)
        }
    }

    return (
        <section className="w-100 h-100">
            <NavigationBar />

            <Container className="w-100 h-100 p-0 p-sm-5"> 
                <div className="pb-3">
                    <h2 className="text-left">Change Info</h2>
                </div>

                <div className="w-100 d-flex my-4">
                    <Form.Control type="file" accept="image/*" onChange={onImageFileChange} id="image-file" className="d-none"/>
                    <div onClick={e => document.getElementById('image-file').click()} className="profile-container profile-border mx-md-0 mr-md-auto mx-auto">
                        <img src={imageURL} className="profile-image"/>
                        <div className="profile-middle">
                            <div className="profile-text">Edit</div>
                        </div>
                    </div>
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
                            <Form.Control type="email" value={email} disabled/>
                        </Col>
                        <Col xs={5} md={3}>
                            <Button onClick={e => setEmailModalShow(true)} variant="outline-info" className="w-100">Change Email</Button>
                        </Col>
                    </Row>
                    <Row className="m-0 p-0 pb-3 align-items-end">
                        <Col xs={7} md={5}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="text" value="********" disabled/>
                        </Col>
                        <Col xs={5} md={3}>
                            <Button onClick={e => setPasswordModalShow(true)} variant="outline-info" className="w-100">Change Password</Button>
                        </Col>
                    </Row>

                    <Row className="m-0 p-0 py-3">
                        <Col xs={6} md={3}>
                            <Button variant="primary" type="submit" className="w-100 mb-3">
                                Save
                            </Button>
                        </Col>
                        <Col xs={6} md={3}>
                            <Button variant="secondary" type="submit" onClick={e => history.push('/profile')} className="w-100 mb-3">
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </Form>

                <Footer></Footer>
            </Container>

            <Modal
                show={emailModalShow}
                onHide={() => setEmailModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Change Email
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Are your sure you want to change your email ?</h4>
                    <div id="emailModalAlert" className="d-none w-100 alert alert-danger alert-dismissible fade show" role="alert">
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <Form.Label>Email</Form.Label>
                    <Form.Control id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyUp={validateEmail} placeholder="Enter your email"/>
                    <div className="invalid-feedback">
                        {emailErrMsg}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={changeEmail}>Save</Button>
                    <Button onClick={e => setEmailModalShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={passwordModalShow}
                onHide={() => setPasswordModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Change Password
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Are your sure you want to change your password ?</h4>
                    <div id="passwordModalAlert" className="d-none w-100 alert alert-danger alert-dismissible fade show" role="alert">
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control id="oldPassword" className="mb-3" type="password" onChange={e => setOldPassword(e.target.value)} placeholder="Enter your old password"/>

                    <Form.Label>New Password</Form.Label>
                    <Form.Control id="password" type="password" onChange={e => setPassword(e.target.value)} onKeyUp={validatePassword} placeholder="Enter your new password"/>
                    <div className="invalid-feedback">
                        {passwordErrMsg}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={changePassword}>Save</Button>
                    <Button onClick={e => setPasswordModalShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

        </section>
    );
}