<script lang="ts">
	import { goto } from '$app/navigation';
	import { PageContainer, PageHeader } from '$lib/components/layout';
	import { Button } from '$lib/components/ui';
	import { subscriptionsStore } from '$lib/stores/subscriptions';
	import SubscriptionList from '$lib/components/subscriptions/SubscriptionList.svelte';

	const subs = $derived($subscriptionsStore.data ?? []);
</script>

<svelte:head>
	<title>Подписки - AWG Manager</title>
</svelte:head>

<PageContainer>
	<PageHeader title="Подписки">
		{#snippet actions()}
			<Button variant="primary" size="sm" onclick={() => goto('/subscriptions/new')}>
				+ Добавить
			</Button>
		{/snippet}
	</PageHeader>
	<SubscriptionList subscriptions={subs} />
</PageContainer>
