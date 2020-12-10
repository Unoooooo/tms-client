import BaseService from './BaseService'

export default class GroupAPI extends BaseService {
  async getListGroup(params, success, error) {
    await this.get(
      `groups?page=${params.page}&size=${params.size}`,
      success,
      error
    )
  }

  async createGroup(params, success, error) {
    await this.post('groups/create', params, success, error)
  }

  async updateGroup(groupName, params, success, error) {
    await this.put('groups/' + groupName, params, success, error)
  }

  async detailGroup(groupName, success, error) {
    await this.get(`groups/${groupName}`, success, error)
  }

  async addMemberToGroup(groupName, params, success, error) {
    await this.post(`groups/addMember/${groupName}`, params, success, error)
  }

  async deleteGroup(groupName, success, error) {
    this.delete(`groups/${groupName}`, {}, success, error)
  }

  async deleteMemberGroup(groupName, username, success, error) {
    this.delete(
      `groups/deleteMember/${groupName}/${username}`,
      {},
      success,
      error
    )
  }

  async searchGroup(groupname, params, success, error) {
    this.get(`groups/search?groupname=${groupname}${params}`, success, error)
  }

}
