import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Register from './screens/Register';
import Login from './screens/Login';

function App() {
  return (
    <Router>
      <main className="dark">
        <Switch>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Redirect to="/register"/>
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
