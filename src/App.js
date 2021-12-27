import React  from 'react';
import {useState,useEffect} from 'react';
import './App.css';
import InfoBox from './InfoBox'
import Map from './Map';
import Table from './Table'
import LineGraph from './LineGraph';
import {FormControl,Select,MenuItem,Card, CardContent} from "@material-ui/core"
import {sortData} from "./util.js"
function App() {
     const [countries,setCountries] =useState([]);
     const [country,setCountry] =useState('worldwide');
     const [countryInfo,setCountryInfo] =useState({});
     const [tableData,setTableData] =useState([]);
      useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
        .then(response =>response.json() )
        .then(data =>{
          setCountryInfo(data);
        })
      }, [])
      useEffect(() => {
           const getCountriesData = async() =>{
             await fetch("https://disease.sh/v3/covid-19/countries")
             .then((response)=>response.json())
             .then((data) =>{
               const countries =data.map((country)=>(
                 {
                    name:country.country,
                    value:country.countryInfo.iso2
                    
                 }));
                 const sortedData =sortData(data);
                 setTableData(sortedData);
                 setCountries(countries);
              
             });
           };
             getCountriesData();
      }, []);
        const onCountryChange =async(event) =>{
          const countryCode =event.target.value;
         // console.log("ABC",countryCode);
          setCountry(countryCode);
           const url  =countryCode ==='worldwide' ? "https://disease.sh/v3/covid-19/all"
           :`https://disease.sh/v3/covid-19/countries/${countryCode}`;
           await fetch(url)
            .then(response =>response.json())
            .then(data =>{
              setCountry(countryCode);
              setCountryInfo(data);
            })
        }
        console.log(" aab",countryInfo);
  return (
    <div className="app">
     <div className ="app__left">


       <div className ="app__header">
      <h1>COVID 19 TRACKER</h1>
       <FormControl className ="app__dropdown">
        <Select variant ="outlined" onChange ={onCountryChange} value = {country} >
             <MenuItem value ="worldwide">World Wide</MenuItem>
            {countries.map((country)=>(<MenuItem value ={country.value}>{country.name}</MenuItem>))}

        </Select>
       </FormControl>
       </div>
       <div className="app__stats">
         <InfoBox title ="Coronavirus Cases" cases ={countryInfo.todayCases} total ={countryInfo.cases}/>
         <InfoBox title ="Recovered"cases ={countryInfo.todayRecovered} total ={countryInfo.recovered}/>
         <InfoBox  title =" Deaths"cases ={countryInfo.todayDeaths} total ={countryInfo.deaths}/>
         <Map/>
       </div>
       </div>
       <Card className="app__right">
         <CardContent>
              <h3>Live Country Cases</h3>
              <Table countries ={tableData}/>
              <h3>WorldWide new cases</h3>
             <LineGraph/>
         </CardContent>
       </Card>
    </div>
  );
}

export default App;