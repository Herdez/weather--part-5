import React from 'react';
import request from 'superagent';
import { PropagateLoader } from 'react-spinners';

class Country extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {
  		week: [],
  		daily: '',
  		country: '',
  		show: false,
  		loading: true
  	}
  }
   
  getDayOfWeek = (dayOfWeek) => {
    let options = {  
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return dayOfWeek.toLocaleString('en-us', options); 
  }

  getHour = (hour) => {
    let hours = hour.getHours();
    return hours + ':00';
  }

  weather = (location) => {
     const API_URL = `https://api.darksky.net/forecast/7b99d5e089197748e933189d8174655f/${location.lat},${location.lng}`;

     request
        .get(API_URL)
        .then(response => { 
          let dailyWeather = response.body.hourly.data;
          this.setState({
            week: []
          })
          dailyWeather.forEach(hour => {
            let dayOfWeek = new Date(hour.time * 1000);
            let today = new Date();
            if (dayOfWeek.getDay() === today.getDay()) {
              this.setState({
                daily: this.getDayOfWeek(dayOfWeek),
                loading: false,
                week: [ 
                  ...this.state.week,
                  {
                    hour: this.getHour(dayOfWeek),
                    summary: hour.summary, 
                    pressure: hour.pressure, 
                    temperature: hour.temperature, 
                    wind: hour.windSpeed
                  }
                ], 
              });
            }
          })
        });
  }

  getWeather = (nameOfCountry) => {
    let country = nameOfCountry;
    const API_URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${country}`;
    this.setState({
      loading: true
    });

    request
      .get(API_URL)   
      .then(response => {
        let location = response.body.results[0].geometry.location;
        return location;
      })
      .then(this.weather)
      .catch(error => {
        this.setState({
          country: 'N/A Country',
          show: false,
          loading: false
        });
      });
    this.setState({
      show: true,
      country: country
    });
  }

  componentDidMount() {
	setTimeout(() => this.setState({ loading: false }), 1500); 
	this.getWeather(this.props.match.params.countryName);
  }

  componentWillReceiveProps(newProps) {
    this.getWeather(newProps.match.params.countryName);
  }

  render(){
  	  let hourly = this.state.week;
  	  let date = this.state.daily.split(',');
	  return (
	  	<div>
	  	   <div className='loading-country'>
              <PropagateLoader
                sizeUnit={"px"}
                size={12}
                color={'#4b83fd'}
                loading={this.state.loading}
              />
            </div>      

          <h3>{ this.state.show } {this.state.country }</h3>
            { this.state.show && 
              <table className="tr-table tr-table-zebra">
                  <thead>
                  <tr>
                      <th>{date[0]} - {date[1]}, {date[2]}</th>
                  </tr>
                  </thead>
                  <tbody>
                  {hourly.map((hour, i) => {
                    return <tr key={ i }>
                             <td>{hour.hour}, {hour.temperature}F, {hour.summary}, {hour.wind}m/s, {hour.pressure}</td>
                           </tr>
                  })}
                    </tbody>
              </table>
            }
	    </div>
	  );
  }
}


export default Country;