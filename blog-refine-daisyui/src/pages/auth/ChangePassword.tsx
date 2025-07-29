import { FunctionComponent } from "react";
import AuthSection from "../../components/auth/authSection";
import { ChangePasswordForm } from "../../components/auth/changePasswordForm";

interface ChangePasswordProps {
  
}
 
export const ChangePassword: FunctionComponent<ChangePasswordProps> = () => {
  return (
    <AuthSection children={<ChangePasswordForm />} />
    );
}
 
export default ChangePassword;