import { ethers } from 'ethers';
import { Provider } from 'ethcall';
import Web3Modal from 'web3modal';

import { _print, _print_inline, _print_link, clearLS, getUrlParameter, hideLoading, showLoading, sleep, start } from './utils';
import { ETHEREUM_NODE_URL, NETWORKS } from '../constants';

export const web3Modal: Web3Modal = new Web3Modal({ cacheProvider: true });
let walletProvider: any = undefined;

export async function initWallet(callback) {
	let targetNetwork = pageNetwork();

	if (web3Modal.cachedProvider) {
		await connectWallet(() => {});
	}

	if (walletProvider) {
		let provider = new ethers.providers.Web3Provider(walletProvider);
		let connectedNetwork = await provider.getNetwork();
		let targetNetworkId = parseInt(targetNetwork.chainId, 16);

		if (connectedNetwork.chainId === targetNetworkId) {
			_print_link('[CHANGE WALLET]', changeWallet, 'connect_wallet_button', false);
			_print_inline(' 🔓 \\ 🧹 ');
			_print_link('[CLEAR BROWSER STORAGE]', clearLS, 'clear_browser_storage');

			start(callback);
		} else {
			_print(`You are connected to ${networkNameFromId(connectedNetwork.chainId)}, please switch to ${targetNetwork.chainName} network`);
			// @ts-ignore
			if (window.ethereum && targetNetwork.chainId !== '0x1') {
				_print('');
				_print_link('[SWITCH NETWORK]', () => switchNetwork(targetNetwork), 'connect_wallet_button', false);
				_print_inline(' 🌐 \\ 🧹 ');
				_print_link('[CLEAR BROWSER STORAGE]', clearLS, 'clear_browser_storage');
			}
			hideLoading();
		}
	} else {
		_print_link('[CONNECT WALLET]', () => connectWallet(callback), 'connect_wallet_button', false);
		_print_inline(' 🔓 \\ 🧹 ');
		_print_link('[CLEAR BROWSER STORAGE]', clearLS, 'clear_browser_storage');
		hideLoading();
	}
	_print('');
}

export async function initApp() {
	const App = {
		web3Provider: undefined,
		provider: undefined,
		YOUR_ADDRESS: undefined,
		multicallProvider: undefined,
	};

	let isMetaMaskInstalled: boolean;

	try {
		// Modern dapp browsers...
		if (walletProvider) {
			App.web3Provider = walletProvider;
			App.provider = new ethers.providers.Web3Provider(walletProvider);
			isMetaMaskInstalled = true;

			try {
				// Request account access
				const accounts = await walletProvider.request({
					method: 'eth_requestAccounts',
				});
				App.YOUR_ADDRESS = ethers.utils.getAddress(accounts[0]);
			} catch (error) {
				// User denied account access...
				console.error('User denied account access');
			}
		}
		// If no injected web3 instance is detected, fall back to backup node
		else {
			// @ts-ignore
			App.provider = new ethers.providers.JsonRpcProvider(window.atob(ETHEREUM_NODE_URL));
			isMetaMaskInstalled = false;
			_print("You don't have MetaMask installed! Falling back to backup node..." + '\n (Please install MetaMask extension).\n');
			sleep(100);
		}

		App.multicallProvider = new Provider();
		await App.multicallProvider.init(App.provider);

		let addr = getUrlParameter('addr');

		// resolve ENS domain if possible
		if (typeof addr !== 'undefined') {
			if (addr.includes('.eth')) {
				addr = await App.provider.resolveName(addr);
				if (addr === null) {
					_print('Could not initialize your ENS domain.\n');
				}
			}
			App.YOUR_ADDRESS = addr;
		}

		// Could not load URL parameter
		if (!App.YOUR_ADDRESS) {
			if (!isMetaMaskInstalled) {
				if (localStorage.hasOwnProperty('addr')) {
					App.YOUR_ADDRESS = localStorage.getItem('addr');
				} else {
					App.YOUR_ADDRESS = window.prompt('Enter your eth address.');
				}
			} else {
				let accounts = await App.provider.listAccounts();
				App.YOUR_ADDRESS = accounts[0];
			}
		}
	} catch (e) {
		_print(e);
		console.error(e);
		_print('Something went wrong.');
	}

	if (!App.YOUR_ADDRESS || !ethers.utils.isAddress(App.YOUR_ADDRESS)) {
		throw 'Could not initialize your address. Make sure your address is checksum valid.';
	}

	localStorage.setItem('addr', App.YOUR_ADDRESS);

	return App;
}

function pageNetwork() {
	/*
	let network = window.location.pathname.split("/")[1]
	if (network.toLowerCase() === 'polygon') {
		return NETWORKS.POLYGON
	}
*/
	return NETWORKS.POLYGON;
}

async function connectWallet(callback) {
	try {
		walletProvider = await web3Modal.connect();

		walletProvider.on('accountsChanged', accounts => {
			if (accounts === undefined || accounts.length === 0) {
				web3Modal.clearCachedProvider();
			}
			window.location.reload();
		});

		walletProvider.on('chainChanged', networkId => {
			window.location.reload();
		});

		let targetNetwork = pageNetwork();
		let provider = new ethers.providers.Web3Provider(walletProvider);
		let connectedNetwork = await provider.getNetwork();
		let targetNetworkId = parseInt(targetNetwork.chainId, 16);

		if (connectedNetwork.chainId === targetNetworkId) {
			let button = document.getElementById('connect_wallet_button') as HTMLElement;
			if (!!button) {
				button.textContent = '[CHANGE WALLET]';
				button.onclick = changeWallet;
			}

			showLoading();
			start(callback);
		} else {
			let button = document.getElementById('connect_wallet_button') as HTMLElement;
			if (!!button) {
				button.style.display = 'none';
			}

			_print(`You are connected to ${networkNameFromId(connectedNetwork.chainId)}, please switch to ${targetNetwork.chainName} network`);
			if (window.ethereum && targetNetwork.chainId !== '0x1') {
				_print('');
				_print_link('[SWITCH NETWORK]', () => switchNetwork(targetNetwork), 'connect_wallet_button');
			}
			hideLoading();
		}
	} catch (e) {
		_print(e);
		console.error(e);
		_print('Something went wrong.');
	}
}

export function networkNameFromId(id) {
	for (let network of Object.values(NETWORKS)) {
		let networkId = parseInt(network.chainId, 16);
		if (networkId === id) {
			return network.chainName;
		}
	}
	return 'Unknown Network';
}

export async function switchNetwork(network) {
	await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [network] }).catch();
	window.location.reload();
}

export async function changeWallet() {
	let cached = web3Modal.cachedProvider;
	web3Modal.clearCachedProvider();
	await connectWallet(() => window.location.reload());
	if (!web3Modal.cachedProvider) {
		web3Modal.setCachedProvider(cached);
	}
}
