import { Result } from "../../core/logic/Result";

export default interface IMailerService {
sendPasswordResetEmail(email: string, resetToken: string): Promise<Result<void>>;
sendConfirmationEmail(to: string, userName: string, token: any): Promise<Result<void>>;
sendPasswordResetEmail(email: string, resetToken: string): Promise<Result<void>>;

}