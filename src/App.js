import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/home';
import store from './redux/store';
import Navbar from './components/navbar';
import Favorites from './components/favorites';
import { Provider } from "react-redux";
import { useEffect } from 'react';
import { getFavorites } from './redux/favorites_reducer';
import { ToastContainer } from 'react-toastify';
import { Redirect, Route, Switch } from 'react-router-dom';

const App = () => {

  const pageNotFound = <div className="m-3 m-md-5 mt-5 pt-5">
    <div className="jumbotron p-5 m-md-5 mt-5 text-center text-danger shadow"><h3>{'404 Error - Page not found :('}</h3></div>
  </div>;

  useEffect(() => getFavorites(store.dispatch), []);

  return (
    <div className="app">
      <ToastContainer/>
      <Provider store={store}>
        <header style={{ height: '80px' }}><Navbar/></header>
        <Switch>
          <Route path="/home" exact component={Home}/>
          <Route path="/favorites" exact component={Favorites}/>
          <Route path="/" exact><Redirect to="/home"/></Route>
          <Route path="/page-not-found" render={() => pageNotFound}/>
          <Redirect to="/page-not-found"/>
        </Switch>
      </Provider>
    </div>
  );
}

export default App;
