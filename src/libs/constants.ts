export const ETHEREUM_NODE_URL = 'https://rpc-mainnet.matic.quiknode.pro';
export const NETWORKS = {
	ETHEREUM: {
		chainId: '0x1',
		chainName: 'Ethereum Mainnet',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: [
			'https://mainnet.infura.io/v3/${INFURA_API_KEY}',
			'wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}',
			'https://api.mycryptoapi.com/eth',
			'https://cloudflare-eth.com',
		],
		blockExplorerUrls: ['https://etherscan.io'],
	},
	POLYGON: {
		chainId: '0x89',
		chainName: 'Matic Mainnet',
		nativeCurrency: {
			name: 'Matic',
			symbol: 'MATIC',
			decimals: 18,
		},
		rpcUrls: ['https://rpc-mainnet.matic.network', 'wss://ws-mainnet.matic.network'],
	},
	XDAI: {
		chainId: '0x64',
		chainName: 'xDAI Chain',
		nativeCurrency: {
			name: 'xDAI',
			symbol: 'xDAI',
			decimals: 18,
		},
		rpcUrls: [
			'https://rpc.xdaichain.com',
			'https://xdai.poanetwork.dev',
			'wss://rpc.xdaichain.com/wss',
			'wss://xdai.poanetwork.dev/wss',
			'https://dai.poa.network',
			'ws://xdai.poanetwork.dev:8546',
		],
	},
	AVALANCHE: {
		chainId: '0xA86A',
		chainName: 'Avalanche Mainnet',
		nativeCurrency: {
			name: 'Avalanche',
			symbol: 'AVAX',
			decimals: 18,
		},
		rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
	},
	FANTOM: {
		chainId: '0xFA',
		chainName: 'Fantom Opera',
		nativeCurrency: {
			name: 'Fantom',
			symbol: 'FTM',
			decimals: 18,
		},
		rpcUrls: ['https://rpcapi.fantom.network'],
		blockExplorerUrls: ['https://ftmscan.com'],
	},
};

