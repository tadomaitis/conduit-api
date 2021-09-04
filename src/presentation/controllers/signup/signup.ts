import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { HttpResponse, HttpRequest, Controller, EmailValidator } from '@/presentation/protocols'
import { badRequest, serverError } from '@/presentation/helpers/http-helper'
import { AddUser } from '@/domain/usecases/add-user'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addUser: AddUser

  constructor (emailValidator: EmailValidator, addUser: AddUser) {
    this.emailValidator = emailValidator
    this.addUser = addUser
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['username', 'email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password, username } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      this.addUser.add({ email, password, username })
    } catch (error) {
      return serverError()
    }
  }
}
