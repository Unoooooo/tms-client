import BaseService from './BaseService'

export default class AdminAPI extends BaseService {
  async getListGroup(query, success, error) {
    await this.get(
      'group/' + query.page + '/' + query.size + '/1',
      success,
      error
    )
  }
}
