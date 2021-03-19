import { 
    Container,
    Navbar,
} from 'react-bootstrap';
import Footer from '../components/Footer'

export default function Edit() {
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

                <Footer></Footer>
            </Container>
        </section>
    );
}