<template>
  <section-block title="Absence Request">
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
          <el-select
            v-model="groupSearch"
            class="table"
            placeholder="Group"
            :disabled="
              $authInfo.role() == constant.Role.STAFF ||
              $authInfo.role() == constant.Role.MANAGER
            "
          >
            <el-option
              v-for="(item, index) in groups"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <el-date-picker
            v-model="startDate"
            type="date"
            placeholder="Start date"
            format="dd-MM-yyyy"
            value-format="yyyy-MM-dd"
            class="date-picker"
          />

          <el-date-picker
            v-model="endDate"
            type="date"
            placeholder="End date"
            format="dd-MM-yyyy"
            value-format="yyyy-MM-dd"
            class="date-picker"
          />

          <el-button
            class="button-delete-multi"
            type="primary"
            @click="searchAbsenceRequest()"
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
          <el-button
            v-if="$authInfo.role() !== constant.Role.MANAGER"
            class="gr-button"
            @click="handleCreate()"
          >
            {{ $t('Add request') }}
          </el-button>
        </div>
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
          width="60px"
        />
        <el-table-column
          class-name="text-left"
          prop="title"
          :label="$t('Title')"
          width="200px"
        />
        <el-table-column
          class-name="text-left"
          prop="account_sent"
          :label="$t('Account')"
        />
        <el-table-column
          class-name="text-left"
          prop="groupCompany"
          :label="$t('Group')"
        />
        <el-table-column
          class-name="text-left"
          prop="type"
          :label="$t('Request Type')"
          sortable
          width="170px"
        />
        <el-table-column class-name="text-center"  :label="$t('Start Date')">
          <template slot-scope="{ row }">
            {{
              row.start_date ? showDateTime(row.start_date, 'DD/MM/YYYY') : ''
            }}
          </template>
        </el-table-column>
        <el-table-column class-name="text-center" :label="$t('End Date')">
          <template slot-scope="{ row }">
            {{ row.end_date ? showDateTime(row.end_date, 'DD/MM/YYYY') : '' }}
          </template>
        </el-table-column>
        <!-- <el-table-column class-name="text-center" :label="$t('Status')">
          <template slot-scope="{ row }">
            {{ row.stt ? row.stt == 1 ? 'Oke' :'ko oke': '' }}
          </template>
        </el-table-column> -->
        <el-table-column
          class-name="text-left"
          prop="status"
          sortable
          :label="$t('Status')"
        />
          <!-- <template slot-scope="{ row }">
            {{ row.status !== null ? row.status : '' }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          class-name="text-left"
          prop="response_msg"
          :label="$t('Message')"
        /> -->
        <el-table-column
          class-name="text-center"
          prop="action"
          :label="$t('Action')"
          width="110px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="
                scope.row.status == 'Pending' &&
                scope.row.account_sent !== user.username && 
                $authInfo.role() !== constant.Role.HR
              "
              class="button-action"
              type="warning"
              @click="handleAccept(scope.$index, scope.row)"
            >
              <i class="el-icon-check"></i>
            </el-button>
            <el-button
              v-if="
                scope.row.status == 'Pending' &&
                scope.row.account_sent !== user.username&& 
                $authInfo.role() !== constant.Role.HR
              "
              class="button-action"
              type="danger"
              @click="handleReject(scope.$index, scope.row)"
            >
              <i class="el-icon-close"></i>
            </el-button>
            <el-button
              v-if="
                $authInfo.role() !== constant.Role.MANAGER &&
                scope.row.status == 'Pending' &&
                scope.row.account_sent === user.username
              "
              class="button-action"
              type="warning"
              @click="handleUpdate(scope.$index, scope.row)"
            >
              <i class="el-icon-edit-outline"></i>
            </el-button>
            <el-button
              v-if="
                $authInfo.role() !== constant.Role.MANAGER &&
                scope.row.status == 'Pending' &&
                scope.row.account_sent === user.username
              "
              class="button-action"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
              <i class="el-icon-delete"></i>
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
          width="50%"
        >
          <el-form ref="dataForm" :rules="rules" :model="request">
            <el-row :gutter="20">
              <el-col :span="24">
                <div class="form-group row">
                  <label class="col-sm-2 col-form-label">Title</label>
                  <el-form-item prop="title" class="col-sm-9">
                    <el-input
                      v-model="request.title"
                      :disabled="isDetailForm"
                    />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Full Name</label>
                  <el-form-item prop="full_name" class="col-sm-6">
                    <el-input v-model="user.full_name" disabled />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Start Date</label>
                  <el-form-item prop="start_date" class="col-sm-6">
                    <el-date-picker
                      v-model="request.start_date"
                      type="date"
                      placeholder="Pick a day"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      :disabled="isDetailForm"
                    />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Request Type</label>
                  <el-form-item prop="type" class="col-sm-6">
                    <el-select
                      v-model="request.type"
                      placeholder="Absence type"
                      :disabled="isDetailForm"
                    >
                      <el-option
                        v-for="item in listTypes"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div
                  v-if="request.type === 'Check in/out'"
                  class="form-group row"
                >
                  <div class="col-sm-3 col-form-label">
                    <el-checkbox
                      v-model="late_checked"
                      :disabled="isDetailForm"
                      @change="request.late_time = ''"
                    >
                      Late
                    </el-checkbox>
                  </div>
                  <label class="col-sm-2 col-form-label">Time</label>
                  <el-form-item prop="late_time" class="col-sm-5">
                    <el-time-select
                      v-model="request.late_time"
                      :disabled="!late_checked || isDetailForm"
                      placeholder="Select late_time"
                      :picker-options="{
                        start: '06:00',
                        step: '00:15',
                        end: '23:45',
                      }"
                    />
                  </el-form-item>
                  <div class="col-sm-3 col-form-label">
                    <el-checkbox
                      v-model="soon_checked"
                      :disabled="isDetailForm"
                      @change="request.soon_time = ''"
                    >
                      Soon
                    </el-checkbox>
                  </div>
                  <label class="col-sm-2 col-form-label">Time</label>
                  <el-form-item prop="soon_time" class="col-sm-5">
                    <el-time-select
                      v-model="request.soon_time"
                      :disabled="!soon_checked || isDetailForm"
                      placeholder="Select soon_time"
                      :picker-options="{
                        start: '06:00',
                        step: '00:15',
                        end: '23:45',
                      }"
                    />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Message</label>
                  <el-form-item prop="response_msg" class="col-sm-6">
                    <el-input
                      v-model="request.response_msg"
                      type="textarea"
                      disabled
                    />
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Group</label>
                  <el-form-item prop="groupCompanyName" class="col-sm-6">
                    <el-input v-model="user.groupCompanyName" disabled />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">End Date</label>
                  <el-form-item prop="end_date" class="col-sm-6">
                    <el-date-picker
                      v-model="request.end_date"
                      type="date"
                      placeholder="Pick a day"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      :disabled="isDetailForm"
                    />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Receiver</label>
                  <el-form-item prop="account_receiver" class="col-sm-6">
                    <el-select
                      v-model="request.account_receiver"
                      placeholder="account receiver"
                      :disabled="isDetailForm"
                    >
                      <el-option
                        v-for="(item, index) in account_receivers"
                        :key="index"
                        :label="item.label.username"
                        :value="item.value.username"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Status</label>
                  <el-form-item prop="status" class="col-sm-6">
                    <el-input v-model="request.status" disabled />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-form-item label="Note">
              <el-input
                v-model="request.content"
                :disabled="isDetailForm"
                type="textarea"
              ></el-input>
            </el-form-item>
          </el-form>
          <hr class="mb-0" />
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormWithInput = false">Close</el-button>
            <el-button
              v-if="dialogMode !== 'detail'"
              type="primary"
              @click="dialogMode === 'create' ? createData() : updateData()"
            >
              Submit
            </el-button>
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
.el-select {
  width: 100%;
}
.el-date-editor {
  width: 100%;
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
.form-group {
  margin-bottom: 10px;
}
.demo-input-suffix .el-input {
  width: 80px;
}

.el-form-item__label {
  text-align: left;
}

.line {
  margin-top: -30px;
}
.table {
  width: 150px;
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
label {
  text-align: center;
}

@media screen and (max-width: 1370px) {
  .input-search {
    width: 120px;
    margin-bottom: 10px;
  }
  .date-picker {
    width: 140px;
    margin-bottom: 10px;
  }
}
</style>

<script>
import SimplePagination from '~/components/pagination/SimplePagination'
import validate from '@/helpers/custom-rules-validate'
import moment from 'moment'
import Constant from '~/constant'

export default {
  components: { SimplePagination },
  mixins: [validate],
  layout: 'admin',
  middleware: 'auth',
  data() {
    const typeChoose = (rule, value, callback) => {
      if (this.radioType === 1 && !value) {
        callback(new Error('Please choose type'))
        this.late_checked = false
        this.soon_checked = false
      } else {
        callback()
      }
    }
    const typeChooseSoonTime = (rule, value, callback) => {
      if (this.radioType !== 1 && !value && this.soon_checked) {
        callback(new Error('Please choose soon time'))
      } else {
        callback()
      }
    }
    const typeChooseLateTime = (rule, value, callback) => {
      if (this.radioType !== 1 && !value && this.late_checked) {
        callback(new Error('Please choose late time'))
      } else {
        callback()
      }
    }
    const compareDate = (rule, value, callback) => {
      if (this.request.start_date != null && this.request.end_date != null) {
        if (
          moment(this.request.start_date).format('YYYY-MM-DD') >
            moment(this.request.end_date).format('YYYY-MM-DD') &&
          !this.isDetailForm
        ) {
          callback(new Error('Please select an end date after the start date'))
        } else {
          callback()
        }
      }
    }
    return {
      constant: Constant,
      disable: false,
      tableData: [],
      groupSearch: '',
      startDate: '',
      endDate: '',
      groupID: '',
      userName: '',
      projectName: '',
      dialogFormWithInput: false,
      showFormMessage: false,
      dataReject: {},
      titlePopup: '',
      dialogMode: '',
      groups: [],
      account_receivers: [],
      isDetailForm: false,
      listTypes: [],
      message: {
        response_msg: '',
      },
      checkIn: {
        full_name: '',
        groupCompany: '',
        sitename: '',
      },
      user: {
        account_sent: '',
        account_receiver: '',
        groupCompany: '',
      },
      request: {
        account_sent: this.$authInfo.name(),
        title: '',
        reason: '',
        groupCompany: '',
        late_time: '',
        soon_time: '',
        start_date: '',
        end_date: '',
        account_receiver: '',
        cc_mail_ids: '',
        content: '',
        response_msg: '',
        status: '',
        type: '',
      },
      radioType: 1,
      late_checked: false,
      soon_checked: false,
      rules: {
        title: this.validateRequired('title'),
        groupCompany: this.validateRequired('groupCompany'),
        start_date: this.validateRequired('start date'),
        end_date: [
          {
            required: true,
            whitespace: true,
            message: this.$t(`Please input end date!`),
            trigger: 'change',
          },
          {
            validator: compareDate,
            trigger: 'change',
          },
        ],
        account_receiver: this.validateRequired('account'),
        cc_mail_ids: this.validateEmailAddress(),
        type: { validator: typeChoose, trigger: 'blur' },
        soon_time: { validator: typeChooseSoonTime, trigger: 'blur' },
        late_time: { validator: typeChooseLateTime, trigger: 'blur' },
      },
      rowSelected: null,
      multipleSelection: [],
      totalPages: 1,
      page: 1,
      size: undefined,
    }
  },
  watch: {
    radioType(value) {
      if (value == 1) {
        this.late_checked = false
        this.soon_checked = false
        this.disable = false
      }
      if (value == 2) {
        this.disable = true
      }
    },
    // soon_checked(val) {
    //   if (!val) {
    //     this.request.soon_time = ''
    //   }
    // },
    // late_checked(val) {
    //   if (!val) {
    //     this.request.late_time = ''
    //   }
    // },
  },
  created() {
    const query = this.$route.query

    if (query.page) {
      this.page = query.page
    }
    if (query.size) {
      this.size = query.size
    }
    this.getListGroupAbsence()
    this.getListAbsenceRequest(this.page, this.size)
    this.getTypeAbsenceRequest()
    this.getUserInfo()
  },
  methods: {
    async fetch() {
        this.userName = ''
        this.groupSearch = ''
        this.startDate = ''
        this.endDate = ''
        await this.getListAbsenceRequest(1, this.size)
        this.page = 1
        this.$router.push({name: this.$route.name, query: {
          page: 1
        }})
      },
     async getListAbsenceRequest(page, size) {
       this.tableData = []
       let params = {
        page: page - 1,
        size: size
      }
      if (!this.userName.length == 0 || this.userName.trim()) {
        params.userName = this.userName.trim()
      }
       if(this.groupSearch !== '' && !this.groupSearch == 0 ) {
        params.groupId = this.groupSearch
      }
      if(this.startDate && this.startDate.trim() !== '') {
        params.startDate = this.startDate
      }
      if(this.endDate && this.endDate.trim() !== '') {
        params.endDate = this.endDate
      }
      if (this.$authInfo.roleValue() === 'staff') {
        await this.$services.request.getListAbsenceRequest(
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
        await this.$services.request.getListAbsenceRequest(
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
          this.user = response.data
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    async getTypeAbsenceRequest() {
      await this.$services.request.getTypeAbsenceRequest(
        (response) => {
          this.listTypes = response.absenceType
          this.account_receivers = response.listReceiver.map((item) => {
            return { label: item, value: item }
          })
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    async getListGroupAbsence() {
      await this.$services.request.getListGroupAbsence(
        (response) => {
          if (response.listData && response.listData.length > 0) {
            this.groups = response.listData.map((item) => {
              return { label: item.name, value: Number(item.group_id) }
            })
          }
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    async searchAbsenceRequest() {
      this.startLoading()
      let params = {
        page: 0,
        size: this.size
      }
     if(this.userName.trim() !== '') {
        params.userName = this.userName
      }
      if(this.groupSearch !== '' && !this.groupSearch == 0 ) {
        params.groupId = this.groupSearch
      }
      if(this.startDate && this.startDate.trim() !== '') {
        params.startDate = this.startDate
      }
      if(this.endDate && this.endDate.trim() !== '') {
        params.endDate = this.endDate
      }
      await this.$services.request.getListAbsenceRequest(
        params,
        (response) => {
          console.log(0)
          if (response.data && response.data.length > 0) {
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    changePageData(page) {
      this.getListAbsenceRequest(page, this.size)
      this.page = page
      const roleValue = this.$authInfo.roleValue()
      this.$router.push({
        name: `${roleValue}-request-absence`,
        query: { page, size: this.size },
      })
    },
    resetUserData() {
      this.request = {
        account_sent: this.$authInfo.username(),
        title: '',
        reason: '',
        groupCompany: '',
        late_time: '',
        soon_time: '',
        start_date: '',
        end_date: '',
        account_receiver: '',
        cc_mail_ids: '',
        content: '',
        response_msg: '',
        status: '',
        radio: 1,
        type: '',
      }
    },
    handleCreate() {
      this.isDetailForm = false
      this.dialogMode = 'create'
      this.titlePopup = 'Create Absence Request'
      this.dialogFormWithInput = true
      this.resetUserData()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleAccept(index, row) {
      const data = Object.assign({}, row)
      this.rowSelected = index + 1

      this.$services.request.acceptAbsenceRequest(
        data,
        (res) => {
          this.notifySuccess(res.message)
          this.getListAbsenceRequest(this.page, this.size)
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
    },
    handleReject(index, row) {
      const data = Object.assign({}, row)
      this.dataReject = data
      this.showFormMessage = true
      this.rowSelected = index + 1
    },
    rejectItem() {
      this.$services.request.rejectAbsenceRequest(
        { ...this.dataReject, response_msg: this.message.response_msg },
        (res) => {
          this.notifySuccess(res.message)
          this.getListAbsenceRequest(this.page, this.size)
          this.showFormMessage = false
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
    },
    handleInfo(index, row) {
      this.titlePopup = 'View Absence Request'
      this.dialogMode = 'detail'
      this.isDetailForm = true
      this.dialogFormWithInput = true
      this.request = Object.assign({}, row)
      this.rowSelected = index + 1
    },
    handleUpdate(index, row) {
      this.request = Object.assign({}, row)
      this.isDetailForm = false
      this.dialogMode = 'update'
      this.titlePopup = 'Edit Absence Request'
      this.soon_checked = false
      this.late_checked = false
      if (row.type == 'Check in/out') {
        this.radioType = 2
        if (row.soon_time) {
          this.soon_checked = true
        }
        if (row.late_time) {
          this.late_checked = true
        }
      } else {
        this.radioType = 1
      }
      this.dialogFormWithInput = true
      this.rowSelected = index + 1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = this.request
          if (data.type !== 'Check in/out') {
            delete data.late_time
            delete data.soon_time
          } else {
            data.type = 'Check in/out'
            if (!this.request.soon_time) {
              delete data.soon_time
            }
            if (!this.request.late_time) {
              delete data.late_time
            }
          }
          console.log(data)
          this.$services.request.createAbsenceRequest(
            data,
            (res) => {
              this.getListAbsenceRequest(this.page, this.size)
              this.dialogFormWithInput = false
              this.notifySuccess(res.message)
              this.soon_checked = false
              this.late_checked = false
            },
            (err) => {
              console.log(1)
              this.notifyError(err.error.error)
            }
          )
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = this.request
          if (this.radioType === 1) {
            delete data.late_time
            delete data.soon_time
          } else {
            data.type = 'Check in/out'
            if (!this.request.soon_time) {
              delete data.soon_time
            }
            if (!this.request.late_time) {
              delete data.late_time
            }
          }
          this.$services.request.updateAbsenceRequest(
            data,
            (res) => {
              this.getListAbsenceRequest(this.page, this.size)
              this.dialogFormWithInput = false
              this.notifySuccess(res.message)
              this.soon_checked = false
              this.late_checked = false
            },
            (err) => {
              this.notifyError(err.error.error)
            }
          )
        }
      })
    },
    handleDelete(index, row) {
      this.$confirm(
        this.$t('This will permanently delete the row data. Continue?'),
        this.$t('Confirm'),
        {
          confirmButtonText: this.$t('OK'),
          cancelButtonText: this.$t('Cancel'),
          type: 'warning',
        }
      ).then(() => {
        this.$services.request.deleteRequest(
          row.id,
          (res) => {
            this.tableData.splice(index, 1)
            this.notifySuccess(res.message)
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
      })
    },
    handleDeleteMulti() {
      this.$confirm(
        this.$t('This will delete all the row selected. Continue?'),
        this.$t('Confirm'),
        {
          confirmButtonText: this.$t('OK'),
          cancelButtonText: this.$t('Cancel'),
          type: 'warning',
        }
      ).then(() => {
        for (let index = 0; index < this.multipleSelection.length; index++) {
          const element = this.multipleSelection[index]
          this.$services.request.deleteRequest(
            element.id,
            (res) => {
              const data = this.tableData.filter(
                (item) => item.id !== element.id
              )
              this.tableData = data
              this.notifySuccess(res.message)
            },
            (err) => {
              this.notifyError(err.error.error)
            }
          )
        }
      })
    },
  },
}
</script>
