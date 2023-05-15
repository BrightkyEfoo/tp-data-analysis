import './App.css';
import EchantillonsConteneur from './components/EchantillonsConteneur';



function App() {
  return (
    <div className="App">
      <div>
        <h1 className="title">Test de comparaison de variances</h1>
        <div className='sub-title'>
          <h2>Test de comparaison de k variances (k≥2) : Bartlett et Fisher pour des echantillons independants </h2>
        </div>
        <div className="main">
                   
          <EchantillonsConteneur />
          
        </div>
      </div>
    </div>
  );
}

export default App;
