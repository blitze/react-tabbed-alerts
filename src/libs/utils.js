export function getEpochTime(str) {
  if (!str) {
    return 0;
  }
	var parts = str.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]+):([0-9]+):([0-9]+).([0-9]+)/);
	return +new Date(Date.UTC(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6], parts[7]));
}

export function getDateTime(isoStr) {
  const date = new Date(isoStr);

  let hours = date.getHours();
  let minutes = date.getMinutes();

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0'+minutes : minutes;

  return {
    date: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
    time: `${hours}:${minutes} ${ampm}`,
  };
}

export function getDaysDiff(msFrom, msTo) {
  return Math.floor((msFrom - msTo) / 86400000);
}

export function eventIsTooFarOut(xDays, startDate, currentTime) {
  if (xDays) {
    return xDays > getDaysDiff(getEpochTime(startDate), currentTime);
  }
  return false;
}
