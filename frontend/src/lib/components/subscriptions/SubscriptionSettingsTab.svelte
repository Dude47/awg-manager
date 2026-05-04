<script lang="ts">
	import type { Subscription } from '$lib/types';
	import { api } from '$lib/api/client';
	import { goto } from '$app/navigation';
	import HeadersTextarea from './HeadersTextarea.svelte';
	import { parseHeadersText, serializeHeaders } from './headersParser';

	interface Props {
		subscription: Subscription;
		onUpdated: () => void;
	}
	let { subscription, onUpdated }: Props = $props();

	let label = $state(subscription.label);
	let url = $state(subscription.url);
	let headersText = $state(serializeHeaders(subscription.headers));
	let refreshHours = $state(subscription.refreshHours);
	let enabled = $state(subscription.enabled);
	let saving = $state(false);
	let confirmDelete = $state(false);
	let deleting = $state(false);

	async function save(): Promise<void> {
		saving = true;
		try {
			await api.updateSubscription(subscription.id, {
				label,
				url,
				headers: parseHeadersText(headersText),
				refreshHours,
				enabled,
			});
			onUpdated();
		} finally {
			saving = false;
		}
	}

	async function doDelete(cascade: boolean): Promise<void> {
		deleting = true;
		try {
			await api.deleteSubscription(subscription.id, cascade);
			goto('/subscriptions');
		} finally {
			deleting = false;
		}
	}
</script>

<form
	class="form"
	onsubmit={(e) => {
		e.preventDefault();
		save();
	}}
>
	<label><span>Название</span><input bind:value={label} /></label>
	<label><span>URL</span><input bind:value={url} /></label>
	<HeadersTextarea bind:value={headersText} />
	<label
		><span>Auto refresh</span>
		<select bind:value={refreshHours}>
			<option value={0}>Manual</option>
			<option value={1}>1h</option>
			<option value={6}>6h</option>
			<option value={12}>12h</option>
			<option value={24}>24h</option>
			<option value={168}>7d</option>
		</select>
	</label>
	<label class="chk"><input type="checkbox" bind:checked={enabled} /> Включена</label>
	<div class="actions">
		<button type="submit" class="btn primary" disabled={saving}>
			{saving ? 'Сохраняем...' : 'Сохранить'}
		</button>
	</div>
</form>

<div class="danger-zone">
	{#if !confirmDelete}
		<button class="btn danger" onclick={() => (confirmDelete = true)}>Удалить подписку</button>
	{:else}
		<div>Удалить подписку. Что делать с outbound'ами?</div>
		<div class="confirm-actions">
			<button class="btn ghost" disabled={deleting} onclick={() => doDelete(false)}>
				Оставить осиротевшими
			</button>
			<button class="btn danger" disabled={deleting} onclick={() => doDelete(true)}>
				Удалить cascade
			</button>
			<button class="btn ghost" onclick={() => (confirmDelete = false)}>Отмена</button>
		</div>
	{/if}
</div>

<style>
	.form { display: flex; flex-direction: column; gap: 0.7rem; max-width: 640px; }
	.form label { display: flex; flex-direction: column; gap: 0.3rem; }
	.form label.chk { flex-direction: row; align-items: center; gap: 0.5rem; }
	input,
	select {
		padding: 0.45rem 0.6rem;
		border: 1px solid var(--color-border);
		border-radius: 4px;
		background: var(--color-bg-primary);
		color: var(--color-text-primary);
	}
	.actions { display: flex; justify-content: flex-end; }
	.btn {
		padding: 0.4rem 1rem;
		border-radius: 6px;
		font: inherit;
		font-size: 0.85rem;
		cursor: pointer;
		border: 1px solid transparent;
	}
	.btn:disabled { opacity: 0.5; cursor: wait; }
	.ghost { color: var(--color-text-muted); background: transparent; }
	.primary { color: white; background: #238636; border-color: #2ea043; }
	.danger { color: white; background: #da3633; border-color: #f85149; }
	.danger-zone {
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
	}
	.confirm-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem; }
</style>
