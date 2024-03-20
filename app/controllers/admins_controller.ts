import User from '#models/user'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import fs from 'fs'

export default class AdminsController {
  async getUsers({ response }: HttpContext) {
    const users = await User.findManyBy({ is_admin: 0 })
    return response.ok(users)
  }

  async getUserById({ request, response }: HttpContext) {
    const { id } = request.params()
    const user = await User.find(id)
    return response.ok(user)
  }
  async patchUserById({ request, response }: HttpContext) {
    const { id } = request.params()
    const email = request.input('email')

    const fullname = request.input('fullname')
    const area = request.input('area')
    const tel = request.input('tel')
    const job = request.input('job')

    const user = await User.find(id)
    if (!user) {
      return response.badRequest({ message: 'Id not found' })
    }

    if (email) {
      user.email = email
    }
    if (fullname) {
      user.fullname = fullname
    }
    if (job) {
      user.job = job
    }
    if (area) {
      user.area = area
    }
    if (tel) {
      user.tel = tel
    }

    try {
      await user.save()

      return response.ok({ message: 'User updated' })
    } catch (error) {
      console.log(error)
      response.internalServerError({ message: 'Error Server' })
    }
  }

  async patchImgById({ request, response }: HttpContext) {
    const img = request.file('img', {
      extnames: ['jpg', 'png', 'jpeg'],
      size: '4mb',
    })
    const { id } = request.params()
    if (!img || !img.isValid) {
      return response.badRequest({ message: 'You need a image!' })
    }
    const user = await User.find(id)

    if (!user) {
      return response.badRequest({ message: 'Error with the User' })
    }
    const filename = `${cuid()}.${img.extname}`
    const oldFile = user.img
    try {
      if (fs.existsSync(`public/uploads/${oldFile}`)) {
        fs.unlinkSync(`public/uploads/${oldFile}`)
      }
      user.img = filename

      await user.save()
      await img.move('public/uploads', { name: filename })

      return response.ok({ message: 'User image updated' })
    } catch (error) {
      console.log(error)
      return response.badRequest({ message: 'Error' })
    }
  }
  async patchPasswordById({ request, response }: HttpContext) {
    const { id } = request.params()
    const password = request.input('password')
    if (!password) {
      return response.badRequest({ message: 'You need a new password!' })
    }
    const user = await User.find(id)
    if (!user) {
      return response.badRequest({ message: 'Error with the User' })
    }

    try {
      user.password = password
      user.save()
      return response.ok({ message: 'Password updated!' })
    } catch (error) {
      console.log(error)
      return response.internalServerError({ message: 'Error server' })
    }
  }

  async deleteUserById({ request, response }: HttpContext) {
    const { id } = request.params()
    const user = await User.find(id)
    if (!user) {
      return response.badRequest({ message: "User doesn't exist! " })
    }
    try {
      await user.delete()
      return response.ok('User deleted!')
    } catch (error) {
      return response.internalServerError({ message: 'Error server' })
    }
  }
  async enableUserById({ request, response }: HttpContext) {
    const { id } = request.params()
    const user = await User.find(id)
    if (!user) {
      return response.badRequest({ message: "User doesn't exist! " })
    }
    return response
  }
}
