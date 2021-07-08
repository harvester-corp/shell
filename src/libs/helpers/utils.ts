import { initWallet } from './ethers';

let logger: any;

export const ID = function () {
	// Math.random should be unique because of its seeding algorithm.
	// Convert it to base 36 (numbers + letters), and grab the first 9 characters
	// after the decimal.
	return '_' + Math.random().toString(36).substr(2, 9);
};

export function _print(message) {
	if (!logger) {
		logger = document.getElementById('log');
	}

	for (let i = 0; i < arguments.length; i++) {
		if (typeof arguments[i] == 'object') {
			logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
		} else {
			logger.innerHTML += arguments[i] + '<br />';
		}
	}
}

export function _print_inline(message) {
	if (!logger) {
		logger = document.getElementById('log');
	}

	for (let i = 0; i < arguments.length; i++) {
		if (typeof arguments[i] == 'object') {
			logger.innerHTML += JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i];
		} else {
			logger.innerHTML += arguments[i];
		}
	}
}

export function _print_bold(message) {
	if (!logger) {
		logger = document.getElementById('log');
	}

	for (let i = 0; i < arguments.length; i++) {
		if (typeof arguments[i] == 'object') {
			logger.innerHTML += '<b>' + (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '</b><br />';
		} else {
			logger.innerHTML += '<b>' + arguments[i] + '</b><br />';
		}
	}
}

export function _print_link(message, onClickFunc, uuid = ID(), carriage = true) {
	if (!logger) {
		logger = document.getElementById('log');
	}

	logger.innerHTML += `<a href="#" id="${uuid}">${message}</a>`;
	if (carriage) {
		logger.innerHTML += '<br />';
	}

	setTimeout(() => {
		document.getElementById(uuid).addEventListener('click', () => {
			console.log('clicked');
			onClickFunc();
			return false;
		});
	}, 1000);
}

export function _init(callback) {
	logger = document.getElementById('log');
	_print(new Date().toString());
	_print('');
	return initWallet(callback);
}

export function sleep(milliseconds: number) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}

export async function sleepAsync(millis: number) {
	await new Promise(r => setTimeout(r, millis));
}

export function start(f) {
	if (f.constructor.name == 'AsyncFunction') {
		f().catch(e => {
			_print(e);
			console.error(e);
			_print('Try refreshing the page.');
		});
	} else {
		f();
	}
}

export function chunk(arr, n) {
	return arr.length ? [arr.slice(0, n), ...chunk(arr.slice(n), n)] : [];
}

export function getUrlParameter(sParam) {
	let sPageURL = window.location.search.substring(1),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

	for (let i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			if (sParameterName[1] !== undefined) {
				return decodeURIComponent(sParameterName[1]);
			}
		}
	}
}

export function showLoading() {
	const el: HTMLElement = document.querySelector('.loader') as HTMLElement;
	el.style.display = 'block';
}

export function hideLoading() {
	const el: HTMLElement = document.querySelector('.loader') as HTMLElement;
	el.style.display = 'none';
}

export function clearLS() {
	localStorage.clear();
}

export function getParameterCaseInsensitive(object, key) {
	return object[Object.keys(object).find(k => k.toLowerCase() === key.toLowerCase())];
}
