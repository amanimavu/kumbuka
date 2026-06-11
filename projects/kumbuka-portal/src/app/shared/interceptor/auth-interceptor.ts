import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalstorageService } from '../services/localstorage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const localstorage = inject(LocalstorageService);
	const token = localstorage.get('token');

	if (token) {
		const clonedReq = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});
		return next(clonedReq);
	}

	return next(req);
};
