export default [
  {
    key: 'manager',
    path: '/manager',
    name: 'DASHBOARD',
    icon: 'el-icon-s-home',
    children: false,
    permission: null,
  },
  {
    key: 'manager-request-abnormal',
    name: 'REPORT',
    icon: 'el-icon-star-on',
    permission: null,
    children: [
      // {
      //   key: 'manager-request-abnormal',
      //   path: '/manager/report/abnormal',
      //   name: 'Abnormal',
      //   permission: null,
      // },
      {
        key: 'manager-request-checkinout',
        path: '/manager/report/checkinout',
        name: 'TimeSheet',
        permission: null,
      },
      {
        key: 'manager-request-actual',
        path: '/manager/report/actual',
        name: 'Actual-In-Out',
        permission: null,
      },
      {
        key: 'manager-request-overtime',
        path: '/manager/report/overtime',
        name: 'Overttime',
        permission: null,
      },
      {
        key: 'manager-request-monthly',
        path: '/manager/report/monthly',
        name: 'Monthly Payroll',
        permission: null,
      },
    ],
  },
  {
    key: 'manager-request-absence',
    name: 'REQUEST',
    icon: 'el-icon-star-on',
    permission: null,
    children: [
      {
        key: 'manager-request-absence',
        path: '/manager/request/absence',
        name: 'Absence',
        permission: null,
      },
      {
        key: 'manager-request-overtime',
        path: '/manager/request/overtime',
        name: 'Overtime',
        permission: null,
      },
      {
        key: 'manager-request-remote',
        path: '/manager/request/remote',
        name: 'Remote',
        permission: null,
      },
      {
        key: 'manager-request-exception',
        path: '/manager/request/exception',
        name: 'Exception cases',
        permission: null,
      },
      {
        key: 'manager-request-explanation',
        path: '/manager/request/explanation',
        name: 'Explanation',
        permission: null,
      },
    ],
  },
  {
    key: 'manager-administration-account',
    name: 'ADMINISTRATION',
    icon: 'el-icon-s-custom',
    permission: null,
    children: [
      {
        key: 'manager-administration-project',
        path: '/manager/administration/project',
        name: 'Manager Project',
        permission: null,
      },
      {
        key: 'manager-administration-site',
        path: '/manager/administration/site',
        name: 'Manager Site',
        permission: null,
      },
    ],
  },
]
