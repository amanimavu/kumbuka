import { Component, input, forwardRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { AlarmIcon, CompassionIcon, OrderIcon, ShieldPersonIcon } from '../../../assets/icons';
import { KumbukaBrand } from '../../shared/brand/logo.component';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-root',
	imports: [
		ButtonModule,
		ImageModule,
		forwardRef(() => ProblemCard),
		AlarmIcon,
		CompassionIcon,
		OrderIcon,
		ShieldPersonIcon,
		AccordionModule,
		KumbukaBrand,
	],
	templateUrl: 'landing.html',
	styleUrl: 'landing.css',
})
export class LandingPage {
	date = new Date().getFullYear();
	tabs = [
		{
			question: 'Is Kumbuka a bank or a lending platform?',
			answer: 'No. Kumbuka does not provide funds and does not handle the money itself. It is a structured ledger and communication tool designed to help individuals manage their personal lending activities with order and transparency.',
		},
		{
			question: 'Can I lend more than my set limit for emergencies?',
			answer: 'Yes. The app provides a "Special Case Override." If a family member has a medical emergency, you can choose to exceed your limit, but the app will ask you to log the reason so you remain aware of why your financial plan was adjusted.',
		},
		{
			question: 'How do I know the M-PESA code the borrower logged is real?',
			answer: 'Payments sit in a "Pending Verification" queue. The debt is not cleared until you match the code against your own M-PESA messages and tap "Confirm." You always have the final say.',
		},
		{
			question: 'Why do I have to "Confirm" the loan at the start?',
			answer: 'The Digital Handshake ensures that both you and the lender are on the same page regarding the amount and the return date. This protects you from future misunderstandings and ensures the record is accurate from day one.',
		},
		{
			question: 'Will my family see my full lending history?',
			answer: 'No. Your dashboard only shows the shared records between you and that specific lender. Your privacy is maintained across different relationships.',
		},
	];
	baseUrl = environment.baseUrl;
}

@Component({
	selector: 'problem-card',
	standalone: true,
	template: `
		<div class="mb-4 p-8">
			<p-card>
				<div class="inline-flex bg-[#EFF4FF] p-4 rounded-md"><ng-content /></div>
				<h5 class="text-2xl font-semibold py-5">{{ title() }}</h5>
				<p class="tracking-wide">
					{{ description() }}
				</p>
			</p-card>
		</div>
	`,
	imports: [CardModule, ImageModule],
})
export class ProblemCard {
	title = input<string>('');
	description = input<string>('');
}
