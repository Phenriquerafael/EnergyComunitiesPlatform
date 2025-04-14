export interface IUserPersistence {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	password: string;
	role: string
	isEmailVerified: boolean;
  }