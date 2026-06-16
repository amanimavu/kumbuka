import { Component, input, forwardRef } from '@angular/core';
import { Card } from 'primeng/card';
import { Avatar } from 'primeng/avatar';
import { ButtonDirective } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { ShieldIcon, NetworkIcon, ArrowRightIcon, IDIcon } from 'kumbuka-icons';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-profile',
	imports: [
		Card,
		Avatar,
		ButtonDirective,
		Divider,
		forwardRef(() => MetricCard),
		ShieldIcon,
		NetworkIcon,
		ArrowRightIcon,
		RouterLink,
		IDIcon,
	],
	templateUrl: './profile.html',
	styleUrl: './profile.css',
})
export class ProfilePage {}

@Component({
	selector: 'metric-card',
	styles: `
		:host {
			display: flex;
			flex-direction: column;
			align-items: center;
			flex-basis: 30%;
		}
	`,
	standalone: true,
	template: `
		<h5 class="text-neutral-400">{{ title() }}</h5>
		<span class="font-bold text-5xl text-white my-4">{{ figures() }}</span>
		<span class="text-neutral-400">{{ description() }}</span>
	`,
})
export class MetricCard {
	title = input();
	figures = input();
	description = input();
}
