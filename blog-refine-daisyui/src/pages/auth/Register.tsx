import { FunctionComponent } from "react";
import AuthSection from "../../components/auth/authSection";
import { RegisterForm } from "../../components/auth/registerForm";

interface RegisterProps {
  
}

export const Register: FunctionComponent<RegisterProps> = () => {
  return (
    <AuthSection children={<RegisterForm />} />
  );

}

export default Register;
 