export const GREAT_HARVESTER_ADDR = '0xb49036Fb35b4E1572509f301e1b0fd0113771ffa';
export const GREAT_HARVESTER_ABI = [
	{
		inputs: [
			{ internalType: 'contract Crop', name: '_crop', type: 'address' },
			{ internalType: 'address', name: '_treasury', type: 'address' },
			{ internalType: 'uint256', name: '_cropPerBlock', type: 'uint256' },
			{ internalType: 'uint256', name: '_startBlock', type: 'uint256' },
			{
				internalType: 'contract IUniswapV2Router02',
				name: '_router',
				type: 'address',
			},
			{
				internalType: 'contract IERC20',
				name: '_denomination',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [{ internalType: 'uint256', name: 'seed', type: 'uint256' }],
		name: 'BiggerSeedRequired',
		type: 'error',
	},
	{
		inputs: [
			{ internalType: 'uint16', name: 'sowFee', type: 'uint16' },
			{ internalType: 'uint256', name: 'reapFee', type: 'uint256' },
		],
		name: 'InvalidFarmFees',
		type: 'error',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'oldCropPerBlock',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'newCropPerBlock',
				type: 'uint256',
			},
		],
		name: 'CropGrowthAltered',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'farmer',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'fid',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'seeds',
				type: 'uint256',
			},
		],
		name: 'DDTSprayed',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'seed',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'allocPoints',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint16',
				name: 'sowFee',
				type: 'uint16',
			},
			{
				indexed: false,
				internalType: 'uint16',
				name: 'reapFee',
				type: 'uint16',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'feeRotation',
				type: 'bool',
			},
		],
		name: 'FarmAdded',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'seed',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'allocPoints',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint16',
				name: 'sowFee',
				type: 'uint16',
			},
			{
				indexed: false,
				internalType: 'uint16',
				name: 'reapFee',
				type: 'uint16',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'feeRotation',
				type: 'bool',
			},
		],
		name: 'FarmUpdated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'bool',
				name: 'oldRotation',
				type: 'bool',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'newRotation',
				type: 'bool',
			},
		],
		name: 'FeeRotationToggled',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'formerGov',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newGov',
				type: 'address',
			},
		],
		name: 'GovernanceChanged',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'farmer',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'fid',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'seeds',
				type: 'uint256',
			},
		],
		name: 'Reap',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'oldStartBlock',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'newStartBlock',
				type: 'uint256',
			},
		],
		name: 'RewardsStartDelayed',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'farmer',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'fid',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'seeds',
				type: 'uint256',
			},
		],
		name: 'Sow',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'oldTreasury',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newTreasury',
				type: 'address',
			},
		],
		name: 'TreasuryChanged',
		type: 'event',
	},
	{
		inputs: [{ internalType: 'uint256', name: '_fid', type: 'uint256' }],
		name: 'DDT',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'PAIR_DENOMINATION',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'UNI_V2_CROP_PAIR',
		outputs: [
			{
				internalType: 'contract IUniswapV2Pair',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'UNI_V2_ROUTER_LIKE',
		outputs: [
			{
				internalType: 'contract IUniswapV2Router02',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'acceptGovernance',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'contract IERC20', name: '_seed', type: 'address' },
			{ internalType: 'uint256', name: '_allocPoints', type: 'uint256' },
			{ internalType: 'uint16', name: '_sowFee', type: 'uint16' },
			{ internalType: 'uint16', name: '_reapFee', type: 'uint16' },
			{ internalType: 'bool', name: '_feeRotation', type: 'bool' },
			{ internalType: 'bool', name: '_sync', type: 'bool' },
		],
		name: 'addFarm',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'newCropPerBlock',
				type: 'uint256',
			},
		],
		name: 'alterCropGrowth',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '_newGov', type: 'address' }],
		name: 'changeGovernance',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'newTreasury', type: 'address' }],
		name: 'changeTreasury',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'crop',
		outputs: [{ internalType: 'contract Crop', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'cropPerBlock',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: 'newStartBlock', type: 'uint256' }],
		name: 'delayStartBlock',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
		name: 'farmId',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'uint256', name: '', type: 'uint256' },
			{ internalType: 'address', name: '', type: 'address' },
		],
		name: 'farmers',
		outputs: [
			{ internalType: 'uint256', name: 'seeds', type: 'uint256' },
			{ internalType: 'uint256', name: 'rewardDebt', type: 'uint256' },
			{ internalType: 'uint256', name: 'lastSeed', type: 'uint256' },
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		name: 'farms',
		outputs: [
			{ internalType: 'contract IERC20', name: 'seed', type: 'address' },
			{ internalType: 'uint256', name: 'seeds', type: 'uint256' },
			{ internalType: 'uint256', name: 'allocPoints', type: 'uint256' },
			{
				internalType: 'uint256',
				name: 'lastRewardBlock',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'accCropsPerShare',
				type: 'uint256',
			},
			{ internalType: 'uint16', name: 'sowFee', type: 'uint16' },
			{ internalType: 'uint16', name: 'reapFee', type: 'uint16' },
			{ internalType: 'bool', name: 'feeRotation', type: 'bool' },
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'farmsCount',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'governance',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'hasFeeRotation',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
		name: 'isFarm',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'uint256', name: '_fid', type: 'uint256' },
			{ internalType: 'address', name: '_farmer', type: 'address' },
		],
		name: 'pendingCrops',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'pendingGovernance',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: '_fid', type: 'uint256' }],
		name: 'reap',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'removeGovernance',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'uint256', name: '_fid', type: 'uint256' },
			{ internalType: 'uint256', name: '_allocPoints', type: 'uint256' },
			{ internalType: 'uint16', name: '_sowFee', type: 'uint16' },
			{ internalType: 'uint16', name: '_reapFee', type: 'uint16' },
			{ internalType: 'bool', name: '_feeRotation', type: 'bool' },
		],
		name: 'setFarm',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'uint256', name: '_fid', type: 'uint256' },
			{ internalType: 'uint256', name: '_seed', type: 'uint256' },
		],
		name: 'sow',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'startBlock',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'toggleFeeRotation',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalAllocPoints',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'treasury',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
];

