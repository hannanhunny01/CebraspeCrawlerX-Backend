function parseDate(dateStr) {
    const [dayMonthYear, time] = dateStr.split(" ");
    const [day, month, year] = dayMonthYear.split("/");
    const [hour, minute] = time.split(":");
    return new Date(year, parseInt(month) - 1, day, hour, minute);
  }
  
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  
  function findLatestDate(dates) {
    if (!dates || dates.length === 0) {
      return null;
    }
  
    const parsedDates = dates.map(parseDate);
    const timestamps = parsedDates.map(date => date.getTime());
    const latestTimestamp = Math.max(...timestamps);
  
    const latestDate = new Date(latestTimestamp);
    return formatDate(latestDate);
  }
  
  module.exports = { findLatestDate };
  


  
