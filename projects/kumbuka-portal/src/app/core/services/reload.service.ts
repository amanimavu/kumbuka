import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Broadcasts a reload signal from the shared admin header to whichever page
 * is currently mounted in the router outlet. Only the active page subscribes,
 * so only it re-fetches.
 */
@Injectable({ providedIn: 'root' })
export class ReloadService {
	private readonly _reload = new Subject<void>();
	readonly reload$ = this._reload.asObservable();

	trigger() {
		this._reload.next();
	}
}
