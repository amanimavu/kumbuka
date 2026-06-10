import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class LocalstorageService {
	private readonly localstorage = inject(DOCUMENT)?.defaultView?.localStorage;

	private isValidJSON(value: string) {
		try {
			JSON.parse(value);
			return true;
		} catch {
			return false;
		}
	}

	get(key: string) {
		const value = this.localstorage?.getItem(key);
		if (!value || value === 'undefined') {
			return null;
		}

		return this.isValidJSON(value) ? JSON.parse(value) : value;
	}

	set(key: string, value: unknown) {
		this.localstorage?.setItem(key, JSON.stringify(value) ?? '');
	}

	remove(key: string) {
		this.localstorage?.removeItem(key);
	}

	clear() {
		this.localstorage?.clear();
	}
}
