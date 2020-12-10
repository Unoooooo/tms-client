import Vue from 'vue'
import CommonAPI from '~/services/CommonAPI'
import AdminAPI from '~/services/AdminAPI'
import UserAPI from '~/services/UserAPI'
import GroupAPI from '~/services/GroupAPI'
import ProjectAPI from '~/services/ProjectAPI'
import SiteAPI from '~/services/SiteAPI'
import SystemSettingAPI from '~/services/SystemSettingAPI'
import RequestAPI from '~/services/RequestAPI'
import ExplanationAPI from '~/services/ExplanationAPI'
import ExceptionsAPI from '~/services/ExceptionsAPI'
import AbnormalAPI from '~/services/AbnormalAPI'
import DashboardAPI from '~/services/DashboardAPI'
import DailyTimeSheetAPI from '~/services/DailyTimeSheetAPI'
import OvertimeAPI from '~/services/OvertimeAPI'
import MonthlyAPI from '~/services/MonthlyAPI'
import ActualAPI from '~/services/ActualAPI'
import Auth from '~/services/Auth'

export default function ({ $axios, store }) {
  const log = Vue.prototype.$log
  const services = {
    common: new CommonAPI($axios, log, '/'),
    admin: new AdminAPI($axios, log, '/'),
    user: new UserAPI($axios, log, '/'),
    group: new GroupAPI($axios, log, '/'),
    project: new ProjectAPI($axios, log, '/'),
    site: new SiteAPI($axios, log, '/'),
    request: new RequestAPI($axios, log, '/'),
    explanation: new ExplanationAPI($axios, log, '/'),
    exception: new ExceptionsAPI($axios, log, '/'),
    abnormal: new AbnormalAPI($axios, log, '/'),
    dashboard: new DashboardAPI($axios, log, '/'),
    dailytimesheet: new DailyTimeSheetAPI($axios, log, '/'),
    overtime: new OvertimeAPI($axios, log, '/'),
    monthly: new MonthlyAPI($axios, log, '/'),
    actual: new ActualAPI($axios, log, '/'),
    systemSetting: new SystemSettingAPI($axios, log, '/'),
  }

  Vue.prototype.$services = services
  Vue.prototype.$authInfo = new Auth(store)
}
