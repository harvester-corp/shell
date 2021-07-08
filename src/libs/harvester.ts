import { ethers, Contract } from 'ethers';
import makeBlockie from 'ethereum-blockies-base64';

import { ERC20_ABI, GREAT_HARVESTER_ABI, GREAT_HARVESTER_ADDR } from './constants';
import { _print, _print_bold, _print_inline, _print_link, getParameterCaseInsensitive, hideLoading, showLoading } from './helpers/utils';
import { initApp } from './helpers/ethers';
import { getCommonERC20Prices, getPolygonToken } from './helpers/erc20';
import { formatMoney, getFarmPrices } from './helpers/pools';

export async function main() {
	const App = await initApp();

	_print(
		`❯ Initialized <a href='https://polygonscan.com/address/${App.YOUR_ADDRESS}' target='_blank'>${
			App.YOUR_ADDRESS
		}</a> <img src="${makeBlockie(App.YOUR_ADDRESS)}" alt="" width="20px" height="20px" style="border-radius: 4px" />`
	);
	_print('❯ Reading smart contracts...');

	const rewardTokenTicker = '🌾';
	const GreatHarvester: Contract = new ethers.Contract(GREAT_HARVESTER_ADDR, GREAT_HARVESTER_ABI, App.provider);

	const startBlock = await GreatHarvester.startBlock();
	const currentBlock = await App.provider.getBlockNumber();

	let rewardsPerWeek = 0;
	if (currentBlock < startBlock) {
		_print(`❯ Rewards start at block ${startBlock}\n`);
	} else {
		rewardsPerWeek = (((await GreatHarvester.cropPerBlock()) / 1e18) * 604800) / 2.1;
	}

	await loadGreatHarvesterFarms(App, GreatHarvester, rewardTokenTicker, 'crop', null, rewardsPerWeek, 'pendingCrops');

	hideLoading();
}

async function loadGreatHarvesterFarms(
	App: any,
	GH,
	rewardTokenTicker,
	rewardTokenFunction,
	rewardsPerBlockFunction,
	rewardsPerWeekFixed,
	pendingRewardsFunction,
	deathFarmIndices = undefined
) {
	const chefContract = GH ?? new ethers.Contract(GREAT_HARVESTER_ADDR, GREAT_HARVESTER_ABI, App.provider);

	const poolCount = parseInt(await chefContract.farmsCount(), 10);
	const totalAllocPoints = await chefContract.totalAllocPoints();

	_print(`❯ Found ${poolCount} farms (showing only active farms)`);

	const rewardTokenAddress = await chefContract.callStatic[rewardTokenFunction]();
	const rewardToken = await getPolygonToken(App, rewardTokenAddress, GREAT_HARVESTER_ADDR);
	const rewardsPerWeek =
		rewardsPerWeekFixed ?? (((await chefContract.callStatic[rewardsPerBlockFunction]()) / 10 ** rewardToken.decimals) * 604800) / 3;

	const farmsInfo = await Promise.all(
		[...Array(poolCount).keys()].map(async x => await getFarmInfo(App, chefContract, GREAT_HARVESTER_ADDR, x, pendingRewardsFunction))
	);

	let tokenAddresses: string[] = [].concat.apply(
		[],
		farmsInfo.filter(x => x.poolToken).map(x => x.poolToken.tokens)
	);
	let tokens = {};

	await Promise.all(
		tokenAddresses.map(async address => {
			tokens[address] = await getPolygonToken(App, address, GREAT_HARVESTER_ADDR);
		})
	);

	const prices = await getCommonERC20Prices();

	if (deathFarmIndices) {
		// load prices for the deathpool assets
		deathFarmIndices
			.map(i => farmsInfo[i])
			.map(farmInfo => (farmInfo.poolToken ? getFarmPrices(tokens, prices, farmInfo.poolToken, 'polygon') : undefined));
	}

	const farmsPrices = farmsInfo.map(farmInfo => {
		return farmInfo.poolToken ? getFarmPrices(tokens, prices, farmInfo.poolToken, 'polygon') : undefined;
	});

	// _print('❯ Finished reading smart contracts');
	_print('<hr>');

	let APRs = [];
	for (let i = 0; i < poolCount; i++) {
		if (farmsPrices[i]) {
			const apr = printFarm(
				App,
				prices,
				tokens,
				farmsInfo[i],
				i,
				farmsPrices[i],
				totalAllocPoints,
				rewardsPerWeek,
				rewardTokenTicker,
				rewardTokenAddress,
				pendingRewardsFunction,
				null,
				null,
				'matic',
				farmsInfo[i].depositFee,
				farmsInfo[i].withdrawFee
			);
			APRs.push(apr);
		}
	}

	let totalUserStaked = 0,
		totalStaked = 0,
		averageApr = 0;
	for (const a of APRs) {
		if (!isNaN(a.totalStakedUsd)) {
			totalStaked += a.totalStakedUsd;
		}
		if (a.userStakedUsd > 0) {
			totalUserStaked += a.userStakedUsd;
			averageApr += (a.userStakedUsd * a.yearlyAPR) / 100;
		}
	}

	averageApr = averageApr / totalUserStaked;
	_print_bold(`Total Staked: $${formatMoney(totalStaked)}`);

	if (totalUserStaked > 0) {
		_print_bold(`\nYou are staking a total of $${formatMoney(totalUserStaked)} at an average APR of ${(averageApr * 100).toFixed(2)}%`);
		_print(
			`Estimated earnings:` +
				` Day $${formatMoney((totalUserStaked * averageApr) / 365)}` +
				` Week $${formatMoney((totalUserStaked * averageApr) / 52)}` +
				` Year $${formatMoney(totalUserStaked * averageApr)}\n`
		);
	}

	return { prices, totalUserStaked, totalStaked, averageApr };
}

