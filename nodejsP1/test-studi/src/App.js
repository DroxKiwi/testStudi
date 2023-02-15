import logo from './logo.svg'
import './App.css'
import Shop from './Container/Shop';
import { Provider } from 'react-redux';
import store from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './store';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <h2>--------------------------------------------------</h2>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
              <Shop />
          </PersistGate>
        </Provider> 
      </header>
    </div>
  );
}

export default App;
