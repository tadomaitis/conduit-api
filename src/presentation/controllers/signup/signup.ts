export class SignUpController {
  handle (httpRequest: any): any {
    if (!httpRequest.body.username) {
      return {
        statusCode: 400,
        body: new Error('Missing param error: username')
      }
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing param error: email')
      }
    }
  }
}
