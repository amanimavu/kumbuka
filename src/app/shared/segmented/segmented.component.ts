import {
	afterRenderEffect,
	Component,
	effect,
	ElementRef,
	input,
	output,
	signal,
	viewChild,
	viewChildren,
} from '@angular/core';

type OnClickData = { elementWidth: string; elementOffset: string; selectedOption: string };

@Component({
	selector: 'segmented-option',
	styleUrl: 'segmented.css',
	styles: `
		:host {
			display: contents;
		}
	`,
	standalone: true,
	template: `<div
		[class.active]="isActive()"
		class="segmented-item"
		#ref
		(click)="sendElementValues($event, ref)"
	>
		{{ label() }}
	</div>`,
})
export class SegmentedItem {
	label = input<string>();
	isActive = input<boolean>();
	internalRef = viewChild<ElementRef<HTMLDivElement>>('ref');
	onClick = output<OnClickData>();

	sendElementValues(event: MouseEvent, element: HTMLDivElement) {
		this.onClick.emit({
			elementWidth: `${element.offsetWidth}px`,
			elementOffset: `${element.offsetLeft}px`,
			selectedOption: `${element.innerText}`,
		});
	}
}

@Component({
	selector: 'segmented',
	styleUrl: 'segmented.css',
	standalone: true,
	imports: [SegmentedItem],
	host: {
		'[style.--highlight-width]': 'highlightWidth',
		'[style.--highlight-x-pos]': 'highlightPosition',
	},
	template: `
		<div class="controls">
			@for (option of options(); track option) {
				<segmented-option
					[label]="option"
					(onClick)="onConsumption($event)"
					[isActive]="value() === option.toLowerCase()"
				/>
			}
		</div>
	`,
})
export class Segmented {
	value = signal<string>('money owed');
	highlightWidth = '0px';
	highlightPosition = '0px';

	options = input<string[]>();

	segmentedItems = viewChildren(SegmentedItem);

	constructor() {
		afterRenderEffect(() => {
			this.segmentedItems().forEach((segmentedItem) => {
				const element = segmentedItem.internalRef()?.nativeElement;
				if (this.value() === element?.innerText.toLowerCase()) {
					Promise.resolve().then(() => {
						this.highlightPosition = `${element.offsetLeft}px`;
						this.highlightWidth = `${element.offsetWidth}px`;
					});
				}
			});
		});

		effect(() => {
			console.log(this.value());
		});
	}

	onConsumption(data: OnClickData) {
		this.highlightPosition = data.elementOffset;
		this.highlightWidth = data.elementWidth;
		this.value.set(data.selectedOption.toLowerCase());
	}
}
