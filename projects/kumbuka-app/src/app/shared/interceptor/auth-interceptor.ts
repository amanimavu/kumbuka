import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalstorageService } from '../services/localstorage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const localstorage = inject(LocalstorageService);
	// Retrieve token from your preferred secure storage
	const token = localstorage.get('token');

	// Clone request and inject authorization header if token exists
	if (token) {
		const clonedReq = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});
		return next(clonedReq);
	}

	// Pass original request through if there is no token
	return next(req);
};
