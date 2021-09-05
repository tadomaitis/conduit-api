import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  it('Should return false if EmailValitador returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_mail@mail.com')
    expect(isValid).toBe(false)
  })

  it('Should return true if EmailValitador returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_mail@mail.com')
    expect(isValid).toBe(true)
  })
})
