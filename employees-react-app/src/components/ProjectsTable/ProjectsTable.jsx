import "./ProjectsTable.css";

export const ProjectsTable = ({ mostWorkedPair }) => {
  return (
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
  );
};
