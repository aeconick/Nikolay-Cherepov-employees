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
    const commonProjects = {};

    data.forEach((row1, index1) => {
      data.forEach((row2, index2) => {
        //row[ 0-EmpID, 1-ProjectID, 2-DateFrom, 3-DateTo ]
        if (index1 !== index2 && row1[0] < row2[0] && row1[1] === row2[1]) {
          const startDate1 = moment(row1[2]);
          const endDate1 = row1[3] === "NULL" ? moment() : moment(row1[3]);

          const startDate2 = moment(row2[2]);
          const endDate2 = row2[3] === "NULL" ? moment() : moment(row2[3]);

          const overlapStart = moment.max(startDate1, startDate2);
          const overlapEnd = moment.min(endDate1, endDate2);

          if (overlapStart.isBefore(overlapEnd)) {
            const daysWorked = overlapEnd.diff(overlapStart, "days") + 1;

            const key = `${row1[0]}-${row2[0]}`;

            if (!commonProjects[key]) {
              commonProjects[key] = {
                EmpID1: row1[0],
                EmpID2: row2[0],
                ProjectID: row1[1],
                totalDaysWorked: daysWorked,
                commonProjects: [{ ProjectID: row1[1], daysWorked }],
              };
            } else {
              commonProjects[key].totalDaysWorked += daysWorked;
              commonProjects[key].commonProjects.push({
                ProjectID: row1[1],
                daysWorked,
              });
            }
          }
        }
      });
    });

    let maxDaysWorked = 0;
    let mostWorkedPair = null;

    for (const key in commonProjects) {
      if (commonProjects.hasOwnProperty(key)) {
        const project = commonProjects[key];
        if (project.totalDaysWorked > maxDaysWorked) {
          maxDaysWorked = project.totalDaysWorked;
          mostWorkedPair = project;
        }
      }
    }

    console.log(mostWorkedPair);

  };

  return (
    <div className="main-container">
      <p>select csv file:</p>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
}

export default App;
