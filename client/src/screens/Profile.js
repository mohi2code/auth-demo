import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import axios from 'axios';
import { Navbar, Button, Col, Container, Row } from 'react-bootstrap';
import Footer from '../components/Footer';

export default function Profile({ API_URL }) {

    const history = useHistory();
    
    const [name, setName] = useState('');
    const [image, setImage] = useState('')
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const tokenLocalStorage = localStorage.getItem('token');
        if (!tokenLocalStorage)
            history.push('/login');

        setToken(tokenLocalStorage);
        axios({
            method: 'GET',
            url: `${API_URL}/profile`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenLocalStorage}`
            },
          })
            .then(response => {
                setName(response.data.name);
                setImage(response.data.avatar);
                setEmail(response.data.email);
                setBio(response.data.bio);
                setPhone(response.data.phone);
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

    }, []);

    return (
        <section className="w-100 h-100">
            <Navbar>
                <Navbar.Brand href="#home">
                <img alt="Logo" src="/devchallenges.svg" width="130" height="30" className="d-inline-block align-top"/>
                </Navbar.Brand>
            </Navbar>

            <Container className="w-100 h-100 p-0 p-sm-5">
                <div className="pb-3">
                    <h2 className="text-center">Profile Info</h2>
                    <p className="text-center">Basic info like your name and photo</p>
                </div>

                <ul className="list-group">
                    <li className="list-group-item">
                        <Row className="align-items-center">
                            <Col xs={4}>
                                <h6>Profile</h6>
                                <p>Some info maybe visible to other users</p>
                            </Col>
                            <Col xs={8} className="d-flex">
                                <Button variant="outline-secondary" className="ml-auto px-4">
                                    Edit
                                </Button>
                            </Col>
                        </Row>
                    </li>
                    <li className="list-group-item">
                        <Row className="align-items-center">
                            <Col xs={4}>
                                <p>Photo</p>
                            </Col>
                            <Col xs={8}>
                                {
                                    image ? <img alt="profile_photo" src={image}/> : <img />
                                }
                            </Col>
                        </Row>
                    </li>
                    <li className="list-group-item">
                        <Row className="align-items-center">
                            <Col xs={4}>
                                <p>Name</p>
                            </Col>
                            <Col xs={8}>
                                <p>{name}</p>
                            </Col>
                        </Row>
                    </li>
                    <li className="list-group-item">
                        <Row className="align-items-center">
                            <Col xs={4}>
                                <p>Bio</p>
                            </Col>
                            <Col xs={8}>
                                <p>{bio}</p>
                            </Col>
                        </Row>
                    </li>
                    <li className="list-group-item">
                        <Row className="align-items-center">
                            <Col xs={4}>
                                <p>Email</p>
                            </Col>
                            <Col xs={8}>
                                <p>{email}</p>
                            </Col>
                        </Row>
                    </li>
                    <li className="list-group-item">
                        <Row className="align-items-center">
                            <Col xs={4}>
                                <p>Phone</p>
                            </Col>
                            <Col xs={8} >
                                <p>{phone}</p>
                            </Col>
                        </Row>
                    </li>
                </ul>

                <Footer></Footer>
            </Container>
        </section>
    );
}