import BaseService from './BaseService'

export default class AbnormalAPI extends BaseService {
  async getListAbnormal(params, success, error) {
    await this.get(`abnormal-case?${this.urlParse(params)}`, success, error)
  }

  async getListAbnormalStaff(params, success, error) {
    await this.post('abnormal-case/search', params, success, error)
  }
  async getListGroupAbnormal(params, success, error) {
    await this.get(`abnormal-case/list-group`, params, success, error)
  }
  async getListAbnormalReceiver(success, error) {
    await this.get('explanations/create', success, error)
  }
  async createAbnormal(params, success, error) {
    await this.post('abnormal-case/create/submit', params, success, error)
  }

  async updateAbnormal(params, success, error) {
    await this.put('abnormal-case/update', params, success, error)
  }

  async deleteAbnormal(id, success, error) {
    this.delete(`abnormal-case/delete/` + id, {}, success, error)
  }

  async rejectAbnormal(params, success, error) {
    await this.put('abnormal-case/reject', params, success, error)
  }

  async acceptExplanation(params, success, error) {
    await this.put('abnormal-case/accept', params, success, error)
  }
  async detailAbnormal(accountId, explanId, success, error) {
    await this.get(`abnormal-case/${accountId}/${explanId}`, success, error)
  }
  async searchAbnormalRequest(params, success, error) {
    await this.post('abnormal-case/search', params, success, error)
  }
  async searchAbnormal(
    userName,
    startDate,
    endDate,
    groupId,
    params,
    success,
    error
  ) {
    this.get(
      `abnormal-case/search?&groupId=${groupId}&userName=${userName}&startDate=${startDate}&endDate=${endDate}${params}`,
      success,
      error
    )
  }
}
