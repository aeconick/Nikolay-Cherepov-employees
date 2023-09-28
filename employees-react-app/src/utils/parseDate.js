import moment from "moment";

export const parseDate = (dateString) => {
    const supportedFormats = [
      "YYYY-MM-DD",
      "MM/DD/YYYY",
      "DD-MM-YYYY",
      "YYYY/MM/DD",
      "DD MMM YYYY",
      "MMM DD, YYYY",
      "YYYY.MM.DD",
      "DD Month YYYY",
      "Month DD, YYYY",
      "YY/MM/DD",
      "DD-MM-YY",
      "MMM DD YY",
      "DD/MM/YY",
    ];

    for (const format of supportedFormats) {
      const parsedDate = moment(dateString, format, true);
      if (parsedDate.isValid()) {
        return parsedDate;
      }
    }
    // Return null if none of the formats match
    return null;
  };