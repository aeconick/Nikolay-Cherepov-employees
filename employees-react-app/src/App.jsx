import { useState } from "react";
import Papa from "papaparse";
import moment from "moment";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [result, setResult] = useState([]);

  //parse CSV file & store it in the component state
  const handleFileUpload = (e) => {
    const file = e.target.files[0]; //file list objects that contails info about the selected files
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      dynamicTyping: true, //TODO: maybe wont work
      complete: (results) => {
        setData(results.data);
        processCommonProjects(results.data);
      },
    });
  };

  // Process data to find common projects and calculate days worked
  const processCommonProjects = (data) => {
    data.forEach((row1, index1) => {
      data.forEach((row2, index2) => {
        //row[EmpID, ProjectID, DateFrom, DateTo]
        if (index1 !== index2 && row1[0] < row2[0] && row1[1] === row2[1]) {
          console.log(row1, row2);
        }
      });
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
