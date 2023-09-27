import { useState } from "react";
import Papa from "papaparse";
import moment from "moment";
import "./App.css";

function App() {
  const [data, setData] = useState([]);

  //parse CSV file & store it in the component state
  const handleFileUpload = (e) => {
    const file = e.target.files[0]; //file list objects that contails info about the selected files
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setData(results.data);
        console.log(results.data);
        processCommonProjects(results.data);
      },
    });
  };

  // Process data to find common projects and calculate days worked
  const processCommonProjects = (data) => {
    data.forEach((row1, index1) => {
     console.log(moment(row1.DateFrom));
    });
  };

  return (
    <div className="main-container">
      <p>select csv file:</p>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
}

export default App;
