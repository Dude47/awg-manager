<script lang="ts">
	import { PageContainer, PageHeader } from '$lib/components/layout';
	import SubscriptionCreateForm from '$lib/components/subscriptions/SubscriptionCreateForm.svelte';
</script>

<svelte:head>
	<title>Добавить подписку - AWG Manager</title>
</svelte:head>

<PageContainer>
	<PageHeader title="Добавить подписку" />
	<SubscriptionCreateForm />
</PageContainer>
