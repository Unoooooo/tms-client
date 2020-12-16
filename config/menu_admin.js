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
        name: 'Account Management',
        permission: null,
      },
      {
        key: 'admin-administration-group',
        path: '/admin/administration/group',
        name: 'Group Management',
        permission: null,
      },
      {
        key: 'admin-administration-project',
        path: '/admin/administration/project',
        name: 'Project Management',
        permission: null,
      },
      {
        key: 'admin-administration-site',
        path: '/admin/administration/site',
        name: 'Site Management',
        permission: null,
      },
      {
        key: 'admin-administration-system-settings',
        path: '/admin/administration/system-settings',
        name: 'System Settings',
        permission: null,
      },
      {
        key: 'admin-administration-jobservice',
        path: '/admin/administration/jobservice',
        name: 'Day Reincarnation',
        permission: null,
      },
    ],
  },
]
