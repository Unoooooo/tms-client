import BaseService from './BaseService'

export default class SiteAPI extends BaseService {
  async getListSite(params, success, error) {
    await this.get(
      `sites/search?${this.urlParse(params)}`,
      success,
      error
    )
  }
  async getListSiteRemote(params, success, error) {
    await this.get(
      `sites/search`,
      params,
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
  async searchSite(params, success, error) {
    await this.get(
      `sites/search?${this.urlParse(params)}`,
      success,
      error
    )
  }
}
