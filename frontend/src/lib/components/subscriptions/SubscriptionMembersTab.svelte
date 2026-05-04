<script lang="ts">
	import type { Subscription } from '$lib/types';
	import { api } from '$lib/api/client';

	interface Props {
		subscription: Subscription;
		onUpdated: () => void;
	}
	let { subscription, onUpdated }: Props = $props();

	let refreshing = $state(false);
	let lastRefreshError = $state('');

	async function refresh(): Promise<void> {
		refreshing = true;
		lastRefreshError = '';
		try {
			await api.refreshSubscription(subscription.id);
			onUpdated();
		} catch (e) {
			lastRefreshError = e instanceof Error ? e.message : 'Не удалось обновить';
		} finally {
			refreshing = false;
		}
	}

	async function pickActive(memberTag: string): Promise<void> {
		try {
			await api.setSubscriptionActiveMember(subscription.id, memberTag);
			onUpdated();
		} catch (e) {
			lastRefreshError = e instanceof Error ? e.message : 'Не удалось переключить';
		}
	}
</script>

<div class="actions">
	<button class="btn primary" disabled={refreshing} onclick={refresh}>
		{refreshing ? 'Обновляем...' : 'Обновить сейчас'}
	</button>
</div>
{#if lastRefreshError}
	<div class="err">{lastRefreshError}</div>
{/if}

<table class="t">
	<thead>
		<tr><th></th><th>Tag</th></tr>
	</thead>
	<tbody>
		{#each subscription.memberTags as tag (tag)}
			<tr>
				<td><input type="radio" name="active" onchange={() => pickActive(tag)} /></td>
				<td class="mono">{tag}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.actions { margin-bottom: 1rem; }
	.btn {
		padding: 0.4rem 1rem;
		border-radius: 6px;
		font: inherit;
		font-size: 0.85rem;
		cursor: pointer;
		border: 1px solid transparent;
	}
	.btn:disabled { opacity: 0.5; }
	.primary { color: white; background: #238636; border-color: #2ea043; }
	.err { color: #f85149; font-size: 0.85rem; margin-bottom: 0.6rem; }
	.t { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
	.t th,
	.t td {
		text-align: left;
		padding: 0.4rem 0.6rem;
		border-bottom: 1px solid var(--color-border);
	}
	.mono { font-family: var(--font-mono, ui-monospace, monospace); color: var(--color-text-primary); }
</style>
