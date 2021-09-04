import { SignUpController } from './signup'
import { AddUser, AddUserModel, EmailValidator, UserModel } from '@/presentation/controllers/signup/signup-protocols'
import { MissingParamError, InvalidParamError } from '@/presentation/errors'
import { badRequest, serverError, ok } from '@/presentation/helpers/http-helper'

const makeAddUser = (): AddUser => {
  class AddUserStub implements AddUser {
    add (account: AddUserModel): UserModel {
      return makeFakeUser()
    }
  }
  return new AddUserStub()
}

const makeFakeUser = (): UserModel => ({
  email: 'valid_email@mail.com',
  token: 'valid_token',
  username: 'valid_username',
  bio: 'valid_bio',
  image: null
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addUserStub: AddUser
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addUserStub = makeAddUser()
  const sut = new SignUpController(emailValidatorStub, addUserStub)
  return {
    sut,
    emailValidatorStub,
    addUserStub
  }
}

describe('SignUp Controller', () => {
  it('Should return 400 if no username is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('username')))
  })

  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_name',
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        username: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValid = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        username: 'any_name',
        email: 'valid_email@mail.com',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(isValid).toHaveBeenCalledWith('valid_email@mail.com')
  })

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        username: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  it('Should call AddUser with correct values', async () => {
    const { sut, addUserStub } = makeSut()
    const addSpy = jest.spyOn(addUserStub, 'add')
    const httpRequest = {
      body: {
        username: 'any_name',
        email: 'valid_email@mail.com',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      username: 'any_name',
      email: 'valid_email@mail.com',
      password: 'any_password'
    })
  })

  it('Should return 500 if AddUser throws', async () => {
    const { sut, addUserStub } = makeSut()
    jest.spyOn(addUserStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        username: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeUser()))
  })
})
