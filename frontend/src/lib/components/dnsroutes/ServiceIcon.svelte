<script lang="ts">
	import { getServiceIcon } from '$lib/utils/service-icons';
	import { resolveIconSlug, isPresetIconResolvable } from '$lib/utils/resolve-icon-slug';
	import PresetIcon from '$lib/components/routing/singboxRouter/PresetIcon.svelte';

	interface Props {
		name: string;
		size?: number;
		iconUrl?: string;
		/** sing-box preset slug; overrides name-based resolution */
		iconSlug?: string;
	}

	let { name, size = 36, iconUrl, iconSlug }: Props = $props();

	let imgFailed = $state(false);

	$effect(() => {
		void iconUrl;
		imgFailed = false;
	});

	// Fallback chain:
	//   1. explicit iconUrl (user-picked Qure / custom URL) → <img>
	//   2. PresetIcon via iconSlug (same as SingBox router / HydraRoute presets)
	//   3. keyword inline SVG (service-icons.ts)
	//   4. globe default
	let slug = $derived(resolveIconSlug(name, iconSlug));
	let usePreset = $derived(!iconUrl && !!slug && isPresetIconResolvable(slug));

	let renderUrl = $derived(iconUrl && !imgFailed ? iconUrl : null);

	let inlineIcon = $derived(getServiceIcon(name));
	let innerSize = $derived.by(() => {
		if (inlineIcon.assetSrc && inlineIcon.assetFit === 'cover') return size;
		return Math.round(size * (inlineIcon.scale ?? 0.56));
	});
</script>

{#if renderUrl}
	<div
		class="service-icon img-wrapper"
		style="width: {size}px; height: {size}px;"
	>
		<img
			src={renderUrl}
			alt={name}
			width={size}
			height={size}
			loading="lazy"
			onerror={() => (imgFailed = true)}
		/>
	</div>
{:else if usePreset && slug}
	<PresetIcon {slug} {size} />
{:else}
	<div
		class="service-icon"
		style="width: {size}px; height: {size}px; background: {inlineIcon.background};"
	>
		{#if inlineIcon.assetSrc}
			<img
				class="asset"
				class:cover={inlineIcon.assetFit === 'cover'}
				src={inlineIcon.assetSrc}
				alt={name}
				width={innerSize}
				height={innerSize}
				style:filter={inlineIcon.assetFilter ?? 'none'}
				loading="lazy"
			/>
		{:else}
			<svg
				viewBox={inlineIcon.viewBox ?? '0 0 24 24'}
				width={innerSize}
				height={innerSize}
			>
				{@html inlineIcon.svg ?? ''}
			</svg>
		{/if}
	</div>
{/if}

<style>
	.service-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		flex-shrink: 0;
	}
	.img-wrapper {
		background: transparent;
		overflow: hidden;
	}
	.img-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.service-icon .asset {
		object-fit: contain;
	}
	.service-icon .asset.cover {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