export const ERC20_ABI = [
	{
		constant: true,
		inputs: [],
		name: 'name',
		outputs: [{ name: '', type: 'string' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ name: '_spender', type: 'address' },
			{ name: '_value', type: 'uint256' },
		],
		name: 'approve',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'totalSupply',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ name: '_from', type: 'address' },
			{ name: '_to', type: 'address' },
			{ name: '_value', type: 'uint256' },
		],
		name: 'transferFrom',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'decimals',
		outputs: [{ name: '', type: 'uint8' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [{ name: '_owner', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ name: 'balance', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'symbol',
		outputs: [{ name: '', type: 'string' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ name: '_to', type: 'address' },
			{ name: '_value', type: 'uint256' },
		],
		name: 'transfer',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{ name: '_owner', type: 'address' },
			{ name: '_spender', type: 'address' },
		],
		name: 'allowance',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{ payable: true, stateMutability: 'payable', type: 'fallback' },
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'owner', type: 'address' },
			{ indexed: true, name: 'spender', type: 'address' },
			{ indexed: false, name: 'value', type: 'uint256' },
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'from', type: 'address' },
			{ indexed: true, name: 'to', type: 'address' },
			{ indexed: false, name: 'value', type: 'uint256' },
		],
		name: 'Transfer',
		type: 'event',
	},
];
export const UNI_V2_PAIR_ABI = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount0',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount1',
				type: 'uint256',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
		],
		name: 'Burn',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount0',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount1',
				type: 'uint256',
			},
		],
		name: 'Mint',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount0In',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount1In',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount0Out',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount1Out',
				type: 'uint256',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
		],
		name: 'Swap',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint112',
				name: 'reserve0',
				type: 'uint112',
			},
			{
				indexed: false,
				internalType: 'uint112',
				name: 'reserve1',
				type: 'uint112',
			},
		],
		name: 'Sync',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		inputs: [],
		name: 'DOMAIN_SEPARATOR',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'MINIMUM_LIQUIDITY',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [],
		name: 'PERMIT_TYPEHASH',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
		],
		name: 'allowance',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'approve',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		name: 'balanceOf',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
		],
		name: 'burn',
		outputs: [
			{
				internalType: 'uint256',
				name: 'amount0',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'amount1',
				type: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'decimals',
		outputs: [
			{
				internalType: 'uint8',
				name: '',
				type: 'uint8',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [],
		name: 'factory',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getReserves',
		outputs: [
			{
				internalType: 'uint112',
				name: 'reserve0',
				type: 'uint112',
			},
			{
				internalType: 'uint112',
				name: 'reserve1',
				type: 'uint112',
			},
			{
				internalType: 'uint32',
				name: 'blockTimestampLast',
				type: 'uint32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'kLast',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
		],
		name: 'mint',
		outputs: [
			{
				internalType: 'uint256',
				name: 'liquidity',
				type: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'name',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		name: 'nonces',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'deadline',
				type: 'uint256',
			},
			{
				internalType: 'uint8',
				name: 'v',
				type: 'uint8',
			},
			{
				internalType: 'bytes32',
				name: 'r',
				type: 'bytes32',
			},
			{
				internalType: 'bytes32',
				name: 's',
				type: 'bytes32',
			},
		],
		name: 'permit',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'price0CumulativeLast',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'price1CumulativeLast',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
		],
		name: 'skim',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'amount0Out',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'amount1Out',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'bytes',
				name: 'data',
				type: 'bytes',
			},
		],
		name: 'swap',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [],
		name: 'sync',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'token0',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'token1',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'transfer',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'transferFrom',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
];
export const PICKLE_JAR_ABI = [
	{
		inputs: [
			{ internalType: 'address', name: '_token', type: 'address' },
			{ internalType: 'address', name: '_governance', type: 'address' },
			{ internalType: 'address', name: '_controller', type: 'address' },
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'owner', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'spender', type: 'address' },
			{ indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'from', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'to', type: 'address' },
			{ indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'address', name: 'spender', type: 'address' },
		],
		name: 'allowance',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'amount', type: 'uint256' },
		],
		name: 'approve',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'available',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'balance',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'controller',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{ inputs: [], name: 'decimals', outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }], stateMutability: 'view', type: 'function' },
	{
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
		],
		name: 'decreaseAllowance',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
		name: 'deposit',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{ inputs: [], name: 'depositAll', outputs: [], stateMutability: 'nonpayable', type: 'function' },
	{ inputs: [], name: 'earn', outputs: [], stateMutability: 'nonpayable', type: 'function' },
	{
		inputs: [],
		name: 'getRatio',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'governance',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'reserve', type: 'address' },
			{ internalType: 'uint256', name: 'amount', type: 'uint256' },
		],
		name: 'harvest',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'addedValue', type: 'uint256' },
		],
		name: 'increaseAllowance',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{ inputs: [], name: 'max', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
	{ inputs: [], name: 'min', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
	{ inputs: [], name: 'name', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
	{
		inputs: [{ internalType: 'address', name: '_controller', type: 'address' }],
		name: 'setController',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '_governance', type: 'address' }],
		name: 'setGovernance',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: '_min', type: 'uint256' }],
		name: 'setMin',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{ inputs: [], name: 'symbol', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
	{
		inputs: [],
		name: 'token',
		outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'recipient', type: 'address' },
			{ internalType: 'uint256', name: 'amount', type: 'uint256' },
		],
		name: 'transfer',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'sender', type: 'address' },
			{ internalType: 'address', name: 'recipient', type: 'address' },
			{ internalType: 'uint256', name: 'amount', type: 'uint256' },
		],
		name: 'transferFrom',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: '_shares', type: 'uint256' }],
		name: 'withdraw',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{ inputs: [], name: 'withdrawAll', outputs: [], stateMutability: 'nonpayable', type: 'function' },
];

