export default [
  {
    key: 'humanresources',
    path: '/humanresources',
    name: 'DASHBOARD',
    icon: 'el-icon-s-home',
    children: false,
    permission: null,
  },
  {
    key: 'humanresources-request-abnormal',
    name: 'REPORT',
    icon: 'el-icon-star-on',
    permission: null,
    children: [
      {
        key: 'humanresources-request-abnormal',
        path: '/humanresources/report/abnormal',
        name: 'Abnormal',
        permission: null,
      },
      {
        key: 'humanresources-request-checkinout',
        path: '/humanresources/report/checkinout',
        name: 'TimeSheet',
        permission: null,
      },
      {
        key: 'humanresources-request-actual',
        path: '/humanresources/report/actual',
        name: 'Actual-In-Out',
        permission: null,
      },
      {
        key: 'humanresources-request-overtime',
        path: '/humanresources/report/overtime',
        name: 'Overtime',
        permission: null,
      },
      {
        key: 'humanresources-request-monthly',
        path: '/humanresources/report/monthly',
        name: 'Monthly Payroll',
        permission: null,
      },
    ],
  },
  {
    key: 'humanresources-request-absence',
    name: 'REQUEST',
    icon: 'el-icon-star-on',
    permission: null,
    children: [
      {
        key: 'humanresources-request-absence',
        path: '/humanresources/request/absence',
        name: 'Absence',
        permission: null,
      },
      {
        key: 'humanresources-request-remote',
        path: '/humanresources/request/remote',
        name: 'Remote',
        permission: null,
      },
      {
        key: 'humanresources-request-exception',
        path: '/humanresources/request/exception',
        name: 'Exception cases',
        permission: null,
      },
      {
        key: 'humanresources-request-explanation',
        path: '/humanresources/request/explanation',
        name: 'Explanation',
        permission: null,
      },
    ],
  },
  {
    key: 'humanresources-administration-account',
    name: 'ADMINISTRATION',
    icon: 'el-icon-s-custom',
    permission: null,
    children: [
      {
        key: 'humanresources-administration-account',
        path: '/humanresources/administration/account',
        name: 'Account Management',
        permission: null,
      },
      {
        key: 'humanresources-administration-group',
        path: '/humanresources/administration/group',
        name: 'Group Management',
        permission: null,
      },
    ],
  },
]
