import {
	afterRenderEffect,
	Component,
	ElementRef,
	input,
	output,
	signal,
	effect,
	viewChild,
	viewChildren,
	contentChild,
	TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

type OnClickData = { elementWidth: string; elementOffset: string; selectedOption: string };
type OnChange<T> = (value: T) => void;

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
		<ng-content />
	</div>`,
})
export class SegmentedItem {
	value = input.required<string>();
	isActive = input<boolean>();
	internalRef = viewChild<ElementRef<HTMLDivElement>>('ref');
	onClick = output<OnClickData>();

	sendElementValues(event: MouseEvent, element: HTMLDivElement) {
		this.onClick.emit({
			elementWidth: `${element.offsetWidth}px`,
			elementOffset: `${element.offsetLeft}px`,
			selectedOption: this.value(),
		});
	}
}

@Component({
	selector: 'segmented',
	styleUrl: 'segmented.css',
	standalone: true,
	imports: [SegmentedItem, NgTemplateOutlet, SkeletonModule],
	host: {
		'[style.--highlight-width]': 'highlightWidth()',
		'[style.--highlight-x-pos]': 'highlightPosition()',
	},
	template: `
		@if (value()) {
			<div class="controls">
				@for (option of options(); track option) {
					<segmented-option
						[value]="option"
						(onClick)="handleClick($event)"
						[isActive]="value()?.toLowerCase() === option.toLowerCase()"
					>
						@if (segmentedItemTemplate(); as template) {
							<ng-container
								*ngTemplateOutlet="template; context: { $implicit: option }"
							></ng-container>
						} @else {
							{{ option }}
						}
					</segmented-option>
				}
			</div>
		} @else {
			<div class="flex">
				@for (option of options(); track option) {
					<p-skeleton width="4rem" height="2rem" />
				}
			</div>
		}
	`,
})
export class Segmented {
	highlightWidth = signal('0px');
	highlightPosition = signal('0px');
	onChange = input<OnChange<string>>();
	options = input.required<string[]>();
	value = input<string>();

	segmentedItems = viewChildren(SegmentedItem);
	segmentedItemTemplate = contentChild(TemplateRef);

	constructor() {
		afterRenderEffect(() => {
			this.segmentedItems().forEach((segmentedItem) => {
				const element = segmentedItem.internalRef()?.nativeElement;
				if (this.value()?.toLowerCase() === element?.innerText.toLowerCase()) {
					this.highlightPosition.set(`${element?.offsetLeft}px`);
					this.highlightWidth.set(`${element?.offsetWidth}px`);
				}
			});
		});

		effect(() => {
			console.log('Value of segment: ', this.value());
			const onChange = this.onChange();
			const value = this.value();
			if (onChange && value) {
				onChange(value);
			}
		});
	}

	handleClick(data: OnClickData) {
		this.highlightPosition.set(data.elementOffset);
		this.highlightWidth.set(data.elementWidth);
		const onChange = this.onChange();
		onChange && onChange(data.selectedOption);
	}
}
