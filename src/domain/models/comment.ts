import { ProfileModel } from './profile'

export interface Comment {
  id: number
  createdAt: Date
  updatedAt: Date
  body: string
  author: ProfileModel
}
