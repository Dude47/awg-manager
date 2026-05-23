<script lang="ts">
	import ServiceIcon from './ServiceIcon.svelte';

	interface Props {
		name: string;
		meta?: string;
		iconSlug?: string;
		iconUrl?: string;
		iconSize?: number;
		disabled?: boolean;
		title?: string;
		onclick?: () => void;
	}

	let {
		name,
		meta = '',
		iconSlug,
		iconUrl,
		iconSize = 36,
		disabled = false,
		title,
		onclick,
	}: Props = $props();
</script>

<button
	type="button"
	class="catalog-preset-row"
	{disabled}
	{title}
	onclick={() => onclick?.()}
>
	<ServiceIcon {name} {iconSlug} {iconUrl} size={iconSize} />
	<div class="catalog-preset-text">
		<div class="catalog-preset-name">{name}</div>
		{#if meta}
			<div class="catalog-preset-meta">{meta}</div>
		{/if}
	</div>
</button>

<style>
	.catalog-preset-row {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 10px 12px;
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--color-border, var(--border));
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		color: var(--color-text-primary, var(--text-primary));
		transition: background 0.15s;
	}

	.catalog-preset-row:last-child {
		border-bottom: none;
	}

	.catalog-preset-row:hover:not(:disabled) {
		background: var(--color-bg-tertiary, var(--bg-tertiary));
	}

	.catalog-preset-row:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.catalog-preset-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
		flex: 1;
	}

	.catalog-preset-name {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-text-primary, var(--text-primary));
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.catalog-preset-meta {
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-text-muted, var(--text-muted));
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
