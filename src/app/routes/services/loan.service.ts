import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LocalstorageService } from '@app/shared/services/localstorage.service';
import { environment } from '@env/environment';

export type LenderRequestPayload = {
	lenderPhone: string;
	amount: number;
	dueDate: string;
};

export type LenderRequestResponse = {
	id: number;
	lender: {
		id: number;
		name: string;
		email: string;
		phoneNumber: string;
	};
	borrower: {
		id: number;
		name: string;
		email: string;
		phoneNumber: string;
	};
	amount: number;
	balance: number;
	dueDate: string;
	status: 'PENDING';
};

@Injectable({
	providedIn: 'root',
})
export class LoanService {
	private readonly baseUrl = `${environment.backendBaseUrl}/api/loans`;

	http = inject(HttpClient);
	localstorage = inject(LocalstorageService);

	request(payload: LenderRequestPayload) {
		return this.http.post<LenderRequestResponse>(`${this.baseUrl}/request`, payload);
	}
}
