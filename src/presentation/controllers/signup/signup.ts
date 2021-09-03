import { MissingParamError } from '@/presentation/errors/missing-param-error'
import { HttpResponse, HttpRequest } from '@/presentation/protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['username', 'email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return {
          statusCode: 400,
          body: new MissingParamError(field)
        }
      }
    }
  }
}
