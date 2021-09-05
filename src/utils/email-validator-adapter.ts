import { EmailValidator } from '@/presentation/protocols'
import validator from 'validator'

export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    if (validator.isEmail(email)) {
      return true
    }
    return false
  }
}
