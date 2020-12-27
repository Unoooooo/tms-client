<template>
  <section-block title="Check Remote">
    <div>
      <section class="group-filter">
        <div class="pc-hidden">
          <el-input
            v-model="userName"
            :disabled="$authInfo.role() == constant.Role.STAFF"
            placeholder="Account"
            class="input-search"
            clearable
          />

          <el-date-picker
            v-model="start_date"
            type="date"
            placeholder="Start Date"
            format="dd-MM-yyyy"
            value-format="yyyy-MM-dd"
            class="date-picker"
          />

          <el-date-picker
            v-model="end_date"
            type="date"
            placeholder="End Date"
            format="dd-MM-yyyy"
            value-format="yyyy-MM-dd"
            class="date-picker"
          />

          <el-button
            class="button-delete-multi"
            type="primary"
            @click="searchRemoteRequest()"
          >
            <i class="el-icon-search"></i>
          </el-button>

          <el-button
            class="button-delete-multi"
            type="primary"
             @click="fetch()"
          >
            <i class="el-icon-refresh"></i>
          </el-button>
          <el-button class="gr-button" @click="handleCreate()">
            {{ $t('Add request') }}
          </el-button>
        </div>

        <!-- <div
          v-if="$authInfo.role() !== constant.Role.MANAGER"
          class="gr-button"
        >
          <el-button class="add-new" @click="handleCreate()">
            {{ $t('Add request') }}
          </el-button>
        </div> -->
      </section>

      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        style="width: 100%"
        class="table-serenade"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          class-name="text-center"
          prop="stt"
          :label="$t('STT')"
          width="80px"
        />
        <el-table-column
          class-name="text-left"
          prop="account_sent"
          :label="$t('Account')"
        />
        <el-table-column
          class-name="text-left"
          prop="groupName"
          :label="$t('Group')"
        />
        <el-table-column
          class-name="text-left"
          prop="site"
          :label="$t('Site Name')"
        />
        <el-table-column
          class-name="text-center"
          prop="check_time"
          :label="$t('Check Time')"
        >
          <!-- <template slot-scope="{ row }">
            {{
              row.check_time ? showDateTime(row.check_time, 'DD/MM/YYYY - HH:MM:SS') : ''
            }}
          </template> -->
        </el-table-column>

        <el-table-column
          class-name="text-left"
          prop="status"
          sortable
          :label="$t('Status')"
        />
        <el-table-column
          class-name="text-center"
          prop="action"
          :label="$t('Action')"
          width="110px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="
                scope.row.status == 'Submited' &&
                $authInfo.role() == constant.Role.MANAGER &&
                $authInfo.username() != scope.row.account_sent
              "
              class="button-action"
              type="danger"
              @click="handleReject(scope.$index, scope.row)"
            >
              <i class="el-icon-close"></i>
            </el-button>
            <el-button
              class="button-action"
              type="primary"
              @click="handleInfo(scope.$index, scope.row)"
            >
              <i class="el-icon-user"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <section>
        <el-dialog
          :title="titlePopup"
          :visible.sync="dialogFormWithInput"
          width="60%"
        >
          <el-form ref="dataForm" :rules="rules" :model="checkIn">
            <el-row v-if="dialogMode !== 'detail'" :gutter="20">
              <el-col :sm="24" :lg="10">
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Full Name</label>
                  <el-form-item prop="full_name" class="col-sm-7">
                    <el-input
                      v-model="checkIn.full_name"
                      class="widthInput"
                      disabled
                    />
                  </el-form-item>
                </div>

                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Group</label>
                  <el-form-item prop="group_name" class="col-sm-7">
                    <el-input
                      v-model="checkIn.group_name"
                      class="widthInput"
                      disabled
                    />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Time</label>
                  <el-form-item class="col-sm-7">
                    <el-input
                      :placeholder="dataString"
                      class="widthInput"
                      disabled
                    />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Site Name</label>
                  <el-form-item prop="sitename" class="col-sm-7">
                    <el-select
                      v-model="checkIn.sitename"
                      placeholder="Select sitename"
                      class="widthInput"
                    >
                      <el-option
                        v-for="(item, index) in sites"
                        :key="index"
                        :label="item.label"
                        :value="item.label"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :sm="24" :lg="14">
                <div class="form-group maginAVT">
                  <!-- <el-upload
                    class="avatar-uploader"
                    action=""
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                   @click="handleClickInputFile"
                    
                  > -->
                  <input
                    id="avatar"
                    ref="avatar"
                    type="file"
                    @change="handleFileUpload()"
                  />
                  <img
                    v-if="imageUrl"
                    :src="image_url_preview"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <!-- </el-upload> -->
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <div v-if="dialogMode === 'detail'">
                  <el-col :span="12" style="float: right">
                    <div class="form-group row">
                      <div class="dialog-alert"></div>
                      <el-image
                        :src="image_url_preview"
                        fit="contain"
                        style="width: 70%"
                      >
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                      </el-image>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">Full Name</label>
                      <el-form-item class="col-sm-7">
                        {{ checkIn.full_name }}
                      </el-form-item>
                    </div>
                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">Group</label>
                      <el-form-item class="col-sm-7">
                        {{ checkIn.groupName }}
                      </el-form-item>
                    </div>

                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">Time</label>
                      <el-form-item class="col-sm-6">
                        {{ checkIn.check_time }}
                      </el-form-item>
                    </div>

                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">Site</label>
                      <el-form-item prop="site" class="col-sm-5">
                        {{ checkIn.site }}
                      </el-form-item>
                    </div>
                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">Status</label>
                      <el-form-item prop="status" class="col-sm-5">
                        {{ checkIn.status }}
                      </el-form-item>
                    </div>
                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">Message</label>
                      <el-form-item prop="response_msg" class="col-sm-5">
                        {{ checkIn.response_msg }}
                      </el-form-item>
                    </div>
                  </el-col>
                </div>
              </el-col>
            </el-row>
          </el-form>
          <hr class="mb-0" />
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormWithInput = false">Close</el-button>
            <el-button
              v-if="dialogMode !== 'detail'"
              class="mr-auto"
              type="primary"
              @click="uploadImageCheckIn"
            >
              OK
            </el-button>

            <!-- <el-button
              v-else
              class="mr-auto"
              type="primary"
              @click="dialogFormWithInput = false"
            >
              OK
            </el-button> -->
          </span>
        </el-dialog>
      </section>
      <section>
        <el-dialog
          title="Message request"
          :visible.sync="showFormMessage"
          width="50%"
        >
          <el-form ref="dataFormMessage" :rules="rules" :model="message">
            <el-form-item label="Reason">
              <el-input
                v-model="message.response_msg"
                type="textarea"
              ></el-input>
            </el-form-item>
          </el-form>

          <hr class="mb-0" />
          <span slot="footer" class="dialog-footer">
            <el-button @click="showFormMessage = false">Close</el-button>
            <el-button type="primary" @click="rejectItem()"> Submit </el-button>
          </span>
        </el-dialog>
      </section>

      <div class="d-flex pagination">
        <SimplePagination
          v-if="!isEmpty(tableData) && totalPages > 1"
          v-model="page"
          :change-page="changePageData"
          :total-page="totalPages"
        />
      </div>
    </div>
  </section-block>
