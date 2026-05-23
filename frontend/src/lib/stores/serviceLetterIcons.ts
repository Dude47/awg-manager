import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const storageKey = 'awg-manager-service-letter-icons';

function readStored(): boolean {
	if (!browser) return true;
	try {
		const raw = localStorage.getItem(storageKey);
		if (raw === null) return true;
		return raw === 'true';
	} catch {
		return true;
	}
}

function writeStored(enabled: boolean): void {
	if (!browser) return;
	try {
		localStorage.setItem(storageKey, enabled ? 'true' : 'false');
	} catch {
		/* ignore quota / private mode */
	}
}

function createServiceLetterIconsStore() {
	const { subscribe, set } = writable<boolean>(readStored());

	return {
		subscribe,
		init() {
			set(readStored());
		},
		setEnabled(enabled: boolean) {
			set(enabled);
			writeStored(enabled);
		},
	};
}

/** User preference: colored monogram tiles when no custom / brand icon applies. */
export const serviceLetterIcons = createServiceLetterIconsStore();
