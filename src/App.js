import React, { Component } from 'react';
import './App.css';
import { PropagateLoader } from 'react-spinners';
import About from './components/About';
import Terms from './components/Terms';
import Home from './components/Home';
import Country from './components/Country';

import { Switch, Route, Link } from 'react-router-dom';

class App extends Component {
  constructor(){
    super();

    this.state = {
      checked: false,
      show: false,
      city: {},
      loading: true,
      cities: [{
        id: 1,
        name: 'France'
      },{
        id:2,
        name: 'Canada'
      }]
    }
  }

  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 1500); 
  }  

  checkBtn = (e) => {
    e.preventDefault();
    this.setState({
      checked: true
    })
  }

  updateInput = (e) => {
    e.preventDefault();
    let value = this.refs.inputLocation.value;
    if (value !== '') {
      let newState = this.state;
      newState.city = {id: this.state.cities.length + 1, name: value.replace(value[0], value[0].toUpperCase())};
      this.setState(newState);
      newState.cities.push(newState.city);
      newState.checked = false;
      this.setState(newState);
    }
  }

  render() {
    let cities = this.state.cities;
    return (
      <div className='app'>
        <header className='app__header'>
          <button className='app__add' onClick={ this.checkBtn }>
            <i className="fa fa-plus-circle"></i>
            New city
          </button>  
          <Link to='/about' className="link">About</Link>
          <Link to='/terms' className="link">Terms</Link>
          <Link to='/'      className="link">Home</Link>
       </header>
        <div className='grid'>
          <aside className='app__aside'> 
            <div className='loading'>
              <PropagateLoader
                sizeUnit={"px"}
                size={12}
                color={'#4b83fd'}
                loading={this.state.loading}
              />
            </div>      
            <h1 className='app__title'>All countries</h1>
            {cities.map((city, i) => {  
              return <Link 
                        key={ i } 
                        className='app__country'
                        to={`/country/${city.name}`}>
                     { city.name }
                     </Link>
            })}
            { this.state.checked &&
              <form onSubmit={ this.updateInput }> 
                <input autoFocus type='text' ref="inputLocation" placeholder='Location' className='app__input' />
              </form>
            }
          </aside>
              <section className='app__view'>
                  <Switch>
                    <Route exact path="/" component={ Home }/>
                    <Route exact path="/about" component={ About }/>
                    <Route exact path="/terms" component={ Terms }/>
                    <Route path="/country/:countryName" component={ Country } />
                  </Switch>
             </section> 
        </div>
      </div>
    );
  }
}

export default App;

