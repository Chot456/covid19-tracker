import React, { useState, useEffect} from 'react';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css"

import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core"

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');
 
  // STATE = How to write a variable in REACT

  // https://disease.sh/v3/covid-19/countries

  // USEEFFECT = onload will run the code
  useEffect(() =>{
	fetch("https://disease.sh/v3/covid-19/all")
	.then(response => response.json())
	.then(data => {
		setCountryInfo(data);
	})
  },[]);

  // onload get countries data from API
  useEffect(() => {
      // async -> send a request , wait for it, to do something with it
	  // get countries from API
      const getCountriesData = async () => {
        await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
              name: country.country, //United states
              value: country.countryInfo.iso2  // UK, USA, FR
            }));
			
			// sort the country data start from highest
			const sortedData = sortData(data);
			
			// set data in country table
			setTableData(sortedData);

			// set countries data in map
			setMapCountries(data);

			// set county
            setCountries(countries);
        });
      };

      getCountriesData();
  }, []);

  //Function for changing Select menu
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
	setCountry(countryCode)
	
	// https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
	const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

	await fetch(url)
	.then(response => response.json())
	.then(data=> {

		// for setting up the country code
		setCountry(countryCode);
		
		// All of the data from the country response
		setCountryInfo(data);

		// set the map location lattitude and longtitude
		setMapCenter([data.countryInfo.lat, data.countryInfo.long]);

		// for map zoom in
		setMapZoom(4);
	});
  };

  return (
    <div className="app">
		<div className="app__left">
			<div className="app__header">
				<h1>COVID-19 TRACKER</h1>
				<FormControl className="app__dropdown">
					<Select variant="outlined" onChange={onCountryChange} value={country}>
						<MenuItem value="worldwide">Worldwide</MenuItem>   
						{
						countries.map((country) =>(
							<MenuItem value={country.value}>{country.name}</MenuItem>    
						))
						}
					</Select> 
				</FormControl>
			</div>
		
			<div className="app__stats">
				<InfoBox 
					isRed
					active={casesType === 'cases'}
					onClick={(e) => setCasesType('cases')}
					title="Coronavirus Cases" 
					cases={prettyPrintStat(countryInfo.todayCases)} 
					total={prettyPrintStat(countryInfo.cases)} 
					/>

				<InfoBox 
					active={casesType === 'recovered'}
					onClick={(e) => setCasesType('recovered')}
					title="Recovered" 
					cases={prettyPrintStat(countryInfo.todayRecovered)} 
					total={prettyPrintStat(countryInfo.todayRecovered)} 
					/>

				<InfoBox
					isRed
					active={casesType === 'deaths'}
					onClick={(e) => setCasesType('deaths')}
					title="Deaths" 
					cases={prettyPrintStat(countryInfo.todayDeaths)} 
					total={prettyPrintStat(countryInfo.todayDeaths)} 
					/>
			</div> 

			<Map
				casesType={casesType}
				countries={mapCountries}
				center={mapCenter}
				zoom={mapZoom}
			/>

		</div>
		<div className="app__right">
			<Card>
				<CardContent>
					<h3>Live Cases by Country</h3>
					<Table countries={tableData} />
				</CardContent>
			</Card>
			<Card className="mt-8">
				<CardContent>
					<h3>World new {casesType}</h3>
					<LineGraph casesType={casesType}></LineGraph>
				</CardContent>
			</Card>
		</div>
    </div>
  );
}

export default App;