async function getFarmInfo(app, GH, chefAddress, poolIndex, pendingRewardsFunction) {
	const poolInfo = await GH.farms(poolIndex);
	if (poolInfo.allocPoints === 0) {
		return {
			address: poolInfo.seed,
			allocPoints: poolInfo.allocPoints ?? 1,
			poolToken: null,
			userStaked: 0,
			pendingRewardTokens: 0,
		};
	}

	const poolToken = await getPolygonToken(app, poolInfo.seed, GREAT_HARVESTER_ADDR);
	poolToken.staked = poolInfo.seeds / 10 ** poolToken.decimals;

	const userInfo = await GH.farmers(poolIndex, app.YOUR_ADDRESS);
	const pendingRewardTokens = await GH.callStatic[pendingRewardsFunction](poolIndex, app.YOUR_ADDRESS);
	const staked = userInfo.seeds / 10 ** poolToken.decimals;

	return {
		address: poolInfo.seed,
		allocPoints: poolInfo.allocPoints ?? 1,
		poolToken: poolToken,
		userStaked: staked,
		pendingRewardTokens: pendingRewardTokens / 10 ** 18,
		depositFee: (poolInfo.sowFee ?? 0) / 100,
		withdrawFee: (poolInfo.reapFee ?? 0) / 100,
	};
}

function printFarm(
	App,
	prices,
	tokens,
	poolInfo,
	poolIndex,
	poolPrices,
	totalAllocPoints,
	rewardsPerWeek,
	rewardTokenTicker,
	rewardTokenAddress,
	pendingRewardsFunction,
	fixedDecimals,
	claimFunction,
	chain = 'eth',
	depositFee = 0,
	withdrawFee = 0
) {
	fixedDecimals = fixedDecimals ?? 2;
	const sp = poolInfo.stakedToken == null ? null : getFarmPrices(tokens, prices, poolInfo.stakedToken, chain);
	const poolRewardsPerWeek = (poolInfo.allocPoints / totalAllocPoints) * rewardsPerWeek;

	if (poolRewardsPerWeek == 0 && rewardsPerWeek != 0) return;

	const userStaked = poolInfo.userLPStaked ?? poolInfo.userStaked;
	const rewardPrice = getParameterCaseInsensitive(prices, rewardTokenAddress)?.usd;
	const staked_tvl = sp?.staked_tvl ?? poolPrices.staked_tvl;

	_print_inline(`${poolIndex} - `);
	poolPrices.print_price(chain, NaN, undefined);
	sp?.print_price(chain, NaN, undefined);

	const apr = printAPR(
		rewardTokenTicker,
		rewardPrice,
		poolRewardsPerWeek,
		poolPrices.stakeTokenTicker,
		staked_tvl,
		userStaked,
		poolPrices.price,
		fixedDecimals
	);

	if (poolInfo.userLPStaked > 0) sp?.print_contained_price(userStaked);
	if (poolInfo.userStaked > 0) poolPrices.print_contained_price(userStaked);

	printHarvesterContractLinks(
		App,
		poolIndex,
		poolInfo.address,
		pendingRewardsFunction,
		rewardTokenTicker,
		poolPrices.stakeTokenTicker,
		poolInfo.poolToken.unstaked,
		poolInfo.userStaked,
		poolInfo.pendingRewardTokens,
		fixedDecimals,
		claimFunction,
		rewardPrice,
		chain,
		depositFee,
		withdrawFee
	);

	return apr;
}

