<template>
  <div class="flex flex-row items-center head-profile">
    <div class="item">
      <el-dropdown :show-timeout="0" @command="clickDropdownItem">
        <div>
          {{ username }}
          <img class="avatar" :src="avatar_url" />
        </div>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-user-solid">
            <nuxt-link to="/user/profile">
              {{ $t(`User profile`) }}
            </nuxt-link>
          </el-dropdown-item>
          <el-dropdown-item icon="el-icon-star-on">
            <nuxt-link to="/user/change-password">
              {{ $t(`Change password`) }}
            </nuxt-link>
          </el-dropdown-item>
          <el-dropdown-item icon="el-icon-warning" command="logout" divided>
            Logout
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderProfile',
  data() {
    return {
      username: this.$authInfo.username(),
      avatar_url:
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8HBhAOEQ4RDxAPDw8QEBASEhIQEw8NFhIWFhYRFxMaKCggGBolGxUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDQ0OFxAQGCsZFx8rLS0tKy03Kys3Li0rKy0rNy0rKzctLSstLS0tKzcrNystLSsrKy0rKysrKystKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAABAUGAwIBB//EADEQAQABAgMGBQMEAgMAAAAAAAABAgMEBRESITFBUaEVUmFxgSKRsRPB0eFCcjI0Yv/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/xAAaEQEBAQADAQAAAAAAAAAAAAAAARECEjEh/9oADAMBAAIRAxEAPwD9HAdWQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB9ppmurSI1npD7atzdrimI1mV/g8LThqOtXOUtwQLGVVVRrXVs+kb5+6VTldqI5z8pwxtXECvKrc8NY+dUPEZXXbjWmduOnCf7XYbTGWmNJfF7j8FGIp1jdXHCevpKjqjZnSY0mOMdJbl1HwBQAAAAAAAAAAAAAAAAAAABb5NY0om5PGd0eyzccJRsYWiP/MffR2c60AIAACnzixsXIrj/AC3T7rhEzSnawVXppPdZ6VQAOjIAAAAAAAAAAAAAAAAAAADTYedqxRPWmn8OiFlN79TCxHOjd8ck1yrQAAAAi5lOmCr9ojvCUrM6vaW4o5zOs+yz0VADoyAAAAAAAAAAAAAAAAAADpZsVX6tKY1/EfKytZRGn1V/FMfvKWyCDgsROGva8p3VR6NBbri5RExOsTwVt/KY2PoqnXpVz+USxiLmBuaTG7nTP7Jfvir8RMPmFu9HHZnpO7ulRVE82FfR5qrinjMQiYjMrdqN31z0jh9zBIv3qbFuapndHeejPYi9N+7NU8+0dHaqq5j7vDX05Up1vKadj6qpmfTSIhuZEU4tL2UaRrTXr6Vfyrbluq1XpVGkwsqPICgAAAAAAAAAAAAAA6WLU37sUxxntHVzW+TWdKJrnnuj2S3BOw9imxbimPmes9XUHNoc71im9TpVGroAqr2Ub/oq+Kv5Rpy+9Rwj7VQvhe1TFFGXXq+Mae9SVYymI311a+kbo+6zDtTHi3bptU6UxpD2CKI+MwsYm1pzjhPSUgBl66ZoqmJ3TE6T7vKxzmzs3Yrj/LdPvH9fhXOkusgCgAAAAAAAAAAAA0mEt/p4amOkR92dt07VyI6zEd2oZ5LABhQAAAAAAAAAETNKNvB1emkqBpr9O1ZqjrTP4ZlvilAGkAAAAAAAAAAAAdcJ/wBqj/en8w0rNYWdnE0T0rp/MNKxyWADKgAAAAAAAAAPlW+mfZl6v+U+7T1zpRM9IlmKuLXFK+ANoAAAAAAAAAAAANDgcRGIsRPON1XuzzpYvVWK9qmdJ7T6SlmkaYVtnNqZj6qZpnrG+HfxG15u0sZWksRPEbXm7SeI2vN2kwSxE8RtebtJ4ja83aTBLETxG15u0niNrzdpMEsRPEbXm7SeI2vN2kwSxEnMrXm7SjX82jTSin5n+DKO2aYj9KxsxP1VbvaOqjerlc3K5qmdZnm8tyYyAKAAAAAAAAAAAAAAAAAAgAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//Z',
    }
  },
  created() {
    this.getAvatar()
  },
  methods: {
    clickDropdownItem(command) {
      switch (command) {
        case 'logout':
          this.logout()
      }
    },
    async logout() {
      this.removeAccessToken()
      this.$authInfo.logoutAction()
      window.location = this.getRoutePath('login')
    },
    getAvatar() {
      if (this.$authInfo.avatar_url()) {
        this.$services.common.getAvatar(
          this.$authInfo.avatar_url(),
          (res) => {
            if (res.imageBase64) {
              this.avatar_url = 'data:image/png;base64,' + res.imageBase64
            }
          },
          (err) => this.notifyError(err.error.error)
        )
      }
    },
  },
}
</script>

<style scoped lang="scss">
.el-icon-message,
.iconfont {
  font-size: 24px;
}

.head-profile {
  padding-right: 10px;

  .item {
    padding: 0 15px;
    height: 64px;
    display: flex;
    align-items: center;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
}

.avatar {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}
</style>
