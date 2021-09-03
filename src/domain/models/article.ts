import { ProfileModel } from './profile'

export interface ArticleModel {
  slug: string
  title: string
  description: string
  body: string
  tagList: string[] | null
  createdAt: Date
  updatedAt: Date
  favotired: boolean
  favoritesCount: number
  author: ProfileModel
}