function printAPR(rewardTokenTicker, rewardPrice, poolRewardsPerWeek, stakeTokenTicker, staked_tvl, userStaked, poolTokenPrice, fixedDecimals) {
	let usdPerWeek = poolRewardsPerWeek * rewardPrice;
	fixedDecimals = fixedDecimals ?? 2;

	_print(`${rewardTokenTicker} Per Week: ${poolRewardsPerWeek.toFixed(fixedDecimals)} ($${formatMoney(usdPerWeek)})`);

	let weeklyAPR = (usdPerWeek / staked_tvl) * 100;
	let dailyAPR = weeklyAPR / 7;
	let yearlyAPR = weeklyAPR * 52;

	_print(`APR: Day ${dailyAPR.toFixed(2)}% Week ${weeklyAPR.toFixed(2)}% Year ${yearlyAPR.toFixed(2)}%`);

	let userStakedUsd = userStaked * poolTokenPrice;
	let userStakedPct = (userStakedUsd / staked_tvl) * 100;

	_print(
		`You are staking ${userStaked.toFixed(fixedDecimals)} ${stakeTokenTicker} ($${formatMoney(userStakedUsd)}), ${userStakedPct.toFixed(
			2
		)}% of the pool.`
	);

	let userWeeklyRewards = (userStakedPct * poolRewardsPerWeek) / 100;
	let userDailyRewards = userWeeklyRewards / 7;
	let userYearlyRewards = userWeeklyRewards * 52;

	if (userStaked > 0) {
		_print(
			`Estimated ${rewardTokenTicker} earnings:` +
				` Day ${userDailyRewards.toFixed(fixedDecimals)} ($${formatMoney(userDailyRewards * rewardPrice)})` +
				` Week ${userWeeklyRewards.toFixed(fixedDecimals)} ($${formatMoney(userWeeklyRewards * rewardPrice)})` +
				` Year ${userYearlyRewards.toFixed(fixedDecimals)} ($${formatMoney(userYearlyRewards * rewardPrice)})`
		);
	}

	return {
		userStakedUsd,
		totalStakedUsd: staked_tvl,
		userStakedPct,
		yearlyAPR,
		userYearlyUsd: userYearlyRewards * rewardPrice,
	};
}

function printHarvesterContractLinks(
	App,
	poolIndex,
	poolAddress,
	pendingRewardsFunction,
	rewardTokenTicker,
	stakeTokenTicker,
	unstaked,
	userStaked,
	pendingRewardTokens,
	fixedDecimals,
	claimFunction,
	rewardTokenPrice,
	chain,
	depositFee,
	withdrawFee
) {
	fixedDecimals = fixedDecimals ?? 2;

	const sow = async function () {
		return stake(App, poolIndex, poolAddress);
	};

	const reap = async function () {
		return unstake(App, poolIndex, pendingRewardsFunction);
	};

	const DDT = async function () {
		return emergencyExit(App, poolIndex);
	};

	if (depositFee > 0) {
		_print_link(`Stake ${unstaked.toFixed(fixedDecimals)} ${stakeTokenTicker} - [Fee ${depositFee}%]`, sow);
	} else {
		_print_link(`Stake ${unstaked.toFixed(fixedDecimals)} ${stakeTokenTicker}`, reap);
	}

	if (withdrawFee > 0) {
		_print_link(
			`Unstake ${userStaked.toFixed(fixedDecimals)} ${stakeTokenTicker} & Claim ${pendingRewardTokens.toFixed(
				fixedDecimals
			)} ${rewardTokenTicker} ($${formatMoney(pendingRewardTokens * rewardTokenPrice)}) - [Fee ${withdrawFee}%]`,
			unstake
		);
	} else {
		_print_link(
			`Unstake ${userStaked.toFixed(fixedDecimals)} ${stakeTokenTicker} & Claim ${pendingRewardTokens.toFixed(
				fixedDecimals
			)} ${rewardTokenTicker} ($${formatMoney(pendingRewardTokens * rewardTokenPrice)})`,
			unstake
		);
	}

	_print(`Staking or un-staking also claims all pending 🌾 rewards. DDT forfeits all rewards.`);
	_print_link(`DDT (emergency-only)`, DDT);
	_print('');
}

