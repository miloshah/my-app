import {
  useEffect,
  useState
} from 'react';
import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from './InfoBox';
import Table from './Table';
import Map from './Map';
import './App.css';
import { sortData, prettyPrintStat } from "./util";
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import numeral from "numeral";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(['worldwide']);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  
  useEffect(() => {
      fetch('https://disease.sh/v3/covid-19/all/')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })

  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries/")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));

          setCountries(countries);
          setTableData(sortData(data));
          setMapCountries(data);
         });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

 
  return (
    <div className="app"> 
      <div className="app__left">
        <div className="app__header">
          <h1>Covid 19 tracker</h1>
          <FormControl className="app__dropdown">
            <Select      
              variant="outlined"
              value={country}
              onChange={onCountryChange}
              key={country}
            >
              <MenuItem value="worldwide">worldwide</MenuItem>
              {
                countries.map((country,index) => (
                  <MenuItem key={index} value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>{/* ./app__header */}
        <div className="app__stats">
          <InfoBox 
            onClick={(e) => setCasesType("cases")}
            title="Coronovirus cases" 
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
           <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>{/* /.app__stats */}
        
        { countries.length && <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          />
        }
      </div>

      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>List by country</h3>
              <Table countries={tableData} ></Table>
            <h3>Worldwide new cases</h3>
            <LineGraph casesType={'cases' }></LineGraph>
          </div>
        </CardContent>
      </Card>{/* /.app__right */}
    </div>/* /.app */
  );
}

export default App;