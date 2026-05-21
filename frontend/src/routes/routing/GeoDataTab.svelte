<script lang="ts">
	import { api } from '$lib/api/client';
	import type { GeoFileEntry } from '$lib/types';
	import { HrNeoGeoDataView } from '$lib/components/hrneo';

	let geoFiles = $state<GeoFileEntry[]>([]);

	/** Только каталог из hrneo.conf (stat), без скачивания и без restart HR. */
	async function loadGeoFiles() {
		try {
			await api.rescanGeoFiles();
		} catch {
			// HR не установлен / нет hrneo.conf — не ломаем вкладку
		}
		try {
			geoFiles = (await api.getGeoFiles()) ?? [];
		} catch {
			geoFiles = [];
		}
	}

	$effect(() => {
		void loadGeoFiles();
	});
</script>

<HrNeoGeoDataView files={geoFiles} onrefresh={loadGeoFiles} />
