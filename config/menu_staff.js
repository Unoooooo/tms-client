export default [
  {
    key: 'staff',
    path: '/staff',
    name: 'DASHBOARD',
    icon: 'el-icon-s-home',
    children: false,
    permission: null,
  },
  {
    key: 'staff-report-abnormal',
    name: 'REPORT',
    icon: 'el-icon-star-on',
    permission: null,
    children: [
      {
        key: 'staff-report-abnormal',
        path: '/staff/report/abnormal',
        name: 'Abnormal',
        permission: null,
      },
      {
        key: 'staff-report-checkinout',
        path: '/staff/report/checkinout',
        name: 'TimeSheet',
        permission: null,
      },
      {
        key: 'staff-report-actual',
        path: '/staff/report/actual',
        name: 'Actual-In-Out',
        permission: null,
      },
      {
        key: 'staff-report-overttime',
        path: '/staff/report/overtime',
        name: 'Overttime',
        permission: null,
      },
      {
        key: 'staff-report-monthly',
        path: '/staff/report/monthly',
        name: 'Monthly Payroll',
        permission: null,
      },
    ],
  },
  {
    key: 'staff-request-absence',
    name: 'REQUEST',
    icon: 'el-icon-star-on',
    permission: null,
    children: [
      {
        key: 'staff-request-absence',
        path: '/staff/request/absence',
        name: 'Absence',
        permission: null,
      },
      {
        key: 'staff-request-overtime',
        path: '/staff/request/overtime',
        name: 'Overtime',
        permission: null,
      },
      {
        key: 'staff-request-remote',
        path: '/staff/request/remote',
        name: 'Remote',
        permission: null,
      },
      {
        key: 'staff-request-exception',
        path: '/staff/request/exception',
        name: 'Exception cases',
        permission: null,
      },
      {
        key: 'staff-request-explanation',
        path: '/staff/request/explanation',
        name: 'Explanation',
        permission: null,
      },
    ],
  },
]