</template>

<style lang="scss" scoped>
.image-remote {
  max-width: 70%;
}
.form-group {
  margin-bottom: 0px;
}
.maginAVT {
  margin-left: 30px;
}
// .widthInput {
//   width: 210px;
// }
.avatar-uploader {
  margin: auto;
  max-width: 300px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 300px;
  line-height: 300px;
  text-align: center;
}
.avatar {
  width: 300px;
  height: 300px;
  display: block;
  object-fit: cover;
}

.el-select {
  padding-right: 0;
}
.mr-auto {
  margin: 20px auto 0;
}
.data-detail {
  line-height: 35px;
}
.content {
  margin: 70px 32px 20px;
  .title {
    margin: 30px 0 40px;
  }
}
.tabel-wrapper {
  width: 1200px;
  margin: 50px auto;
}
.el-table tr th {
  background-color: #f5f7fa;
}

.demo-input-label {
  display: inline-block;
  width: 45px;
  text-align: center;
}

.demo-input-suffix .el-input {
  width: 80px;
}

.el-form-item__label {
  text-align: left;
}
label {
  text-align: center;
}
.line {
  margin-top: -30px;
}

.group-filter {
  margin-bottom: 20px;
  .gr-button {
    float: right;
  }
  .searchAll {
    display: flex;
    margin-bottom: -40px;
    .gr-search {
      margin-right: 3px;
    }
    .gr-searchDate {
      margin-left: 3px;
    }
  }
}
.button-action {
  padding: 5px;
  margin-left: 0;
}
.pagination {
  margin-top: 30px;
}
.input-search {
  width: 150px;
  margin-bottom: 10px;
}
.date-picker {
  width: 150px;
  margin-bottom: 10px;
}
@media screen and (max-width: 1370px) {
  .input-search {
    width: 150px;
    margin-bottom: 10px;
  }
  .date-picker {
    width: 150px;
    margin-bottom: 10px;
    display: flex;
  }
}
</style>

