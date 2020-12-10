import BaseService from './BaseService'

export default class UserAPI extends BaseService {
  async getListUser(params, success, error) {
    await this.get(
      `accounts?page=${params.page}&size=${params.size}`,
      success,
      error
    )
  }

  async getDetailUser(username, success, error) {
    await this.get('accounts/' + username, success, error)
  }

  async getListStaff(success, error) {
    await this.get('accounts/listStaff', success, error)
  }

  async getListMemberNonGroup(id, success, error) {
    await this.get(
      'accounts/list-account-non-belong-group/' + id,
      success,
      error
    )
  }

  async updateUser(username, params, success, error) {
    await this.put('accounts/' + username, params, success, error)
  }

  async createUser(params, success, error) {
    await this.post('accounts/createAccount', params, success, error)
  }

  async addMemberToGroup(groupId, params, success, error) {
    await this.post('groups/addMember/' + groupId, params, success, error)
  }

  async deleteUser(username, success, error) {
    this.delete('accounts/' + username, {}, success, error)
  }

  async searchUser(username, groupname, params, success, error) {
    this.get(
      `accounts/search?username=${username}&groupname=${groupname}${params}`,
      success,
      error
    )
  }
}
