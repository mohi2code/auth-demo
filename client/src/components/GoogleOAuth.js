import axios from 'axios';
import { useHistory } from 'react-router';

export default function GoogleOAuth({ API_URL, onClick }) {

//     const history = useHistory();

//     function googleOAuth() {
//         axios({
//             method: 'POST',
//             url: `${API_URL}/google`,
//           })
//             .then(response => {
//               console.log(response.data);
//               const token = response.data.token;
//               localStorage.setItem('token', token);
//               history.push('/profile');
//             })
//             .catch(error => {
//               console.log(error.response);
//               // const msg = error.response.data.message;
//               // const alert = document.getElementById('alert');
//               // alert.classList.remove('d-none');
//               // alert.innerText = msg;
//               // console.log(msg);
//             });
//     }

    return (
        <a href={`http://localhost:3000/api/google`} className="mb-3"><img src="/Google.svg"/></a>
    );
}