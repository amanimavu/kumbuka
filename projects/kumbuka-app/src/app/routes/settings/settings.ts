import { Component, inject, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { Card } from 'primeng/card';
import { Avatar } from 'primeng/avatar';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { VerifiedIcon, MergeIcon } from 'kumbuka-icons';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-settings',
	imports: [
		MenuModule,
		DividerModule,
		Card,
		Avatar,
		ButtonModule,
		InputText,
		VerifiedIcon,
		RadioButtonModule,
		FormsModule,
		MergeIcon,
	],
	templateUrl: './settings.html',
	styleUrl: './settings.css',
})
export class SettingsPage implements OnInit {
	items: MenuItem[] = [];
	selectedOption!: string;

	private route = inject(ActivatedRoute);

	// due to use of custom scroll container
	ngOnInit() {
		this.route.fragment.subscribe((fragment) => {
			if (fragment) {
				setTimeout(() => {
					const element = document.getElementById(fragment);
					if (element) {
						element.scrollIntoView({ behavior: 'smooth', block: 'start' });
					}
				}, 0);
			}
		});

		this.items = [
			{
				label: 'Account',
				routerLink: '/app/settings',
				fragment: 'account',
				routerLinkActiveOptions: {
					paths: 'exact',
					fragment: 'exact',
				},
			},
			{
				label: 'Lending Limits',
				routerLink: '/app/settings',
				fragment: 'lending-limits',
				routerLinkActiveOptions: {
					paths: 'exact',
					fragment: 'exact',
				},
			},
			{
				label: 'Notifications',
				routerLink: '/app/settings',
				fragment: 'notification-controls',
				routerLinkActiveOptions: {
					paths: 'exact',
					fragment: 'exact',
				},
			},
			{
				label: 'Security',
				routerLink: '/app/settings',
				fragment: 'security',
				routerLinkActiveOptions: {
					paths: 'exact',
					fragment: 'exact',
				},
			},
			{
				label: 'Danger Zone',
				routerLink: '/app/settings',
				fragment: 'danger-zone',
				routerLinkActiveOptions: {
					paths: 'exact',
					fragment: 'exact',
				},
			},
			{ separator: true, styleClass: 'mt-2' },
			{ label: 'Help and Support' },
		];
	}
}
