import BaseService from './BaseService'

export default class DailyTimeSheetAPI extends BaseService {
  async getListTimeSheet( success, error) {
    await this.post(`daily-timesheet/search`, success, error)
  }



  // async getListTimeSheetStaffDetail(id, date, success, error) {
  //   await this.get(`daily-timesheet/${id}/${date}`, success, error)
  // }
  async exportExcelDaily(success, error) {
    await this.get(`daily-timesheet/export`, success, error)
  }
  async getListTimesheetDetail(params, success, error) {
    await this.post(`daily-timesheet/detail`, params, success, error)
  }
  async getListGroupTimesheet(params, success, error) {
    await this.get(`daily-timesheet/list-group`,params, success, error)
  }
  async searchTimeSheetReport(params, success, error) {
    await this.post('daily-timesheet/search', params, success, error)
  }
  async searchMothly(
    groupId,
    userName,
    dateDailyReport,
    params,
    success,
    error
  ) {
    this.get(
      `daily-timesheet/search?groupId=${groupId}&userName=${userName}&=${dateDailyReport}${params}`,
      success,
      error
    )
  }
}
