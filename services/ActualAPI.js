import BaseService from './BaseService'

export default class ActualAPI extends BaseService {
  async getListActual(params, success, error) {
    await this.post(
      `actual-in-out/search?${this.urlParse(params)}`,
      params,
      success,
      error
    )
  }
  async getListGroupActual(params, success, error) {
    await this.get(`actual-in-out/list-group`, params, success, error)
  }
  async searchActualReport(params, success, error) {
    await this.post('actual-in-out/search', params, success, error)
  }
  async searchMothly(
    userName,
    startDate,
    endDate,
    groupId,
    params,
    success,
    error
  ) {
    this.get(
      `actual-in-out/search?groupId=${groupId}&userName=${userName}&startDate=${startDate}&endDate=${endDate}${params}`,
      success,
      error
    )
  }
}
