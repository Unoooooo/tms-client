import BaseService from './BaseService'

export default class OvertimeAPI extends BaseService {
  async getListOvertime(params, success, error) {
    await this.get(
      `overtimes-report/search?${this.urlParse(params)}`,
      success,
      error
    )
  }

  async getListOvertimeDetail(params, success, error) {
    await this.post(`overtimes-report/detail`, params, success, error)
  }
  async getListGroupOvertime(params, success, error) {
    await this.get(`overtimes-report/list-group`, params, success, error)
  }
  async searchOvertimeReport(params, success, error) {
    await this.get(
      `overtimes-report/search?${this.urlParse(params)}`,
      success,
      error
    )
  }
  async searchOvertime(
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
