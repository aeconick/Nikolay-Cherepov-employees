import "./MostWorked.css";

export const MostWorked = ({ mostWorkedPair }) => {
  return (
    <div className="most-worked-pair">
      <h2>Most Worked Pair</h2>
      <p>
        Employees {mostWorkedPair.EmpID1} and {mostWorkedPair.EmpID2} have
        worked together for {mostWorkedPair.totalDaysWorked} days.
      </p>
    </div>
  );
};
