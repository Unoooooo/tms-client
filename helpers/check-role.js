export default {
  methods: {
    getRoleValue(role) {
      let roleValue = 0

      switch (role) {
        case 'ROLE_ADMIN':
          roleValue = 1
          break
        case 'ROLE_HR':
          roleValue = 2
          break
        case 'ROLE_MANAGER':
          roleValue = 3
          break
        case 'ROLE_STAFF':
          roleValue = 4
          break

        default:
          break
      }

      return roleValue
    },
  },
}
