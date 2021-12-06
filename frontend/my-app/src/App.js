import logo from './logo.svg';
import './App.css';
import './assets/css/base.css'
import Default from './template/default'
import Welcome from './template/view/welcome';
import Signin from './template/view/signin';

function App(props) {
  return (
    <div className="App">
        {
          props.view.map((e) => {
            return <Default></Default>
            return <Signin></Signin>
          })
        }
    </div>
  );
}

export default App;
