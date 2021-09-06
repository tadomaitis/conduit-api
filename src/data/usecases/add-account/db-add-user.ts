import { AddUser, AddUserModel, Encrypter, UserModel } from './db-add-account-protocols'

export class DbAddUser implements AddUser {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (userData: AddUserModel): Promise<UserModel> {
    const { password } = userData
    await this.encrypter.encrypt(password)
    return await new Promise(resolve => resolve(null))
  }
}
