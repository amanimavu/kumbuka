import { Component, computed, input } from '@angular/core';
import { Card } from 'primeng/card';
import { UpperCasePipe, NgClass } from '@angular/common';

@Component({
	selector: 'summary-card',
	styles: `
		:host {
			position: relative;
		}
	`,
	template: `
		<div
			class="h-full w-full absolute overflow-clip rounded-xl"
			style="border-radius: var(--p-card-border-radius, 0.75rem);"
		>
			<div
				class="h-[95%] absolute rounded-full -right-5 -top-5 aspect-square transition-colors"
				[ngClass]="outerBgClass()"
			>
				<div
					class="relative h-[50%] aspect-square rounded-full top-[60%] flex justify-center items-center transition-colors"
					[ngClass]="innerBgClass()"
				>
					<ng-content />
				</div>
			</div>
		</div>
		<p-card>
			<div class="flex flex-col gap-2">
				<h3 style="word-spacing: 0.2rem;" class="text-neutral-400 tracking-wide font-bold">
					{{ title() | uppercase }}
				</h3>
				<p class="text-xl font-semibold">{{ count() }}</p>
			</div>
		</p-card>
	`,
	standalone: true,
	imports: [Card, UpperCasePipe, NgClass],
})
export class SummaryCard {
	color = input();
	variant = input<'lentCount' | 'borrowedCount' | 'overdueCount'>();
	title = input('Title');
	count = input(0);

	outerBgClass = computed(() => {
		switch (this.variant()) {
			case 'borrowedCount':
				return 'bg-amber-50';
			case 'overdueCount':
				return 'bg-red-50';
			case 'lentCount':
			default:
				return 'bg-[#F1F5F9]';
		}
	});

	innerBgClass = computed(() => {
		switch (this.variant()) {
			case 'borrowedCount':
				return 'bg-amber-500/10 text-amber-500';
			case 'overdueCount':
				return 'bg-red-500/10 text-red-500';
			case 'lentCount':
			default:
				return 'bg-kumbuka-primary-500/5 text-kumbuka-primary-500';
		}
	});
}
