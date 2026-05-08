import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavBar } from './sidenav.component';
import { Header } from './header.component';
@Component({
	template: `<div class="relative min-h-screen bg-[#F8F9FF]">
		<sidebar></sidebar>
		<header></header>
		<main class="pl-28 py-24 pr-8"><router-outlet /></main>
	</div>`,
	imports: [RouterOutlet, Header, SideNavBar],
})
export class RootLayout {}
