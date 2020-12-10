import BaseService from './BaseService'

export default class ActualAPI extends BaseService {

  
  async getListActual(params, success, error) {

    await this.post('actual-in-out/search', params, success, error)
  }

  async searchActualReport(params, success, error) {
    await this.post('actual-in-out/search', params, success, error)
  }
  async searchMothly(
  
    userName,
    dateActualInOut,
    params,
    success,
    error
  ) {
    this.get(
      `actual-in-out/search?userName=${userName}&dateActualInOut=${dateActualInOut}${params}`,
      success,
      error
    )
  }
}
