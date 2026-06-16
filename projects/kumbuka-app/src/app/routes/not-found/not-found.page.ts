import { afterNextRender, Component, effect, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { HelpIcon } from 'kumbuka-icons';
import { LocalstorageService } from '@app/shared/services/localstorage.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
	selector: 'app-not-found',
	imports: [ButtonModule, CardModule, DividerModule, ImageModule, HelpIcon],
	templateUrl: './not-found.html',
	styleUrl: './not-found.css',
})
export class NotFoundPage {
	isAuthenticated = true;
	router = inject(Router);
	location = inject(Location);
	localStorage = inject(LocalstorageService);
	constructor() {
		afterNextRender(() => {
			const token = this.localStorage.get('token');
			if (!token) {
				this.isAuthenticated = false;
			}
		});
	}

	handleRedirect() {
		if (this.isAuthenticated) {
			this.location.back();
		} else {
			this.router.navigateByUrl('/auth/login');
		}
	}
}
