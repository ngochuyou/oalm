const monthNames = [
	'Jan', 'Feb', 'Mar',
	'Apr', 'May', 'Jul', 'Jul', 'Aug',
	'Sep', 'Oct', 'Nov', 'Dec'
];

// const dayNames = [
// 	'Mon', 'Tue', 'Wed', 'Thu',
// 	'Fri', 'Sat', 'Sun'
// ];

function addZero(number) {
	if (number === null) {
		return number;
	}

	const numberInString = number.toString();

	if (numberInString.length === 1) {
		number = '0' + numberInString;
	}

	return number;
}

function increaseMonth(month, step) {
	if (typeof month !== 'number' || typeof step !== 'number' || month > 11 || month < 0) {
		return month;
	}

	var increment = month + step;

	if (increment > 11) {
		var gap = 11 - month;

		increment = step - gap;
	}

	return increment;
}

export function fromLongTime(longtime) {
	const date = new Date(longtime);

	return monthNames[date.getMonth()] + ', ' + addZero(date.getDate()) + ' ' + date.getFullYear();
}

export function fromString(string) {
	const date = new Date(string);

	if (date instanceof Date && !isNaN(date)) {
		
		return monthNames[date.getMonth()] + ', ' + addZero(date.getDate()) + ' ' + date.getFullYear();
	}

	return null;
}

export function appendTime(time, amount) {

	return new Date(time.getFullYear(), increaseMonth(time.getMonth(), amount), time.getDate());
}