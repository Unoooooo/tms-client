import BaseService from './BaseService'

export default class ExceptionsAPI extends BaseService {
  async getListException(params, success, error) {
    await this.get(`exceptions/search?${this.urlParse(params)}`, success, error)
  }

  async getListAccountReceiver(success, error) {
    await this.get('exceptions/get-account-receiver', success, error)
  }

  async createException(params, success, error) {
    await this.post('exceptions/create/submit', params, success, error)
  }

  async getListExceptionalCaseType(success, error) {
    await this.get('exceptions/create', success, error)
  }

  async searchException(params, success, error) {
    await this.get(`exceptions/search?${this.urlParse(params)}`, success, error)
  }

  async updateException(params, success, error) {
    await this.put('exceptions/update', params, success, error)
  }

  async deleteException(id, success, error) {
    this.delete(`exceptions/delete/` + id, {}, success, error)
  }

  async rejectException(params, success, error) {
    await this.put('exceptions/reject', params, success, error)
  }

  async acceptException(params, success, error) {
    await this.put('exceptions/accept', params, success, error)
  }
}
