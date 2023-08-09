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
    const latestDate = new Date(Math.max(...parsedDates));
    return formatDate(latestDate);
  }
  
  // Example usage:
  const datesVector = [
    "16/01/2023 10:00",
    "17/01/2023 15:30",
    "17/01/2023 16:45",
  ];
  
  const latestDate = findLatestDate(datesVector);
  console.log("Latest Date:", latestDate);