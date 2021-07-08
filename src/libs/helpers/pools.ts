import { _print, getParameterCaseInsensitive } from './utils';

export function getFarmPrices(tokens, prices, pool, chain = 'eth') {
	if (pool.token0 != null) {
		return getUniPrices(tokens, prices, pool);
	}

	if (pool.token != null) {
		return getWrapPrices(tokens, prices, pool);
	}

	return getErc20Prices(prices, pool, chain);
}

function getUniPrices(tokens, prices, pool) {
	const t0 = getParameterCaseInsensitive(tokens, pool.token0);
	const t1 = getParameterCaseInsensitive(tokens, pool.token1);
	let p0 = getParameterCaseInsensitive(prices, pool.token0)?.usd;
	let p1 = getParameterCaseInsensitive(prices, pool.token1)?.usd;

	if (p0 == null && p1 == null) {
		console.log(`Missing prices for tokens ${pool.token0} and ${pool.token1}.`);
		return undefined;
	}

	if (t0?.decimals == null) {
		console.log(`Missing information for token ${pool.token0}.`);
		return undefined;
	}

	if (t1?.decimals == null) {
		console.log(`Missing information for token ${pool.token1}.`);
		return undefined;
	}

	const q0 = pool.q0 / 10 ** t0.decimals;
	const q1 = pool.q1 / 10 ** t1.decimals;

	if (p0 == null) {
		p0 = (q1 * p1) / q0;
		prices[pool.token0] = { usd: p0 };
	}

	if (p1 == null) {
		p1 = (q0 * p0) / q1;
		prices[pool.token1] = { usd: p1 };
	}

	const tvl = q0 * p0 + q1 * p1;
	const price = tvl / pool.totalSupply;
	const staked_tvl = pool.staked * price;

	prices[pool.address] = { usd: price };

	let stakeTokenTicker = `[${t0.symbol}]-[${t1.symbol}]`;
	if (pool.symbol.includes('SLP')) {
		stakeTokenTicker += ' SLP';
	} else {
		stakeTokenTicker += ' UNI LP';
	}

	return {
		t0: t0,
		p0: p0,
		q0: q0,
		t1: t1,
		p1: p1,
		q1: q1,
		price: price,
		tvl: tvl,
		staked_tvl: staked_tvl,
		stakeTokenTicker: stakeTokenTicker,
		print_price(chain = 'eth', decimals, customURLs) {
			const t0address = t0.symbol == 'ETH' ? 'ETH' : t0.address;
			const t1address = t1.symbol == 'ETH' ? 'ETH' : t1.address;

			if (customURLs) {
				const poolUrl = `${customURLs.info}/${pool.address}`;
				const helperUrls = [
					`${customURLs.add}/${t0address}/${t1address}`,
					`${customURLs.remove}/${t0address}/${t1address}`,
					`${customURLs.swap}?inputCurrency=${t0address}&outputCurrency=${t1address}`,
				];
				const helperHrefs =
					helperUrls.length == 0
						? ''
						: ` <a href='${helperUrls[0]}' target='_blank'>[+]</a> <a href='${helperUrls[1]}' target='_blank'>[-]</a> <a href='${helperUrls[2]}' target='_blank'>[<=>]</a>`;
				_print(
					`<a href='${poolUrl}' target='_blank'>${stakeTokenTicker}</a>${helperHrefs} Price: $${formatMoney(
						price
					)} TVL: $${formatMoney(tvl)}`
				);
				_print(`${t0.symbol} Price: $${displayPrice(p0)}`);
				_print(`${t1.symbol} Price: $${displayPrice(p1)}`);
				_print(`Staked: ${pool.staked.toFixed(decimals ?? 6)} ${pool.symbol} ($${formatMoney(staked_tvl)})`);
			} else {
				const poolUrl = pool.is1inch
					? 'https://1inch.exchange/#/dao/pools'
					: pool.symbol.includes('SLP')
					? {
							eth: `https://analytics.sushi.com/pairs/${pool.address}`,
							bsc: `https://analytics-ftm.sushi.com/pairs/${pool.address}`,
							fantom: `https://analytics-ftm.sushi.com/pairs/${pool.address}`,
							matic: `https://analytics-polygon.sushi.com/pairs/${pool.address}`,
							xdai: `https://analytics-xdai.sushi.com/pairs/${pool.address}`,
					  }[chain]
					: `https://uniswap.info/pair/${pool.address}`;

				const helperUrls = pool.is1inch
					? []
					: pool.symbol.includes('SLP')
					? [
							`https://app.sushi.com/add/${t0address}/${t1address}`,
							`https://app.sushi.com/remove/${t0address}/${t1address}`,
							`https://app.sushi.com/swap?inputCurrency=${t0address}&outputCurrency=${t1address}`,
					  ]
					: [
							`https://app.uniswap.org/#/add/${t0address}/${t1address}`,
							`https://app.uniswap.org/#/remove/${t0address}/${t1address}`,
							`https://app.uniswap.org/#/swap?inputCurrency=${t0address}&outputCurrency=${t1address}`,
					  ];

				const helperHrefs =
					helperUrls.length === 0
						? ''
						: ` <a href='${helperUrls[0]}' target='_blank'>[+]</a> <a href='${helperUrls[1]}' target='_blank'>[-]</a> <a href='${helperUrls[2]}' target='_blank'>[<=>]</a>`;
				_print(
					`<a href='${poolUrl}' target='_blank'>${stakeTokenTicker}</a>${helperHrefs} Price: $${formatMoney(
						price
					)} TVL: $${formatMoney(tvl)}`
				);
				_print(`${t0.symbol} Price: $${displayPrice(p0)}`);
				_print(`${t1.symbol} Price: $${displayPrice(p1)}`);
				_print(`Staked: ${pool.staked.toFixed(decimals ?? 4)} ${pool.symbol} ($${formatMoney(staked_tvl)})`);
			}
		},
		pair_links(chain = 'eth', decimals, customURLs) {
			const t0address = t0.symbol == 'ETH' ? 'ETH' : t0.address;
			const t1address = t1.symbol == 'ETH' ? 'ETH' : t1.address;
			if (customURLs) {
				const poolUrl = `${customURLs.info}/${pool.address}`;
				const helperUrls = [
					`${customURLs.add}/${t0address}/${t1address}`,
					`${customURLs.remove}/${t0address}/${t1address}`,
					`${customURLs.swap}?inputCurrency=${t0address}&outputCurrency=${t1address}`,
				];
				return {
					pair_link: `<a href='${poolUrl}' target='_blank'>${stakeTokenTicker}</a>`,
					add_liquidity_link: `<a href='${helperUrls[0]}' target='_blank'>[+]</a>`,
					remove_liquidity_link: `<a href='${helperUrls[1]}' target='_blank'>[-]</a>`,
					swap_link: `<a href='${helperUrls[2]}' target='_blank'>[<=>]</a>`,
					token0: t0.symbol,
					price0: `$${displayPrice(p0)}`,
					token1: t1.symbol,
					price1: `$${displayPrice(p1)}`,
					total_staked: `${pool.staked.toFixed(4)}`,
					total_staked_dollars: `$${formatMoney(staked_tvl)}`,
					tvl: `$${formatMoney(tvl)}`,
				};
			} else {
				const poolUrl = pool.is1inch
					? 'https://1inch.exchange/#/dao/pools'
					: pool.symbol.includes('SLP')
					? `http://analytics.sushi.com/pairs/${pool.address}`
					: `http://uniswap.info/pair/${pool.address}`;
				const helperUrls = pool.is1inch
					? []
					: pool.symbol.includes('SLP')
					? [
							`https://app.sushi.com/add/${t0address}/${t1address}`,
							`https://app.sushi.com/remove/${t0address}/${t1address}`,
							`https://app.sushi.com/swap?inputCurrency=${t0address}&outputCurrency=${t1address}`,
					  ]
					: [
							`https://app.uniswap.org/#/add/${t0address}/${t1address}`,
							`https://app.uniswap.org/#/remove/${t0address}/${t1address}`,
							`https://app.uniswap.org/#/swap?inputCurrency=${t0address}&outputCurrency=${t1address}`,
					  ];

				return {
					pair_link: `<a href='${poolUrl}' target='_blank'>${stakeTokenTicker}</a>`,
					add_liquidity_link: `<a href='${helperUrls[0]}' target='_blank'>[+]</a>`,
					remove_liquidity_link: `<a href='${helperUrls[1]}' target='_blank'>[-]</a>`,
					swap_link: `<a href='${helperUrls[2]}' target='_blank'>[<=>]</a>`,
					token0: t0.symbol,
					price0: `$${displayPrice(p0)}`,
					token1: t1.symbol,
					price1: `$${displayPrice(p1)}`,
					total_staked: `${pool.staked.toFixed(4)}`,
					total_staked_dollars: `$${formatMoney(staked_tvl)}`,
					tvl: `$${formatMoney(tvl)}`,
				};
			}
		},
		print_contained_price(userStaked) {
			const userPct = userStaked / pool.totalSupply;
			const q0user = userPct * q0;
			const q1user = userPct * q1;
			_print(`Your LP tokens comprise of ${q0user.toFixed(4)} ${t0.symbol} + ${q1user.toFixed(4)} ${t1.symbol}`);
		},
	};
}

