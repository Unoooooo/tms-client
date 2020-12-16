import BaseService from './BaseService'

export default class OvertimeAPI extends BaseService {
  async getListMonthly(params, success, error) {
    await this.post(
      `monthly/search?${this.urlParse(params)}`,
      params,
      success,
      error
    )
  }

  async getListMonthlyDetail(params, success, error) {
    await this.post(`monthly/detail`, params, success, error)
  }
  async getListGroupMonthly(params, success, error) {
    await this.get(`monthly/list-group`, params, success, error)
  }
  async searchMonthlyReport(params, success, error) {
    await this.post('monthly/search', params, success, error)
  }
  async searchMothly(
    groupId,
    userName,
    startDate,
    endDate,
    params,
    success,
    error
  ) {
    this.get(
      `overtimes-report/search?groupId=${groupId}&userName=${userName}&startDate=${startDate}&endDate=${endDate}${params}`,
      success,
      error
    )
  }
}
