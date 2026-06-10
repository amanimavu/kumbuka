import { Component, input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

type Status = 'critical' | 'regular';

@Component({
	selector: 'lender-card',
	standalone: true,
	template: `
		<p-card>
			<div class="flex justify-between mb-4">
				<div class="gap-4 flex items-center">
					<p-avatar shape="circle" label="AP" size="large" />
					<div class="flex flex-col">
						<span>Name</span>
						<span class="text-neutral-400">QRTYU45678P</span>
					</div>
				</div>
				<div class="flex flex-col items-end">
					<span>1200</span>
					<span class="{{ color }}">Due in 2 days</span>
				</div>
			</div>
			<p-button class="block *:w-full" variant="outlined">Log Repayment</p-button>
		</p-card>
	`,
	imports: [CardModule, AvatarModule, ButtonModule],
})
export class LenderCard {
	color = 'text-red-300';
	status = input<Status>();
}
