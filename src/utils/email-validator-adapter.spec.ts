import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidator Adapter', () => {
  it('Should return false if EmailValitador returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_mail@mail.com')
    expect(isValid).toBe(false)
  })
})
