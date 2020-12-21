import BaseService from './BaseService'

export default class RequestAPI extends BaseService {
  async getListAbsenceRequest(params, success, error) {
    await this.get(
      `absences/search?${this.urlParse(params)}`,
      success,
      error
    )
  }
  async getListGroupAbsence(params, success, error) {
    await this.get(`absences/list-group`, params, success, error)
  }
  async getListAccountReceiver(success, error) {
    await this.get('absences/get-account-receiver', success, error)
  }

  async rejectAbsenceRequest(params, success, error) {
    await this.put('absences/reject', params, success, error)
  }

  async updateAbsenceRequest(params, success, error) {
    await this.put('absences/update', params, success, error)
  }

  async acceptAbsenceRequest(params, success, error) {
    await this.put('absences/accept', params, success, error)
  }

  async createAbsenceRequest(params, success, error) {
    await this.post('absences/create/submit', params, success, error)
  }

  async getTypeAbsenceRequest(success, error) {
    await this.get('absences/create', success, error)
  }

  async searchAbsenceRequest(params, success, error) {
    await this.get(
      `absences/search?${this.urlParse(params)}`,
      success,
      error
    )
  }

  // async searchAbsenceRequest(
  //   groupId,
  //   userName,
  //   startDate,
  //   endDate,
  //   projectName,
  //   params,
  //   success,
  //   error
  // ) {
  //   this.get(
  //     `absences/search?groupId=${groupId}&userName=${userName}&startDate=${startDate}&endDate=${endDate}${params}`,
  //     success,
  //     error
  //   )
  // }
  async deleteRequest(id, success, error) {
    this.delete(`absences/delete/` + id, {}, success, error)
  }

  // OT resquest
  async getListOTRequest(params, success, error) {
    await this.get(`overtimes/search?${this.urlParse(params)}`, success, error)
  }

  async addOtRequest(params, success, error) {
    await this.post('overtimes/create/submit', params, success, error)
  }

  async listDataOtRequest(success, error) {
    await this.get('overtimes/create', success, error)
  }

  async searchOtRequest(params, success, error) {
    await this.get(`overtimes/search?${this.urlParse(params)}`, success, error)
  }

  async updateOtRequest(params, success, error) {
    await this.put('overtimes/update', params, success, error)
  }

  async deleteOtRequest(id, success, error) {
    this.delete('overtimes/delete/' + id, {}, success, error)
  }
  async rejectOvertime(params, success, error) {
    await this.put('overtimes/reject', params, success, error)
  }

  async acceptOvertime(params, success, error) {
    await this.put('overtimes/accept', params, success, error)
  }

  // Remote request
  async getListRemoteRequest(params, success, error) {
    await this.get(
      `remote/search?${this.urlParse(params)}`,
      success,
      error
    )
  }

  async searchRemoteRequest(params, success, error) {
    await this.get(
      `remote/search?${this.urlParse(params)}`,
      success,
      error
    )
  }

  async rejectCheckInRequest(params, success, error) {
    await this.put('remote/reject', params, success, error)
  }

  async acceptCheckInRequest(params, success, error) {
    await this.put('remote/accept', params, success, error)
  }

  async addCheckIn(params, success, error) {
    await this.post('remote/add/submit', params, success, error)
  }
}
