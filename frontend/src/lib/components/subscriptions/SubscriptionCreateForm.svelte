<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$lib/api/client';
	import HeadersTextarea from './HeadersTextarea.svelte';
	import { parseHeadersText } from './headersParser';

	let label = $state('');
	let url = $state('');
	let headersText = $state('');
	let refreshHours = $state(24);
	let enabled = $state(true);
	let submitting = $state(false);
	let error = $state('');

	async function submit(): Promise<void> {
		error = '';
		submitting = true;
		try {
			const sub = await api.createSubscription({
				label,
				url,
				headers: parseHeadersText(headersText),
				refreshHours,
				enabled,
			});
			goto(`/subscriptions/${sub.id}`);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Не удалось создать';
		} finally {
			submitting = false;
		}
	}
</script>

<form
	class="form"
	onsubmit={(e) => {
		e.preventDefault();
		submit();
	}}
>
	<label class="row">
		<span class="lbl">Название</span>
		<input class="inp" type="text" bind:value={label} placeholder="Provider X" required />
	</label>
	<label class="row">
		<span class="lbl">URL подписки</span>
		<input
			class="inp"
			type="url"
			bind:value={url}
			placeholder="https://provider.example/sub/abc"
			required
		/>
	</label>
	<div class="row">
		<HeadersTextarea bind:value={headersText} />
	</div>
	<label class="row">
		<span class="lbl">Авто-обновление</span>
		<select class="inp" bind:value={refreshHours}>
			<option value={0}>Только вручную</option>
			<option value={1}>Каждый час</option>
			<option value={6}>Каждые 6 часов</option>
			<option value={12}>Каждые 12 часов</option>
			<option value={24}>Раз в сутки</option>
			<option value={168}>Раз в неделю</option>
		</select>
	</label>
	<label class="row chk">
		<input type="checkbox" bind:checked={enabled} />
		<span>Включить сразу</span>
	</label>
	{#if error}<div class="err">{error}</div>{/if}
	<div class="actions">
		<button type="button" class="btn ghost" onclick={() => goto('/subscriptions')}>Отмена</button>
		<button type="submit" class="btn primary" disabled={submitting}>
			{submitting ? 'Создаём...' : 'Создать'}
		</button>
	</div>
</form>

<style>
	.form { display: flex; flex-direction: column; gap: 1rem; max-width: 640px; }
	.row { display: flex; flex-direction: column; gap: 0.3rem; }
	.row.chk { flex-direction: row; align-items: center; gap: 0.5rem; }
	.lbl { font-size: 0.85rem; color: var(--color-text-muted); }
	.inp {
		padding: 0.5rem 0.7rem;
		background: var(--color-bg-primary);
		border: 1px solid var(--color-border);
		border-radius: 4px;
		color: var(--color-text-primary);
	}
	.err { color: #f85149; font-size: 0.85rem; }
	.actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
	.btn {
		padding: 0.4rem 1rem;
		border-radius: 6px;
		font: inherit;
		cursor: pointer;
		border: 1px solid transparent;
		font-size: 0.85rem;
	}
	.btn:disabled { opacity: 0.5; cursor: wait; }
	.ghost { color: var(--color-text-muted); background: transparent; }
	.primary { color: white; background: #238636; border-color: #2ea043; }
</style>
