import { BehaviorSubject, Observable, Subject, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

function counter(duration: number) {
	return new Observable<number>((subscriber) => {
		subscriber.next(duration); // Emit initial value immediately

		if (duration <= 0) {
			subscriber.complete();
			return;
		}

		let intervalId = setInterval(() => {
			duration -= 1;
			subscriber.next(duration);
			if (duration <= 0) {
				clearInterval(intervalId);
				subscriber.complete();
			}
		}, 1000);

		return function unsubscribe() {
			clearInterval(intervalId);
		};
	});
}

export function useCountdown(initialDuration: number, autoStart = true) {
	const start$ = autoStart ? new BehaviorSubject<number>(initialDuration) : new Subject<number>();
	const count = toSignal(start$.pipe(switchMap((duration) => counter(duration))), {
		initialValue: initialDuration,
	});

	return {
		count,
		start: (duration: number = initialDuration) => start$.next(duration),
	};
}
