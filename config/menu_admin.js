export default [
  {
    key: 'admin',
    path: '/admin',
    name: 'DASHBOARD',
    icon: 'el-icon-s-home',
    children: false,
    permission: null,
  },
  {
    key: 'admin-administration-account',
    name: 'ADMINISTRATION',
    icon: 'el-icon-s-custom',
    permission: null,
    children: [
      {
        key: 'admin-administration-account',
        path: '/admin/administration/account',
        name: 'Manager Account',
        permission: null,
      },
      {
        key: 'admin-administration-group',
        path: '/admin/administration/group',
        name: 'Manager Group',
        permission: null,
      },
      {
        key: 'admin-administration-project',
        path: '/admin/administration/project',
        name: 'Manager Project',
        permission: null,
      },
      {
        key: 'admin-administration-site',
        path: '/admin/administration/site',
        name: 'Manager Site',
        permission: null,
      },
      {
        key: 'admin-administration-system-settings',
        path: '/admin/administration/system-settings',
        name: 'System settings',
        permission: null,
      },
    ],
  },
]
