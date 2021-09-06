import { Encrypter } from '@/data/protocols/encrypter'
import { DbAddUser } from './db-add-user'

class EncrypterStub implements Encrypter {
  async encrypt (value: string): Promise<string> {
    return await new Promise(resolve => resolve('hashed_password'))
  }
}

interface SutTypes {
  sut: DbAddUser
  encrypterStub: EncrypterStub
}

const makeSut = (): SutTypes => {
  const encrypterStub = new EncrypterStub()
  const sut = new DbAddUser(encrypterStub)
  return {
    sut,
    encrypterStub
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
})
