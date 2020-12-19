<template>
  <section-block title="Exception Request">
    <div>
      <section class="group-filter">
        <div class="pc-hidden">
          <el-input
            v-model="fullnameSearch"
            :disabled="$authInfo.role() == constant.Role.STAFF"
            placeholder="Account"
            class="input-search"
            clearable
          />

          <el-input
            v-model="groupSearch"
            :disabled="
              $authInfo.role() == constant.Role.STAFF ||
              $authInfo.role() == constant.Role.MANAGER
            "
            placeholder="Group"
            class="input-search"
            clearable
          />

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
            @click="searchException()"
          >
            <i class="el-icon-search"></i>
          </el-button>

          <el-button
            class="button-delete-multi"
            type="primary"
            @click="getListException(page, size)"
          >
            <i class="el-icon-refresh"></i>
          </el-button>
          <el-button
            class="gr-button"
            @click="handleCreate()"
            v-if="$authInfo.role() !== constant.Role.MANAGER"
          >
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
        <!-- <el-table-column
          :selectable="canSelectRow"
          type="selection"
          class-name="text-center"
          width="60px"
        />
        <el-table-column class-name="text-center" :label="$t('Date')">
          <template slot-scope="{ row }">
            {{
              row.created_at ? showDateTime(row.update_at, 'DD/MM/YYYY') : ''
            }}
          </template>
        </el-table-column> -->
        <el-table-column
          class-name="text-center"
          prop="stt"
          :label="$t('STT')"
          width="80px"
        />
        <el-table-column
          class-name="text-left"
          prop="title"
          sortable
          :label="$t('Title')"
        />
        <el-table-column
          class-name="text-left"
          prop="account_sent"
          sortable
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
        />

        <el-table-column
          class-name="text-left"
          prop="content"
          :label="$t('Content')"
        />
        <el-table-column
          class-name="text-left"
          prop="status"
          sortable
          :label="$t('Status')"
        />
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
                scope.row.account_sent !== user.username
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
                scope.row.account_sent !== user.username
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
          <el-form ref="dataForm" :rules="rules" :model="exception">
            <el-row :gutter="20">
              <el-col :span="24">
                <div class="form-group row">
                  <label class="col-sm-2 col-form-label">Title</label>
                  <el-form-item prop="title" class="col-sm-9">
                    <el-input
                      v-model="exception.title"
                      :disabled="isDetailForm"
                    />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Fullname</label>
                  <el-form-item prop="full_name" class="col-sm-6">
                    <el-input v-model="user.full_name" disabled />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Start Date</label>
                  <el-form-item prop="start_date" class="col-sm-6">
                    <el-date-picker
                      v-model="exception.start_date"
                      type="date"
                      placeholder="Pick a day"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      :disabled="isDetailForm"
                    />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Request type</label>
                  <el-form-item prop="type" class="col-sm-6">
                    <el-select
                      v-model="exception.type"
                      placeholder="Abnormal type"
                      :disabled="isDetailForm"
                    >
                      <el-option
                        v-for="(item, index) in abnormal_types"
                        :key="index"
                        :label="item.value"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Message</label>
                  <el-form-item prop="response_msg" class="col-sm-6">
                    <el-input v-model="exception.response_msg" type="textarea" disabled />
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
                      v-model="exception.end_date"
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
                      v-model="exception.account_receiver"
                      placeholder="account receiver"
                      :disabled="isDetailForm"
                    >
                      <el-option
                        v-for="(item, index) in account_receivers"
                        :key="index"
                        :label="item.username"
                        :value="item.username"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Status</label>
                  <el-form-item prop="status" class="col-sm-6">
                    <el-input v-model="exception.status" disabled />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <div
              v-if="exception.type === 'Parttime working'"
              class="form-group row"
            >
              <label class="col-sm-2 col-form-label">Choose day</label>
              <el-form-item prop="type" class="col-sm-9">
                <el-checkbox-group v-model="checkList" :disabled="isDetailForm">
                  <el-checkbox
                    v-for="(item, index) in checkListData"
                    :key="index"
                    :label="item"
                  />
                </el-checkbox-group>
              </el-form-item>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Note</label>
              <el-form-item prop="title" class="col-sm-9">
                <el-input
                  v-model="exception.content"
                  :disabled="isDetailForm"
                  type="textarea"
                />
              </el-form-item>
            </div>
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
.el-checkbox {
  margin-right: 35px;
}
.form-group {
  margin-bottom: 0px;
}
.el-dialog {
  margin-top: 10px;
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
.note {
  text-align: left;
  margin-left: 20px;
  font-weight: bold;
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
label {
  text-align: center;
}

.date-picker {
  width: 150px;
   margin-bottom: 10px;
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

.table-special {
  .el-table th > .cell {
    color: unset !important;
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
    const compareDate = (rule, value, callback) => {
      if (
        this.exception.start_date != null &&
        this.exception.end_date != null
      ) {
        if (
          moment(this.exception.start_date).format('YYYY-MM-DD') >
          moment(this.exception.end_date).format('YYYY-MM-DD')
        ) {
          callback(new Error('Please select an end date after the start date'))
        } else {
          callback()
        }
      }
    }
    return {
      checkListData: [
        'M-Mon',
        'M-Tue',
        'M-Wed',
        'M-Thu',
        'M-Fri',
        'A-Mon',
        'A-Tue',
        'A-Wed',
        'A-Thu',
        'A-Fri',
      ],
      constant: Constant,
      checkList: [],
      tableData: [],
      groupSearch: '',
      fullnameSearch: '',
      startDate: '',
      endDate: '',
      dialogFormWithInput: false,
      showFormMessage: false,
      titlePopup: '',
      dialogMode: '',
      isDetailForm: false,
      groups: [],
      projects: [],
      account_receivers: [],
      abnormal_types: [],
      addMemberToGroup: {
        checkedMembers: [],
      },
      message: {
        response_msg: '',
      },
      user: {
        account_sent: '',
        account_receiver: '',
        groupCompany: '',
      },
      exception: {
        id: undefined,
        title: '',
        account_sent: '',
        account_receiver: '',
        groupCompany: '',
        content: '',
        start_date: '',
        end_date: '',
        type: '',
      },
      rules: {
        title: this.validateRequired('title'),
        account_sent: this.validateRequired('account_sent'),
        account_receiver: this.validateRequired('account_receiver'),
        project: this.validateRequired('project'),
        start_date: this.validateRequired('start_date'),
        end_date: [
          {
            required: true,
            whitespace: true,
            message: this.$t(`Please input end_date!`),
            trigger: 'change',
          },
          {
            validator: compareDate,
            trigger: 'change',
          },
        ],
        type: this.validateRequired('type'),
        mailCC: this.validateEmailAddress(),
      },
      rowSelected: null,
      multipleSelection: [],
      totalPages: 1,
      page: 1,
      size: undefined,
    }
  },
  watch: {
    'exception.type'() {
      this.checkList = []
    },
  },
  created() {
    const query = this.$route.query
    if (query.page) {
      this.page = query.page
    }
    if (query.size) {
      this.size = query.size
    }
    this.getListException(this.page, this.size)
    this.getUserInfo()
    this.getListExceptionalCaseType()
  },
  methods: {
    canSelectRow(row) {
      return row.account_sent === this.user.username && row.status == 'Pending'
    },
    async getListException(page, size) {
      let params = {
        page: page - 1,
        size: size,
      }
      await this.$services.exception.getListException(
        params,
        (response) => {
          this.tableData = response.data
          this.totalPages = response.totalPages
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
    },
    async getListExceptionalCaseType() {
      await this.$services.exception.getListExceptionalCaseType(
        (response) => {
          this.abnormal_types = response.listExceptionalCaseType
          this.account_receivers = response.listReceiver
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
    },
    async getUserInfo() {
      await this.$services.common.getUserInfo(
        (response) => {
          this.user = response.data
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    async getListUser() {
      if (this.$authInfo.role() === Constant.Role.STAFF) {
        await this.$services.exception.getListAccountReceiver(
          (response) => {
            if (response.listData && response.listData.length > 0) {
              this.account_receivers = response.listData.map((item) => {
                return { label: item, value: item }
              })
              this.account_receivers
            }
          },
          (err) => this.notifyError(err.error.error)
        )
      } else {
        await this.$services.user.getListUser(
          {},
          (response) => {
            if (response.data && response.data.length > 0) {
              this.account_receivers = response.data.map((item) => {
                return { label: item.username, value: item.username }
              })
            }
          },
          (err) => this.notifyError(err.error.error)
        )
      }
    },
    async searchException() {
      this.startLoading()
      await this.$services.exception.searchException(
        {
          userName: this.fullnameSearch,
          groupName: this.groupSearch,
          startDate: this.startDate,
          endDate: this.endDate,
        },
        (response) => {
          if (response.data && response.data.length > 0) {
            this.tableData = response.data
            this.totalPages = response.totalPages
          } else {
            this.tableData = []
            this.totalPages = 0
          }
          this.endLoading()
        },
        (err) => {
          this.tableData = []
          this.totalPages = 0
          this.endLoading()
          this.notifyError(err.error.error)
        }
      )
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    changePageData(page) {
      this.getListException(page, this.size)
      this.page = page
      const roleValue = this.$authInfo.roleValue()
      this.$router.push({
        name: `${roleValue}-request-exception`,
        query: { page, size: this.size },
      })
    },
    resetUserData() {
      this.exception = {
        id: undefined,
        title: '',
        account_sent: '',
        account_receiver: '',
        groupCompany: '',
        content: '',
        start_date: '',
        end_date: '',
        type: '',
      }
    },
    handleCreate() {
      this.isDetailForm = false
      this.dialogMode = 'create'
      this.titlePopup = 'Create Exception Case Request'
      this.dialogFormWithInput = true
      this.resetUserData()
      this.checkList = []
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async handleUpdate(index, row) {
      this.exception = Object.assign({}, row)
      this.checkList = await this.progressListTime(
        this.exception.part_time_infor
      )
      this.isDetailForm = false
      this.dialogMode = 'update'
      this.titlePopup = 'Edit Exception Case Request'
      this.dialogFormWithInput = true
      this.rowSelected = index + 1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleInfo(index, row) {
      this.titlePopup = 'View Exception Case Request'
      this.dialogMode = 'detail'
      this.isDetailForm = true
      this.dialogFormWithInput = true
      this.exception = Object.assign({}, row)
      this.rowSelected = index + 1
    },
    progressListTime(data) {
      return data.split(',').filter((item) => item.trim() !== '' ?? item.trim())
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$services.exception.createException(
            {
              ...this.exception,
              account_sent: this.user.username,
              groupCompany: this.user.groupCompanyName,
              part_time_infor_list: [...this.checkList],
            },
            (res) => {
              this.getListException(this.page, this.size)
              this.dialogFormWithInput = false
              this.addMemberToGroup.checkedMembers = []
              this.checkList = []
              this.notifySuccess(res.message)
            },
            (err) => {
              this.notifyError(err.error.error)
            }
          )
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.startLoading()
          this.$services.exception.updateException(
            {
              ...this.exception,
              account_sent: this.user.username,
              groupCompany: this.user.groupCompanyName,
              part_time_infor_list: [...this.checkList],
            },
            (res) => {
              this.getListException(this.page, this.size)
              this.dialogFormWithInput = false
              this.addMemberToGroup.checkedMembers = []
              this.checkList = []
              this.notifySuccess(res.message)
              this.endLoading()
            },
            (err) => {
              this.endLoading()
              this.notifyError(err.error.error)
            }
          )
        }
      })
    },
    handleAccept(index, row) {
      const data = Object.assign({}, row)
      this.rowSelected = index + 1

      this.$services.exception.acceptException(
        data,
        (res) => {
          this.notifySuccess(res.message)
          this.getListException(this.page, this.size)
        },
        (err) => {
          this.notifyError(err.error.error)
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
      this.$services.exception.rejectException(
        { ...this.dataReject, response_msg: this.message.response_msg },
        (res) => {
          this.notifySuccess(res.message)
          this.getListException(this.page, this.size)
          this.showFormMessage = false
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
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
        this.$services.exception.deleteException(
          row.ex_id,
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
          this.$services.exception.deleteException(
            element.ex_id,
            (res) => {
              const data = this.tableData.filter(
                (item) => item.ex_id !== element.ex_id
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
