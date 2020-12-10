import BaseService from './BaseService'

export default class CommonAPI extends BaseService {
  async getUserInfo(success, error) {
    await this.get('profile', success, error)
  }

  async updateAvatar(params, success, error) {
    await this.post('file/upload-profile', params, success, error)
  }

  async getAvatar(imageId, success, error) {
    await this.get('file/download/' + imageId, success, error)
  }

  async register(params, success, error) {
    await this.post('auth/register', params, success, error)
  }

  async login(params, success, error) {
    await this.post('auth/login', params, success, error)
  }

  async logout(success, error) {
    await this.post('auth/logout', {}, success, error)
  }

  async forgetPassword(params, success, error) {
    await this.post('accounts/reset-password/init', params, success, error)
  }

  async changePassword(params, success, error) {
    await this.patch('accounts/change-password', params, success, error)
  }

  async resetPasswordToken(params, success, error) {
    await this.put('accounts/reset-password-token', params, success, error)
  }
}
