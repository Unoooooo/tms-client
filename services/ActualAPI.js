import BaseService from './BaseService'

export default class ActualAPI extends BaseService {
  async getListActual(params, success, error) {
    await this.get(
      `actual-in-out/search?${this.urlParse(params)}`,
      success,
      error
    )
  }
  async getListGroupActual(params, success, error) {
    await this.get(`actual-in-out/list-group`, params, success, error)
  }
  async searchActualReport(params, success, error) {
    await this.get(
      `actual-in-out/search?${this.urlParse(params)}`,
      success,
      error
    )
  }

}
