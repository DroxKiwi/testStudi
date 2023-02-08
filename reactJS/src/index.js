const rootEl = document.getElementById('root')
const firstname = 'Fabrice'
const el = (
  <div>
  <h1 className="title">Bonjour {firstname}</h1>
  <h2>Bienvenu ici </h2>
  </div>
)
ReactDOM.render(el, rootEl)