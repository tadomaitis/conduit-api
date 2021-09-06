import { Encrypter, AddUserModel, AddUser, UserModel, AddUserRepository } from './db-add-user-protocols'
import { DbAddUser } from './db-add-user'

class EncrypterStub implements Encrypter {
  async encrypt (value: string): Promise<string> {
    return await new Promise(resolve => resolve('hashed_password'))
  }
}

const makeAddUserRepository = (): AddUserRepository => {
  class AddUserRepositoryStub implements AddUser {
    async add (userData: AddUserModel): Promise<UserModel> {
      const fakeUser = {
        id: 'valid_id',
        username: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password',
        token: '',
        bio: '',
        image: ''
      }
      return await new Promise(resolve => resolve(fakeUser))
    }
  }
  return new AddUserRepositoryStub()
}

interface SutTypes {
  sut: DbAddUser
  encrypterStub: EncrypterStub
  addUserRepositoryStub: AddUserRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = new EncrypterStub()
  const addUserRepositoryStub = makeAddUserRepository()
  const sut = new DbAddUser(encrypterStub, addUserRepositoryStub)
  return {
    sut,
    encrypterStub,
    addUserRepositoryStub
  }
}

describe('DbAddUser Usecase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const userData = {
      username: 'valid_name',
      email: 'valid_mail@mail.com',
      password: 'valid_password'
    }
    await sut.add(userData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const userData = {
      username: 'valid_name',
      email: 'valid_mail@mail.com',
      password: 'valid_password'
    }
    const promise = sut.add(userData)
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddUserRepository with correct values', async () => {
    const { sut, addUserRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addUserRepositoryStub, 'add')
    const userData = {
      username: 'valid_name',
      email: 'valid_mail@mail.com',
      password: 'valid_password'
    }
    await sut.add(userData)
    await expect(addSpy).toHaveBeenCalledWith(
      {
        username: 'valid_name',
        email: 'valid_mail@mail.com',
        password: 'hashed_password'
      }
    )
  })
})
