import BaseService from './BaseService'

export default class ExplanationAPI extends BaseService {
  async getListExplanation(params, success, error) {
    await this.get(`explanations/search?${this.urlParse(params)}`, success, error)
  }

  async getListAccountReceiver(success, error) {
    await this.get(`explanations/get-account-receiver`, success, error)
  }

  async createExplanation(params, success, error) {
    await this.post('explanations/create/submit', params, success, error)
  }

  async searchExplanation(params, success, error) {
    await this.get(`explanations/search?${this.urlParse(params)}`, success, error)
  }

  async updateExplanation(params, success, error) {
    await this.put('explanations/update', params, success, error)
  }

  async deleteExplanation(id, success, error) {
    this.delete(`explanations/delete/` + id, {}, success, error)
  }

  async rejectExplanation(params, success, error) {
    await this.put('explanations/reject', params, success, error)
  }

  async acceptExplanation(params, success, error) {
    await this.put('explanations/accept', params, success, error)
  }
}