<script>
import SimplePagination from '~/components/pagination/SimplePagination'
import validate from '@/helpers/custom-rules-validate'
import Constant from '~/constant'
// function getBase64(img, callback) {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result));
//   reader.readAsDataURL(img);
// }
export default {
  components: { SimplePagination },
  mixins: [validate],
  layout: 'admin',
  middleware: 'auth',
  data() {
    return {
      constant: Constant,
      imageUrl: '',
      tableData: [],
      groupSearch: '',
      user_name: '',
      fullnameSearch: '',
      userName: '',
      start_date: '',
      end_date: '',
      dialogFormWithInput: false,
      showFormMessage: false,
      titlePopup: '',
      dialogMode: '',
      dataReject: {},
      sites: [],
      message: {
        response_msg: '',
      },
      checkIn: {
        full_name: '',
        group_name: '',
        sitename: '',
      },
      user: {
        account_sent: '',
        account_receiver: '',
        groupCompany: '',
      },
      image_url_preview: '',
      rules: {
        sitename: this.validateRequired('sitename'),
      },
      rowSelected: null,
      multipleSelection: [],
      totalPages: 1,
      page: 1,
      size: undefined,
    }
  },
  created() {
    const query = this.$route.query
    if (query.page) {
      this.page = query.page
    }
    if (query.size) {
      this.size = query.size
    }
    this.getListRemoteRequest(this.page, this.size)
    this.getUserInfo()
    this.getListSiteRemote()
    this.dataString =
      new Date().toISOString().slice(0, 10) +
      ' ' +
      new Date().toLocaleTimeString()
  },
  methods: {
    async fetch() {
        this.userName = ''
        this.groupSearch = ''
        this.end_date = ''
        this.start_date = ''
        await this.getListRemoteRequest(1, this.size)
        this.page = 1
        this.$router.push({name: this.$route.name, query: {
          page: 1
        }})
      },
    handleClickInputFile(e) {
      this.$refs.avatar.click()
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    resetImagePreview() {
      this.image_url_preview = ''
    },
    canSelectRow(row) {
      return (
        row.account_sent === this.user.user_name && row.status == 'Completed'
      )
    },
    async getListSiteRemote(page, size) {
      // let params = {
      //   page: page - 1,
      //   size,
      // }
      await this.$services.site.getListSiteRemote(
        // params,
        (response) => {
          if (response.data && response.data.length > 0) {
            this.sites = response.data.map((item) => {
              return { label: item.name, value: item.site_id }
            })
          }
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
    },
    handleFileUpload() {
      this.imageUrl = this.$refs.avatar.files[0]
      console.log(this.imageUrl, 'a')
      if (this.imageUrl) {
        this.image_url_preview = URL.createObjectURL(this.imageUrl)
        console.log(this.image_url_preview, 'b')
      }
    },
    async getListRemoteRequest(page, size) {
      
       let params = {
        page: page - 1,
        size: size
      }
      if (!this.userName.length == 0 || this.userName.trim()) {
        params.user_name = this.userName.trim()
      }
       if(this.groupSearch !== '' && !this.groupSearch == 0 ) {
        params.groupId = this.groupSearch
      }
      if(this.start_date && this.start_date.trim() !== '') {
        params.start_date = this.start_date
      }
      if(this.end_date && this.end_date.trim() !== '') {
        params.end_date = this.end_date
      }
      if (this.$authInfo.roleValue() === 'staff') {
        await this.$services.request.getListRemoteRequest(
          params,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.tableData = response.data
              this.totalPages = response.totalPages
            }
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
      } else {
        await this.$services.request.getListRemoteRequest(
          params,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.tableData = response.data
              this.totalPages = response.totalPages
            }
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
      }
    },
    async getUserInfo() {
      await this.$services.common.getUserInfo(
        (response) => {
          this.checkIn.full_name = response.data.full_name
          this.checkIn.group_name = response.data.groupCompanyName
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    async uploadImageCheckIn() {
      if (this.checkIn.sitename) {
        if (this.imageUrl) {
          let formData = new FormData()
          formData.append('uploadfile', this.imageUrl)
          formData.append('sitename', this.checkIn.sitename)
          console.log(this.imageUrl)
          console.log(formData)
          await this.$services.request.addCheckIn(
            formData,
            (res) => {
              this.imageUrl = ''
              this.image_url_preview = ''
              this.$refs.avatar.value = null
              this.dialogFormWithInput = false
              this.getListRemoteRequest(this.page, this.size)
              this.resetUserData()
              this.notifySuccess(res.message)
            },
            (err) => {
              this.notifyError(err.error.error)
              this.$refs.avatar.value = null
            }
          )
        } else {
          this.notifyError('Please select image!')
        }
      } else {
        this.notifyError('Please select site! ')
      }
    },
    async searchRemoteRequest() {
     this.startLoading()
      let params = {
        page: 0,
        size: this.size
      }
     if(this.userName.trim() !== '') {
        params.user_name = this.userName
      }
      if(this.groupSearch !== '' && !this.groupSearch == 0 ) {
        params.groupId = this.groupSearch
      }
      if(this.start_date && this.start_date.trim() !== '') {
        params.start_date = this.start_date
      }
      if(this.end_date && this.end_date.trim() !== '') {
        params.end_date = this.end_date
      }
      await this.$services.request.getListRemoteRequest(
        params,
        (response) => {
          console.log(0)
          if (response.data && response.data.length > 0) {
            console.log(1)
            this.tableData = response.data
            this.totalPages = response.totalPages
            this.page = 1
            this.$router.push({name: this.$route.name, query: {
              page: 1
            }})

          } else {
            console.log(2)
            this.tableData = []
            this.totalPages = 0
          }
        },
        (err) => {
          console.log(3)
          this.tableData = []
          this.totalPages = 0
          this.notifyError(err.error.error)
        }
      )
      this.endLoading()
    },
    getAvatar(image) {
      this.startLoading()
      this.$services.common.getAvatar(
        image,
        (res) => {
          this.image_url_preview = 'data:image/png;base64,' + res.imageBase64
          this.dialogFormWithInput = true
          this.endLoading()
        },
        (err) => {
          this.dialogFormWithInput = true
          this.endLoading()
          this.notifyError(err.error.error)
        }
      )
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    changePageData(page) {
      this.getListRemoteRequest(page, this.size)
      this.page = page
      const roleValue = this.$authInfo.roleValue()
      this.$router.push({
        name: `${roleValue}-request-remote`,
        query: { page, size: this.size },
      })
    },
    resetUserData() {
      this.checkIn = {
        sitename: '',
      }
    },
    handleCreate() {
      this.dialogMode = 'create'
      this.titlePopup = 'Create Remote Request'
      this.dialogFormWithInput = true
      this.image_url_preview = ''
      this.imageUrl = ''
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(index, row) {
      this.checkIn = Object.assign({}, row)
      this.dialogMode = 'update'
      this.titlePopup = 'Edit Remote Request'
      this.dialogFormWithInput = true
      this.rowSelected = index + 1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleReject(index, row) {
      const data = Object.assign({}, row)
      this.dataReject = data
      this.showFormMessage = true
      this.rowSelected = index + 1
    },
    rejectItem() {
      this.$services.request.rejectCheckInRequest(
        { ...this.dataReject, response_msg: this.message.response_msg },
        (res) => {
          this.notifySuccess(res.message)
          this.getListRemoteRequest(this.page, this.size)
          this.showFormMessage = false
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
    },
    handleInfo(index, row) {
      this.titlePopup = 'View Remote Request'
      this.dialogMode = 'detail'
      this.checkIn = Object.assign({}, row)
      if (this.checkIn.image_url) {
        this.getAvatar(this.checkIn.image_url)
      } else {
        this.dialogFormWithInput = true
      }
      // this.checkIn.check_time = this.checkIn.check_time
      //   ? this.showDateTime(this.checkIn.check_time, 'DD/MM/YYYY HH:mm:ss')
      //   : ''
      this.rowSelected = index + 1
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.notifySuccess('coding')
  
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.notifySuccess('coding')
  
        }
      })
    },
    handleDelete(index, row) {
      console.log(index)
      console.log(row)
      this.$confirm(
        this.$t('This will permanently delete the row data. Continue?'),
        this.$t('Confirm'),
        {
          confirmButtonText: this.$t('OK'),
          cancelButtonText: this.$t('Cancel'),
          type: 'warning',
        }
      ).then(() => {
        this.notifySuccess('coding')
  
      })
    },
 
  },
}
</script>