function getWrapPrices(tokens, prices, pool) {
	const wrappedToken = pool.token;

	if (wrappedToken.token0 != null) {
		const uniPrices = getUniPrices(tokens, prices, wrappedToken);

		const poolUrl = pool.is1inch
			? 'https://1inch.exchange/#/dao/pools'
			: pool.symbol.includes('SLP')
			? `https://analytics.sushi.com/pairs/${wrappedToken.address}`
			: `https://uniswap.info/pair/${wrappedToken.address}`;

		const name = `<a href='${poolUrl}' target='_blank'>${uniPrices.stakeTokenTicker}</a>`;
		const price = ((pool.balance / 10 ** wrappedToken.decimals) * uniPrices.price) / (pool.totalSupply / 10 ** pool.decimals);
		const tvl = (pool.balance / 10 ** wrappedToken.decimals) * price;
		const staked_tvl = pool.staked * price;

		prices[pool.address] = { usd: price };

		return {
			name: pool.name,
			tvl: tvl,
			staked_tvl: staked_tvl,
			price: price,
			stakeTokenTicker: pool.symbol,
			print_price() {
				_print(`${name} Price: $${formatMoney(price)} TVL: $${formatMoney(tvl)}`);
				_print(`Staked: ${pool.staked.toFixed(4)} ${pool.symbol} ($${formatMoney(staked_tvl)})`);
			},
			print_contained_price(_) {},
		};
	} else {
		let tokenPrice = 0;

		if (wrappedToken.token != null) {
			// e.g. StakeDAO CRV vault
			const pp = getFarmPrices(tokens, prices, wrappedToken.token);
			tokenPrice = pp.price;
		} else {
			tokenPrice = getParameterCaseInsensitive(prices, wrappedToken.address)?.usd;
		}

		const price = ((pool.balance / 10 ** wrappedToken.decimals) * tokenPrice) / (pool.totalSupply / 10 ** pool.decimals);
		const tvl = (pool.balance / 10 ** wrappedToken.decimals) * price;
		const staked_tvl = pool.staked * price;

		prices[pool.address] = { usd: price };

		return {
			name: pool.name,
			tvl: tvl,
			staked_tvl: staked_tvl,
			price: price,
			stakeTokenTicker: pool.symbol,
			print_price() {
				_print(`${pool.symbol} Price: $${formatMoney(price)} TVL: $${formatMoney(tvl)}`);
				_print(`Staked: ${pool.staked.toFixed(4)} ${pool.symbol} ($${formatMoney(staked_tvl)})`);
			},
			print_contained_price(_) {},
		};
	}
}

