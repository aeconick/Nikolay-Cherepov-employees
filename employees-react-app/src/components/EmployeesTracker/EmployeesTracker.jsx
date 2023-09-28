import { useState } from "react";
import Papa from "papaparse";
import moment from "moment";

import "./EmployeesTracker.css";
import { ProjectsTable } from "../ProjectsTable";

export const EmployeesTracker = () => {
  const [mostWorkedPair, setMostWorkedPair] = useState(null);

  //parse CSV file & pass data to processCommonProjects()
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      dynamicTyping: true,
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
      {mostWorkedPair && <ProjectsTable mostWorkedPair={mostWorkedPair} />}
    </div>
  );
};
