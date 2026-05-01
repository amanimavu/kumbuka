import { Component, input } from '@angular/core';
import { KumbukaLogo } from '../../../assets/icons';

enum Variant {
	logoOnly = 'logo-only',
	brandNameOnly = 'brand-name-only',
	brand = 'brand',
}

@Component({
	selector: 'kumbuka-brand',
	standalone: true,
	template: `
		<div class="flex gap-2 items-center">
			@switch (variant()) {
				@case (Variant.brand) {
					<svg class="w-8" kumbuka-logo></svg>
					<p>KUMBUKA</p>
				}
				@case (Variant.brandNameOnly) {
					<p>KUMBUKA</p>
				}
				@case (Variant.logoOnly) {
					<svg class="w-7" kumbuka-logo></svg>
				}
			}
		</div>
	`,
	imports: [KumbukaLogo],
})
export class KumbukaBrand {
	protected Variant = Variant;
	variant = input<Variant>(Variant.brand);
}
