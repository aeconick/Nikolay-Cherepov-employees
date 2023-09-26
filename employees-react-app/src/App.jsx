import { useState } from "react";
import Papa from "papaparse";
import "./App.css";

function App() {
  const [data, setData] = useState([]);


  //parse CSV file & store it in the component state
  const handleFileUpload = (e) => {
    const file = e.target.files[0]; //file list objects that contails info about the selected files
    Papa.parse(file, {
      header: false,
      complete: (results) => {
        setData(results.data);
      },
    });
  };

  return (
    <div className="main-container">
      <p>select csv file:</p>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <p>{data}</p>
    </div>
  );
}

export default App;
