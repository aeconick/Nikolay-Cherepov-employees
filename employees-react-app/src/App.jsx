import { useState } from "react";
import Papa from "papaparse";
import moment from "moment";
import "./App.css";

function App() {
  const [mostWorkedPair, setMostWorkedPair] = useState(null);

  //parse CSV file & store it in the component state
  const handleFileUpload = (e) => {
    const file = e.target.files[0]; //file list objects that contails info about the selected files
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      dynamicTyping: true, //TODO: maybe wont work
      complete: (results) => {
        processCommonProjects(results.data);
      },
    });
  };

  // Process data to find common projects and calculate days worked
  const processCommonProjects = (data) => {
    const commonProjectsInfo = {};

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

            if (!commonProjectsInfo[key]) {
              commonProjectsInfo[key] = {
                EmpID1: row1[0],
                EmpID2: row2[0],
                ProjectID: row1[1],
                totalDaysWorked: daysWorked,
                commonProjects: [{ ProjectID: row1[1], daysWorked }],
              };
            } else {
              commonProjectsInfo[key].totalDaysWorked += daysWorked;
              commonProjectsInfo[key].commonProjects.push({
                ProjectID: row1[1],
                daysWorked,
              });
            }
          }
        }
      });
    });

    let maxDaysWorked = 0;
    // let mostWorkedPair = null;

    for (const key in commonProjectsInfo) {
      if (commonProjectsInfo.hasOwnProperty(key)) {
        const project = commonProjectsInfo[key];
        if (project.totalDaysWorked > maxDaysWorked) {
          maxDaysWorked = project.totalDaysWorked;
          //mostWorkedPair = project;
          setMostWorkedPair(project);
        }
      }
    }
  };

  return (
    <div className="employee-tracker-container">
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {mostWorkedPair && (
        <div className="most-worked-pair">
          <h2>Most Worked Pair</h2>
          <p>
            Employees {mostWorkedPair.EmpID1} and {mostWorkedPair.EmpID2} have
            worked together for {mostWorkedPair.totalDaysWorked} days.
          </p>
        </div>
      )}
      {mostWorkedPair && (
        <table className="common-projects-table">
          <thead>
            <tr>
              <th>Employee ID #1</th>
              <th>Employee ID #2</th>
              <th>Project ID</th>
              <th>Days worked</th>
            </tr>
          </thead>
          <tbody>
            {mostWorkedPair.commonProjects.map((project, index) => (
              <tr key={index}>
                <td>{mostWorkedPair.EmpID1}</td>
                <td>{mostWorkedPair.EmpID2}</td>
                <td>{project.ProjectID}</td>
                <td>{project.daysWorked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
