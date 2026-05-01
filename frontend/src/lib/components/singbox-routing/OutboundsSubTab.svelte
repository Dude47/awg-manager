<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api/client';
	import { singboxRouter } from '$lib/stores/singboxRouter';
	import { singboxTunnels } from '$lib/stores/singbox';
	import { StatRow } from '$lib/components/ui';
	import type { StatTile } from '$lib/components/ui';
	import type { AWGTagInfo, SingboxTunnel } from '$lib/types';
	import {
		buildOutboundOptions,
		CompositeOutboundsList,
	} from '$lib/components/routing/singboxRouter';

	const outboundsStore = singboxRouter.outbounds;
	const phase1Store = singboxTunnels;

	const outbounds = $derived($outboundsStore);
	const phase1Tunnels = $derived(($phase1Store.data ?? []) as SingboxTunnel[]);

	let awgTags = $state<AWGTagInfo[]>([]);

	async function loadAWGTags(): Promise<void> {
		try {
			awgTags = await api.getAWGTags();
		} catch {
			awgTags = [];
		}
	}

	async function refresh(): Promise<void> {
		await singboxRouter.loadAll();
	}

	onMount(() => {
		loadAWGTags();
	});

	const outboundOptions = $derived(
		buildOutboundOptions(awgTags, phase1Tunnels, outbounds, true),
	);

	const awgManagedCount = $derived(
		awgTags.filter((t) => t.kind === 'managed').length,
	);

	// Total addressable outbounds available as routing targets:
	// composite + AWG managed + AWG system + sing-box phase1 tunnels.
	// Mirrors what `buildOutboundOptions` exposes (minus the synthetic "direct").
	const totalCount = $derived(
		outbounds.length + awgTags.length + phase1Tunnels.length,
	);

	const statTiles = $derived<StatTile[]>([
		{ label: 'Всего', value: totalCount },
		{ label: 'Composite', value: outbounds.length },
		{ label: 'AWG', value: awgManagedCount },
	]);
</script>

<div class="stat-row-wrap">
	<StatRow tiles={statTiles} columns={3} />
</div>

<CompositeOutboundsList
	{outbounds}
	{outboundOptions}
	onChange={refresh}
/>

<style>
	.stat-row-wrap {
		margin-bottom: 1rem;
	}
</style>
