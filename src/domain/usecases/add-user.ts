import { UserModel } from '@/domain/models/user'

export interface AddUserModel {
  username: string
  email: string
  password: string
}

export interface AddUser {
  add: (account: AddUserModel) => Promise<UserModel>
}
