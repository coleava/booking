import logo from './logo.svg';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Users from './page/users';

function App() {
  return (
    <Switch>
        <Route exact path='/' component={Users}/>
    </Switch>
  );
}

export default App;
