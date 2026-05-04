<script lang="ts">
	interface Props {
		tag: string;
		active: boolean;
		switching: boolean;
		disabled: boolean;
		onclick: () => void;
	}
	let { tag, active, switching, disabled, onclick }: Props = $props();

	// Try to derive a friendly short name from the tag.
	// Tags look like "sub-<subID-short>-<hash8>".
	const shortHash = $derived.by(() => {
		const parts = tag.split('-');
		return parts.length > 0 ? parts[parts.length - 1] : tag;
	});
</script>

<button
	type="button"
	class="card"
	class:active
	class:switching
	{disabled}
	onclick={onclick}
	aria-pressed={active}
>
	<div class="header">
		<span class="led" class:on={active} aria-hidden="true"></span>
		<span class="title mono" title={tag}>{tag}</span>
	</div>
	<div class="meta">
		<span class="hash mono">#{shortHash}</span>
		{#if active}
			<span class="badge active-badge">активен</span>
		{:else if switching}
			<span class="badge switching-badge">переключаем...</span>
		{/if}
	</div>
</button>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		padding: 14px 16px;
		border: 1px solid var(--border, var(--color-border));
		border-radius: 10px;
		background: var(--bg-card, var(--color-bg-secondary));
		color: var(--text, var(--color-text-primary));
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition: border-color 0.15s ease, background 0.15s ease;
	}
	.card:hover:not(.active):not(:disabled) {
		border-color: var(--color-accent);
	}
	.card.active {
		border-color: #3fb950;
		background: rgba(63, 185, 80, 0.06);
	}
	.card.switching { opacity: 0.7; cursor: wait; }
	.card:disabled { cursor: wait; opacity: 0.6; }
	.header {
		display: flex;
		align-items: center;
		gap: 0.55rem;
	}
	.led {
		width: 10px; height: 10px;
		border-radius: 999px;
		background: var(--color-bg-tertiary, #21262d);
		flex-shrink: 0;
	}
	.led.on {
		background: #3fb950;
		box-shadow: 0 0 0 3px rgba(63, 185, 80, 0.22);
	}
	.title {
		font-size: 0.85rem;
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
	}
	.meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.hash { font-size: 0.72rem; color: var(--color-text-muted); }
	.badge {
		font-size: 0.7rem;
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
	}
	.active-badge {
		background: rgba(63, 185, 80, 0.15);
		color: #3fb950;
	}
	.switching-badge {
		background: rgba(88, 166, 255, 0.15);
		color: var(--color-accent);
	}
	.mono { font-family: var(--font-mono, ui-monospace, monospace); }
</style>
