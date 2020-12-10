import BaseService from './BaseService'

export default class DashboardAPI extends BaseService {
  async dashboardManager(id, success, error) {
    await this.get('dashboard/group/' + id, success, error)
  }

  async dashboardStaff(id, success, error) {
    await this.get('dashboard/employee/' + id, success, error)
  }
}
