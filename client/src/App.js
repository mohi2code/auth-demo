import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Register from './screens/Register';
import Login from './screens/Login';
import Profile from './screens/Profile';
import Edit from './screens/Edit';

function App() {
  const API_URL = 'http://localhost:3000/api'

  return (
    <Router>
      <Switch>
          <Route path="/register">
            <Register API_URL={API_URL}/>
          </Route>
          <Route path="/login">
            <Login API_URL={API_URL}/>
          </Route>
          <Route path="/profile/edit">
            <Edit API_URL={API_URL}/>
          </Route>
          <Route path="/profile">
            <Profile API_URL={API_URL}/>
          </Route>
          <Route path="/">
            <Redirect to="/register"/>
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
