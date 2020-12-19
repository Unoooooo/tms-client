import BaseService from './BaseService'

export default class DailyTimeSheetAPI extends BaseService {
  async getListTimeSheet(params, success, error) {
    await this.get(
      `daily-timesheet/search?${this.urlParse(params)}`,
      success,
      error
    )
  }

  async exportExcelDaily(success, error) {
    await this.get(`daily-timesheet/export`, success, error)
  }
  async getListTimesheetDetail(params, success, error) {
    await this.post(`daily-timesheet/detail`, params, success, error)
  }
  async getListGroupTimesheet(params, success, error) {
    await this.get(`daily-timesheet/list-group`, params, success, error)
  }
  async searchTimeSheetReport(params, success, error) {
    await this.get(
      `daily-timesheet/search?${this.urlParse(params)}`,
      success,
      error
    )
  }
  // async searchTimeSheet(
  //   groupId,
  //   userName,
  //   startDate,
  //   endDate,
  //   params,
  //   success,
  //   error
  // ) {
  //   this.get(
  //     `daily-timesheet/search?groupId=${groupId}&userName=${userName}&startDate=${startDate}&endDate=${endDate}${params}`,
  //     success,
  //     error
  //   )
  // }
}