function getErc20Prices(prices, pool, chain = 'eth') {
	const price = getParameterCaseInsensitive(prices, pool.address)?.usd;
	const tvl = (pool.totalSupply * price) / 10 ** pool.decimals;
	const staked_tvl = pool.staked * price;
	let poolUrl;

	switch (chain) {
		case 'eth':
			poolUrl = `https://etherscan.io/token/${pool.address}`;
			break;
		case 'polygon':
			poolUrl = `https://polygonscan.com/address/${pool.address}`;
			break;
	}

	const getDexGurulink = function () {
		const network = window.location.pathname.split('/')[1];
		let dexGuruLink = '';
		if (tvl > 0) {
			if (network && (network.toLowerCase() === 'eth' || network.toLowerCase() === 'polygon')) {
				dexGuruLink = `<a href='https://dex.guru/token/${pool.address.toLowerCase()}-${network.toLowerCase()}' rel='noopener' target='_blank'>[%]</a>`;
			}
			if (chain && (chain.toLowerCase() === 'eth' || chain.toLowerCase() === 'polygon')) {
				dexGuruLink = `<a href='https://dex.guru/token/${pool.address.toLowerCase()}-${chain.toLowerCase()}' rel='noopener' target='_blank'>[%]</a>`;
			}
		}
		return dexGuruLink;
	};

	const name = `<a href='${poolUrl}' target='_blank'>${pool.symbol}</a>`;
	return {
		staked_tvl: staked_tvl,
		price: price,
		stakeTokenTicker: pool.symbol,
		print_price() {
			_print(`${name} Price: $${displayPrice(price)} Market Cap: $${formatMoney(tvl)} ${getDexGurulink()}`);
			_print(`Staked: ${pool.staked.toFixed(4)} ${pool.symbol} ($${formatMoney(staked_tvl)})`);
		},
		pair_links() {
			return {
				pair_link: name,
				add_liquidity_link: '',
				remove_liquidity_link: '',
				swap_link: '',
				price0: '',
				price1: '',
				total_staked: `${pool.staked.toFixed(4)}`,
				total_staked_dollars: `$${formatMoney(staked_tvl)}`,
				tvl: `$${formatMoney(tvl)}`,
			};
		},
		print_contained_price() {},
	};
}

export function formatMoney(amount, decimalCount = 2, decimal = '.', thousands = ','): string {
	try {
		decimalCount = Math.abs(decimalCount);
		decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

		const negativeSign = amount < 0 ? '-' : '';

		let i = parseInt((amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))).toString();
		let j = i.length > 3 ? i.length % 3 : 0;

		return (
			negativeSign +
			(j ? i.substr(0, j) + thousands : '') +
			i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
			(decimalCount
				? decimal +
				  Math.abs(amount - Number(i))
						.toFixed(decimalCount)
						.slice(2)
				: '')
		);
	} catch (e) {
		console.log(e);
	}
}

export function displayPrice(price: number): string {
	const priceDecimals = price === 0 ? 2 : price < 0.0001 ? 10 : price < 0.01 ? 6 : 2;
	return priceDecimals === 2 ? formatMoney(price) : price.toFixed(priceDecimals);
}
