import { useState } from 'react';
import { Button, Navbar, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router';

export default function NavigationBar() {
    
    const history = useHistory();
    const [logoutModal, setLogoutModal] = useState(false);

    function logout() {
        localStorage.removeItem('token');
        history.push('/login');
    }

    return (
        <div>
            <Navbar className="mb-5 mb-sm-0">
            <Navbar.Brand href="/">
                <img alt="Logo" src="/devchallenges.svg" width="130" height="30" className="d-inline-block align-top"/>
            </Navbar.Brand>

            <div className="d-flex align-items-center ml-auto mr-sm-5 text-danger">
                <i style={{ fontSize: '1.6em' }} class="bi bi-box-arrow-in-left"></i>
                <Button variant="link" className="text-danger" onClick={e => setLogoutModal(true)}>
                    Logout
                </Button>
            </div>
        </Navbar>

        <Modal
        show={logoutModal}
        onHide={() => setLogoutModal(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Logout
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Are your sure do you want to logout ?</h4>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={logout}>Yes</Button>
                <Button onClick={e => setLogoutModal(false)}>No</Button>
            </Modal.Footer>
            </Modal>
        </div>
    );
}