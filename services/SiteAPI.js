import BaseService from './BaseService'

export default class SiteAPI extends BaseService {
  async getListSite(params, success, error) {
    await this.get(
      `sites?page=${params.page}&size=${params.size}`,
      success,
      error
    )
  }

  async createSite(params, success, error) {
    await this.post('sites/createSite', params, success, error)
  }

  async updateSite(siteName, params, success, error) {
    await this.put('sites/' + siteName, params, success, error)
  }

  async detailSite(siteName, success, error) {
    await this.get(`sites/${siteName}`, success, error)
  }

  async deleteSite(siteName, success, error) {
    this.delete(`sites/${siteName}`, {}, success, error)
  }
  async searchSite(sitename, params, success, error) {
    this.get(`sites/search?sitename=${sitename}${params}`, success, error)
  }
}
