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

  async jobTimeSheet(params,success, error) {
    await this.get('test/job-time-sheet',params, success, error)
  }

  async rejectRequest(success, error) {
    await this.get('test/jobRejectRequest', success, error)
    
  }
  async jobDashBoardStaff(success, error) {
    await this.get('test/jobDashBoardStaff', success, error)
  }
  async jobDashBoardGroupManager(success, error) {
    await this.get('test/jobDashBoardGroupManager', success, error)
  }
  async jobDashBoardAdminHr(success, error) {
    await this.get('test/jobDashBoardAdminHr', success, error)
  }
}
