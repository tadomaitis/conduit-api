import { AddUser, AddUserModel, AddUserRepository, Encrypter, UserModel } from './db-add-user-protocols'

export class DbAddUser implements AddUser {
  private readonly encrypter: Encrypter
  private readonly addUserRepository: AddUserRepository

  constructor (encrypter: Encrypter, addUserRepository: AddUserRepository) {
    this.encrypter = encrypter
    this.addUserRepository = addUserRepository
  }

  async add (userData: AddUserModel): Promise<UserModel> {
    const hashedPassword = await this.encrypter.encrypt(userData.password)
    await this.addUserRepository.add({ ...userData, password: hashedPassword })
    return await new Promise((resolve) => resolve(null))
  }
}
