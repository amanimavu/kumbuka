export function debounce(fn: Function, delay: number = 500) {
	let timeoutId: NodeJS.Timeout | undefined = undefined;

	function debouncedFn(...args: any[]) {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			fn(...args);
			clearTimeout(timeoutId);
		}, delay);
	}

	return debouncedFn;
}