async function stake(App, poolIndex, stakeTokenAddr) {
	const signer = App.provider.getSigner();

	const STAKING_TOKEN = new ethers.Contract(stakeTokenAddr, ERC20_ABI, signer);
	const GREAT_HARVESTER = new ethers.Contract(GREAT_HARVESTER_ADDR, GREAT_HARVESTER_ABI, signer);

	const currentTokens = await STAKING_TOKEN.balanceOf(App.YOUR_ADDRESS);
	const allowedTokens = await STAKING_TOKEN.allowance(App.YOUR_ADDRESS, GREAT_HARVESTER_ADDR);

	let allow = Promise.resolve();

	if (allowedTokens / 1e18 < currentTokens / 1e18) {
		showLoading();
		allow = STAKING_TOKEN.approve(GREAT_HARVESTER_ADDR, ethers.constants.MaxUint256)
			.then(function (t) {
				return App.provider.waitForTransaction(t.hash);
			})
			.catch(function () {
				hideLoading();
				alert('Try resetting your approval to 0 first');
			});
	}

	if (currentTokens / 1e18 > 0) {
		showLoading();
		allow
			.then(async function () {
				const gasLimit = await GREAT_HARVESTER.estimateGas.sow(poolIndex, currentTokens);
				GREAT_HARVESTER.sow(poolIndex, currentTokens, { gasLimit: gasLimit.mul(2) })
					.then(function (t) {
						App.provider.waitForTransaction(t.hash).then(function () {
							hideLoading();
						});
					})
					.catch(function () {
						hideLoading();
						_print('Something went wrong.');
					});
			})
			.catch(function () {
				hideLoading();
				_print('Something went wrong.');
			});
	} else {
		alert('You have no tokens to stake!!');
	}
}

async function unstake(App, poolIndex, pendingRewardsFunction) {
	const signer = App.provider.getSigner();
	const GREAT_HARVESTER = new ethers.Contract(GREAT_HARVESTER_ADDR, GREAT_HARVESTER_ABI, signer);

	const currentStakedAmount = (await GREAT_HARVESTER.userInfo(poolIndex, App.YOUR_ADDRESS)).amount;
	const earnedTokenAmount = (await GREAT_HARVESTER.callStatic[pendingRewardsFunction](poolIndex, App.YOUR_ADDRESS)) / 1e18;

	if (currentStakedAmount > 0) {
		showLoading();
		const gasLimit = await GREAT_HARVESTER.estimateGas.reap(poolIndex);
		GREAT_HARVESTER.reap(poolIndex, { gasLimit: gasLimit.mul(2) })
			.then(function (t) {
				return App.provider.waitForTransaction(t.hash);
			})
			.catch(function () {
				hideLoading();
			});
	}
}

async function emergencyExit(App, poolIndex) {
	const signer = App.provider.getSigner();
	const GREAT_HARVESTER = new ethers.Contract(GREAT_HARVESTER_ADDR, GREAT_HARVESTER_ABI, signer);

	showLoading();

	const gasLimit = await GREAT_HARVESTER.estimateGas.DDT(poolIndex);
	GREAT_HARVESTER.DDT(poolIndex, { gasLimit: gasLimit.mul(2) })
		.then(function (t) {
			return App.provider.waitForTransaction(t.hash);
		})
		.catch(function () {
			hideLoading();
		});
}
