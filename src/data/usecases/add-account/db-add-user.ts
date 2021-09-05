import { AddUser, AddUserModel } from '@/domain/usecases/add-user'
import { Encrypter } from '@/data/protocols/encrypter'
import { UserModel } from '@/domain/models/user'

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
