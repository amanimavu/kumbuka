import { Component, input } from '@angular/core';
import { KumbukaLogo } from '../../../assets/icons';

export enum Variant {
	LogoOnly = 'logo-only',
	BrandNameOnly = 'brand-name-only',
	Brand = 'brand',
}

@Component({
	selector: 'kumbuka-brand',
	standalone: true,
	template: `
		<div class="flex gap-2 items-center">
			@switch (variant()) {
				@case (Variant.Brand) {
					<svg class="w-8" kumbuka-logo></svg>
					<p>KUMBUKA</p>
				}
				@case (Variant.BrandNameOnly) {
					<p>KUMBUKA</p>
				}
				@case (Variant.LogoOnly) {
					<svg class="w-10" kumbuka-logo></svg>
				}
			}
		</div>
	`,
	imports: [KumbukaLogo],
})
export class KumbukaBrand {
	protected Variant = Variant;
	variant = input<`${Variant}`>(Variant.Brand);
}
