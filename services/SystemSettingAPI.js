import BaseService from './BaseService'

export default class SystemSettingAPI extends BaseService {
  async getSystemSetting(success, error) {
    await this.get('settings', success, error)
  }

  async getListDayOff(success, error) {
    await this.get('settings/work-off-date', success, error)
  }

  async addDayOff(params, success, error) {
    await this.post('settings/work-off-date/add', params, success, error)
  }

  async deleteDayOff(date, success, error) {
    this.delete('settings/work-off-date/' + date, {}, success, error)
  }

  async updateSystemSetting(params, success, error) {
    await this.post('settings/save', params, success, error)
  }

  async resetSystemSetting(success, error) {
    await this.put('settings/reset', {}, success, error)
  }

  async jobTimeSheet(success, error) {
    await this.get('test/job-time-sheet', success, error)
  }

  async rejectRequest(success, error) {
    await this.get('test/jobRejectRequest', success, error)
  }
}
