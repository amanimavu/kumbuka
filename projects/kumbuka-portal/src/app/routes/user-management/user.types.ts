export type UserRole = 'user' | 'admin';

export interface AppUser {
	id: number;
	fullName: string;
	email: string;
	phoneNumber: string;
	role: UserRole;
	createdAt: string;
}

export interface CreateUserPayload {
	fullName: string;
	email: string;
	phoneNumber: string;
	password: string;
	role: UserRole;
}
