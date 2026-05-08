import { Component, input } from '@angular/core';
import { Card } from 'primeng/card';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';

@Component({
	selector: 'summary-card',
	styles: `
		:host {
			width: 50%;
			position: relative;
		}
	`,
	template: `<div class="h-full w-full absolute overflow-clip">
			<div class="h-[95%] absolute rounded-full -right-5 -top-5 aspect-square bg-[#F1F5F9]">
				<div
					class="relative h-[50%] aspect-square rounded-full top-[60%] bg-kumbuka-primary-500/5 flex justify-center items-center"
				>
					<ng-content />
				</div>
			</div>
		</div>
		<p-card>
			<div class="flex flex-col gap-2">
				<h3 style="word-spacing: 0.2rem;" class="text-neutral-400 tracking-wide">
					{{ title() | uppercase }}
				</h3>
				<p>{{ amount() | currency: 'KSH ' }}</p>
				<p>{{ description() }}</p>
			</div>
		</p-card> `,
	standalone: true,
	imports: [Card, UpperCasePipe, CurrencyPipe],
})
export class SummaryCard {
	color = input();
	variant = input<'lending-summary' | 'body-summary'>();
	title = input('Title');
	amount = input(0);
	description = input('Priority description');
}
