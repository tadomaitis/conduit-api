export class SignUpController {
  handle (httpRequest: any): any {
    const requiredFields = ['username', 'email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return {
          statusCode: 400,
          body: new Error(`Missing param error: ${field}`)
        }
      }
    }
  }
}