export const POLYGON_TOKENS = [
	{ id: 'wmatic', symbol: 'WMATIC', contract: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270' },
	{ id: 'matic', symbol: 'MATIC', contract: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270' },
	{ id: 'tether', symbol: 'USDT', contract: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' },
	{ id: 'bitcoin', symbol: 'WBTC', contract: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6' },
	{ id: 'ethereum', symbol: 'WETH', contract: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619' },
	{ id: 'usd-coin', symbol: 'USDC', contract: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' },
	{ id: 'dai', symbol: 'DAI', contract: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063' },
	//{ "id": "quick","symbol": "QUICK", "contract": "0x831753DD7087CaC61aB5644b308642cc1c33Dc13" },
	//{ "id": "stake-dao", "symbol": "SDT", "contract": "0x361A5a4993493cE00f61C32d4EcCA5512b82CE90" },
	//{ "id": "yield-app", "symbol": "YLD", "contract": "0x4CEBdBCB286101A17D3eA1f7fe7bbDeD2B2053dd" },
	{ id: 'aave', symbol: 'AAVE', contract: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B' },
	//{ "id": "polywhale", "symbol": "KRILL", "contract": "0x05089C9EBFFa4F0AcA269e32056b1b36B37ED71b" },
	{ id: 'chainlink', symbol: 'LINK', contract: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39' },
	{ id: 'sushi', symbol: 'SUSHI', contract: '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a' },
	//{ "id": "dfyn-network", "symbol": "DFYN", "contract": "0xC168E40227E4ebD8C1caE80F7a55a4F0e6D66C97" },
	//{ "id": "polydoge", "symbol": "POLYDOGE", "contract": "0x8a953cfe442c5e8855cc6c61b1293fa648bae472" },
	//{ "id": "drax", "symbol": "DRAX", "contract": "0x1Ba3510A9ceEb72E5CdBa8bcdDe9647E1f20fB4b" },
	//{ "id": "dark-magic", "symbol": "DMAGIC", "contract": "0x61daecab65ee2a1d5b6032df030f3faa3d116aa7" },
	//{ "id": "xdollar", "symbol": "XDO", "contract": "0x3dc7b06dd0b1f08ef9acbbd2564f8605b4868eea" },
	//{ "id": "iron-titanium-token", "symbol": "TITAN", "contract": "0xaaa5b9e6c589642f98a1cda99b9d024b8407285a" },
	//{ "id": "bzx-protocol", "symbol": "BZRX", "contract": "0x97dfbEF4eD5a7f63781472Dbc69Ab8e5d7357cB9" },
	{ id: 'havven', symbol: 'SNX', contract: '0x50B728D8D964fd00C2d0AAD81718b71311feF68a' },
	{ id: 'curve-dao-token', symbol: 'CRV', contract: '0x172370d5Cd63279eFa6d502DAB29171933a610AF' },
	{ id: 'the-graph', symbol: 'GRT', contract: '0x5fe2B58c013d7601147DcdD68C143A77499f5531' },
	{ id: 'pickle-finance', symbol: 'PICKLE', contract: '0x2b88aD57897A8b496595925F43048301C37615Da' },
	{ id: 'must', symbol: 'MUST', contract: '0x9C78EE466D6Cb57A4d01Fd887D2b5dFb2D46288f' },
	{ id: 'polycat-finance', symbol: 'FISH', contract: '0x3a3df212b7aa91aa0402b9035b098891d276572b' },
];
