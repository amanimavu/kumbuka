import { afterNextRender, Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LocalstorageService } from '@app/shared/services/localstorage.service';

@Component({
	selector: 'not-found',
	imports: [ButtonModule, CardModule, DividerModule],
	template: `
		<div class="relative h-screen overflow-hidden bg-[#F8F9FF]">
			<p-card class="w-1/3 mx-auto mt-16 px-4!">
				<div class="flex flex-col items-center gap-3 py-6">
					<h3 class="font-bold text-2xl text-center">Page not found</h3>
					<p class="text-center text-neutral-500">
						The page you are looking for doesn't exist.
					</p>
				</div>
				<div class="flex justify-center gap-6 mt-3 mb-6">
					<p-button label="Go back" (click)="handleRedirect()" />
				</div>
				<p-divider />
				<p class="uppercase text-sm text-neutral-500 text-center tracking-wide pb-2">
					Kumbuka Portal
				</p>
			</p-card>
		</div>
	`,
})
export class NotFoundPage {
	private isAuthenticated = true;
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
