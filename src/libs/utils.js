export function getDateTime(isoStr) {
	const date = new Date(isoStr);

	let hours = date.getHours();
	let minutes = date.getMinutes();

	const ampm = hours >= 12 ? 'PM' : 'AM';
	hours %= 12;
	hours = hours ? hours : 12;
	minutes = minutes < 10 ? '0' + minutes : minutes;

	return {
		date: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
		time: `${hours}:${minutes} ${ampm}`,
	};
}

export function getPostAge(postDate) {
    const currentTime = +new Date();
    const postTime = +new Date(postDate);
    const microSecondsDiff = Math.abs(postTime - currentTime );

    return Math.floor(microSecondsDiff / (1000 * 60 * 60  * 24));
}

export function eventIsTooFarOut(xDays, startDate) {
	return xDays && -Math.abs(xDays) < getPostAge(startDate);
}
