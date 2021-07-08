<script lang="ts">
	import { onMount } from 'svelte';
	import { _init } from '../libs/helpers/utils';
	import Spacer from './Spacer.svelte';
	import { main } from '../libs/harvester';
	import ThemeSwitch from './ThemeSwitch.svelte';

	onMount(async () => {
		await _init(main);
	});

	function switchToPolygonNetwork() {
		if (window.ethereum) {
			window.ethereum.request({
				method: 'wallet_addEthereumChain',
				params: [
					{
						chainId: '0x89',
						chainName: 'Matic/Polygon',
						nativeCurrency: {
							name: 'Matic Token',
							symbol: 'MATIC',
							decimals: 18,
						},
						rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
						blockExplorerUrls: ['https://explorer.matic.network/'],
					},
				],
			});
		}
	}
</script>

<header>
	<a href="#" on:click={switchToPolygonNetwork}>🌐 POLYGON</a>
	<pre>
<br>
	   👨‍🌾 OFFICIAL HARVESTER DAO SHELL 👨‍🌾
	   	      (<a href="https://harvester.app">harvester.app</a>)
<br>
◉ If you are being rate limited:
   - try another public RPC endpoint: <a href="https://docs.matic.network/docs/develop/network-details/network/" target="_blank">docs.matic.network</a>
   - sign up for a dedicated RPC endpoint: <a href="https://docs.harvester.app/support/rpc-endpoints" target="_blank">docs.harvester.app</a>
	</pre>
</header>
<Spacer />
<ThemeSwitch />
<main>
	<div id="log" />
	<div class="loader" />
</main>
<Spacer />
<hr />
<footer>
	<pre>
		<a href="https://polygonscan.com/address/0xb49036fb35b4e1572509f301e1b0fd0113771ffa" target="_blank">Etherscan</a> | <a href="https://docs.harvester.app/" target="_blank">GitBook</a> | <a href="https://twitter.com/HarvesterDAO" target="_blank">Twitter</a> | <a href="https://github.com/harvester-dao" target="_blank">GitHub</a> | <a href="https://discord.gg/Ntz8HSecwK" target="_blank">Discord</a> | <a href="https://t.me/HarvesterDAO" target="_blank">Telegram</a> | <a href="https://medium.com/harvester-dao" target="_blank">Medium</a>
	</pre>
</footer>

<style>
	@keyframes loading {
		0%,
		100% {
			content: '[....]';
		}
		20% {
			content: '[=...]';
		}
		40% {
			content: '[.=..]';
		}
		60% {
			content: '[..=.]';
		}
		80% {
			content: '[...=]';
		}
	}

	.loader {
		content: '';
		animation: loading 300ms steps(1, end) infinite;
	}

	:global(body) {
		background-color: #f2eee2;
		color: #27221c;
		transition: background-color 0.2s;
	}

	:global(body.dark-mode) {
		background-color: #1d3040;
		color: #bfc2c7;
	}

	:global(a.dark-mode) {
		color: yellowgreen;
	}

	footer {
		padding-bottom: 24px;
	}
</style>
