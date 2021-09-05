import { Encrypter } from '@/data/protocols/encrypter'
import { DbAddUser } from './db-add-user'

class EncrypterStub implements Encrypter {
  async encrypt (value: string): Promise<string> {
    return await new Promise(resolve => resolve('hashed_password'))
  }
}

describe('DbAddUser Usecase', () => {
  it('Should call Encrypter with correct password', async () => {
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddUser(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const userData = {
      username: 'valid_name',
      email: 'valid_mail@mail.com',
      password: 'valid_password'
    }
    await sut.add(userData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
