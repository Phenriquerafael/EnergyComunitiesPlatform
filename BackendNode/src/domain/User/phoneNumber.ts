
import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface PhoneNumberProps {
  value: string;
}

export class PhoneNumber extends ValueObject<PhoneNumberProps> {
  get value (): string {
    return this.props.value;
  }

  private constructor (props: PhoneNumberProps) {
    super(props);
  }

  public static create (phoneNumber: string): Result<PhoneNumber> {
    const guardResult = Guard.againstNullOrUndefined(phoneNumber, 'phoneNumber');
    if (!guardResult.succeeded) {
      return Result.fail<PhoneNumber>(guardResult.message);
    } else {
      return Result.ok<PhoneNumber>(new PhoneNumber({ value: phoneNumber }))
    }
  }

  public isValid(): boolean {
    // Regex to validate phone number format (for a simple international phone number)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(this.value);
  }
}