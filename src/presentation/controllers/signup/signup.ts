import { MissingParamError } from '@/presentation/errors/missing-param-error'
import { HttpResponse, HttpRequest } from '@/presentation/protocols/http'
import { badRequest } from '@/presentation/helpers/http-helper'
import { Controller } from '@/presentation/protocols/controller'

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['username', 'email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
