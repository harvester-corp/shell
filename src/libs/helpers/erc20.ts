import { ethers, Contract } from 'ethers';
import ethcall from 'ethcall';

import { ERC20_ABI, PICKLE_JAR_ABI, POLYGON_TOKENS, UNI_V2_PAIR_ABI } from '../constants';
import { chunk } from './utils';

export async function getCommonERC20Prices() {
	const idPrices = await lookUpPrices(POLYGON_TOKENS.map(x => x.id));
	const prices = {};
	for (const bt of POLYGON_TOKENS) {
		if (idPrices[bt.id]) {
			prices[bt.contract] = idPrices[bt.id];
		}
	}
	return prices;
}

async function lookUpPrices(id_array) {
	const prices = {};

	for (const id_chunk of chunk(id_array, 50)) {
		let ids = id_chunk.join('%2C');
		let res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=' + ids + '&vs_currencies=usd', {
			method: 'GET', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'same-origin', // include, *same-origin, omit
			headers: {
				// 'Content-Type': 'application/json'
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			redirect: 'follow', // manual, *follow, error
			referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			// body: JSON.stringify(data) // body data type must match "Content-Type" header
		});
		res = await res.json();

		for (const [key, v] of Object.entries(res)) {
			if (v.usd) prices[key] = v;
		}
	}

	return prices;
}

async function getUniswapPool(App: any, pool: Contract, poolAddress: string, stakingAddress: string) {
	let q0, q1;
	const reserves = await pool.getReserves();
	q0 = reserves.reserve0;
	q1 = reserves.reserve1;

	const decimals = await pool.decimals();
	const token0 = await pool.token0();
	const token1 = await pool.token1();

	return {
		symbol: await pool.symbol(),
		name: await pool.name(),
		address: poolAddress,
		token0,
		q0,
		token1,
		q1,
		totalSupply: (await pool.totalSupply()) / 10 ** decimals,
		stakingAddress: stakingAddress,
		staked: (await pool.balanceOf(stakingAddress)) / 10 ** decimals,
		decimals: decimals,
		unstaked: (await pool.balanceOf(App.YOUR_ADDRESS)) / 10 ** decimals,
		contract: pool,
		tokens: [token0, token1],
		is1inch: false,
	};
}

async function getJar(App: any, jar: ethcall.Contract, address, stakingAddress) {
	const calls = [
		jar.decimals(),
		jar.token(),
		jar.name(),
		jar.symbol(),
		jar.totalSupply(),
		jar.balanceOf(stakingAddress),
		jar.balanceOf(App.YOUR_ADDRESS),
		jar.balance(),
	];

	const [decimals, token, name, symbol, totalSupply, staked, unstaked, balance] = await App.multicallProvider.all(calls);
	const underlying = await getPolygonToken(App, token, address);

	return {
		address,
		token: underlying,
		name,
		symbol,
		totalSupply,
		decimals: decimals,
		staked: staked / 10 ** decimals,
		unstaked: unstaked / 10 ** decimals,
		balance: balance,
		contract: jar,
		tokens: [address].concat(underlying.tokens),
	};
}

async function getStoredPolygonToken(App, tokenAddress, stakingAddress, type) {
	switch (type) {
		case 'uniswap':
			const pool = new ethers.Contract(tokenAddress, UNI_V2_PAIR_ABI, App.provider);
			return await getUniswapPool(App, pool, tokenAddress, stakingAddress);
		case 'jar':
			const jar: ethcall.Contract = new ethcall.Contract(tokenAddress, PICKLE_JAR_ABI);
			return await getJar(App, jar, tokenAddress, stakingAddress);
		case 'erc20':
			const erc20 = new ethers.Contract(tokenAddress, ERC20_ABI, App.provider);
			return await formatERC20(App, erc20, tokenAddress, stakingAddress);
	}
}

// try establishing tokens in order of descending specificity
export async function getPolygonToken(App, tokenAddress, stakingAddress) {
	if (tokenAddress == '0x0000000000000000000000000000000000000000') {
		return formatERC20(App, null, tokenAddress, '');
	}

	const type = localStorage.getItem(tokenAddress);
	if (type) {
		// known token (just reload from local storage)
		return getStoredPolygonToken(App, tokenAddress, stakingAddress, type);
	}

	try {
		const pool = new ethers.Contract(tokenAddress, UNI_V2_PAIR_ABI, App.provider);
		const uniPool = await getUniswapPool(App, pool, tokenAddress, stakingAddress);
		localStorage.setItem(tokenAddress, 'uniswap');
		return uniPool;
	} catch {}

	try {
		const jar: ethcall.Contract = new ethcall.Contract(tokenAddress, PICKLE_JAR_ABI);
		const pickleJar = await getJar(App, jar, tokenAddress, stakingAddress);
		localStorage.setItem(tokenAddress, 'jar');
		return pickleJar;
	} catch {}

	try {
		const erc20 = new ethers.Contract(tokenAddress, ERC20_ABI, App.provider);
		const erc20tok = await formatERC20(App, erc20, tokenAddress, stakingAddress);
		localStorage.setItem(tokenAddress, 'erc20');
		return erc20tok;
	} catch (err) {
		console.log(err);
		console.log(`Couldn't match ${tokenAddress} to any known token type.`);
	}
}

async function formatERC20(App: any, token: Contract, address: string, stakingAddress: string) {
	if (address == '0x0000000000000000000000000000000000000000') {
		return {
			address,
			name: 'Matic',
			symbol: 'MATIC',
			totalSupply: 1e8,
			decimals: 18,
			staked: 0,
			unstaked: 0,
			contract: null,
			tokens: [address],
		};
	}
	const decimals = await token.decimals();
	if (address === '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619') {
		return {
			address,
			name: 'Wrapped Ether',
			symbol: 'WETH',
			totalSupply: await token.totalSupply(),
			decimals: decimals,
			staked: (await token.balanceOf(stakingAddress)) / 10 ** decimals,
			unstaked: (await token.balanceOf(App.YOUR_ADDRESS)) / 10 ** decimals,
			contract: token,
			tokens: [address],
		};
	}
	if (address === '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270') {
		return {
			address,
			name: 'Wrapped Matic',
			symbol: 'WMATIC',
			totalSupply: await token.totalSupply(),
			decimals: decimals,
			staked: (await token.balanceOf(stakingAddress)) / 10 ** decimals,
			unstaked: (await token.balanceOf(App.YOUR_ADDRESS)) / 10 ** decimals,
			contract: token,
			tokens: [address],
		};
	}
	return {
		address,
		name: await token.name(),
		symbol: await token.symbol(),
		totalSupply: await token.totalSupply(),
		decimals: decimals,
		staked: (await token.balanceOf(stakingAddress)) / 10 ** decimals,
		unstaked: (await token.balanceOf(App.YOUR_ADDRESS)) / 10 ** decimals,
		contract: token,
		tokens: [address],
	};
}
