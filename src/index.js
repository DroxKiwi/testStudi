import './App.css';
function App() {

  const currentDate = new Date();

  const user = {
    city: "Montpellier"
  };

  return (
    <div className="App">
      <h1>Vous êtes connecté depuis {user.city}, nous sommes le {currentDate}</h1>
    </div>
  );
}

export default App;

const el = App()
const rootEl = document.getElementById('root')
ReactDOM.render(el, rootEl)
