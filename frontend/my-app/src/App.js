import './App.css';
import './assets/css/base.css'
import './assets/js/appearence'
import darkIcon from './assets/media/darkmode.svg';
import lightIcon from './assets/media/lightmode.svg';
import Default from './template/default'
import Welcome from './template/view/welcome';
import Signin from './template/view/signin';
import Signup from './template/view/signup';

function App(props) {
  return (
    <div className="App" data-appearance="" data-appearance-invertet="false">
        {
          props.view.map((e) => {
            // return <Default media={[darkIcon, lightIcon]}></Default>;
            return <Signup></Signup>;
          })
        }
    </div>
  );
}

export default App;
