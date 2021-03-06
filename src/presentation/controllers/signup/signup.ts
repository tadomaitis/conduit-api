import { HttpResponse, HttpRequest, Controller, EmailValidator, AddUser } from '@/presentation/controllers/signup/signup-protocols'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest, serverError, ok } from '@/presentation/helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addUser: AddUser

  constructor (emailValidator: EmailValidator, addUser: AddUser) {
    this.emailValidator = emailValidator
    this.addUser = addUser
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
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
      const user = await this.addUser.add({ email, password, username })
      return ok(user)
    } catch (error) {
      return serverError()
    }
  }
}
