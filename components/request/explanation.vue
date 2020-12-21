<template>
  <section-block title="Explanation Request">
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
            @click="searchExplanation()"
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
          width="80px"
        />
        <el-table-column
          class-name="text-left"
          prop="account_sent"
          sortable
          :label="$t('Account')"
        />
        <el-table-column
          class-name="text-left"
          prop="title"
          sortable
          :label="$t('Title')"
        />
    
        <el-table-column class-name="text-center" :label="$t('Date')">
          <template slot-scope="{ row }">
            {{ row.abnormal_date ? showDateTime(row.abnormal_date, 'DD/MM/YYYY') : '' }}
          </template>
        </el-table-column>
        <el-table-column
          class-name="text-center"
          prop="explanInTime"
          :label="$t('In Time')"
        />
        <el-table-column
          class-name="text-center"
          prop="explanOutTime"
          :label="$t('Out Time')"
        />
        <el-table-column
          class-name="text-left"
          prop="type"
          :label="$t('Abnormal Type')"
        />
        <el-table-column
          class-name="text-center"
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
        
          <div v-if="dialogMode === 'detail'">
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Title</label>
              <div class="col-sm-8 data-detail">
                {{ explanation.title }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Account</label>
              <div class="col-sm-8 data-detail">
                {{ explanation.account_sent }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Abnormal Type</label>
              <div class="col-sm-8 data-detail">
                {{ explanation.type }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Explan In Time</label>
              <div class="col-sm-8 data-detail">
                {{ explanation.explanInTime }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Explan Out Time</label>
              <div class="col-sm-8 data-detail">
                {{ explanation.explanOutTime }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Status</label>
              <div class="col-sm-8 data-detail">
                {{ explanation.status }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Note</label>
              <div class="col-sm-8 data-detail">
                {{ explanation.content }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Message</label>
              <div class="col-sm-8 data-detail">
                {{ explanation.response_msg }}
              </div>
            </div>
          </div>
        <el-form v-else ref="dataForm" :rules="rules" :model="request">
            <el-row :gutter="20">
              <el-col :span="24">
                <div class="form-group row">
                  <label class="col-sm-2 col-form-label">Title</label>
                  <el-form-item prop="title" class="col-sm-9">
                    <el-input v-model="explanation.title" />
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
                  <label class="col-sm-4 col-form-label">Request type</label>
                  <el-form-item prop="abnormalType" class="col-sm-6">
                    <el-input v-model="explanation.type" disabled />
                  </el-form-item>
                </div>

                
                 <div class="form-group row">
                  <label class="col-sm-4 col-form-label">
                    Explain In <span>*</span>
                  </label>
                  <el-form-item prop="explanInTime" class="col-sm-4">
                    <el-time-select
                      v-model="explanation.explanInTime"
                      placeholder="Explain In"
                      class="time"
                      :picker-options="{
                        start: '06:00',
                        step: '00:15',
                        end: '23:45',
                      }"
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
                  <label class="col-sm-4 col-form-label">Receiver</label>
                  <el-form-item prop="account_receiver" class="col-sm-6">
                    <el-select
                      v-model="explanation.account_receiver"
                      placeholder="account receiver"
                    >
                      <el-option
                        v-for="(item, index) in account_receivers"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">
                    Explain Out <span>*</span>
                  </label>
                  <el-form-item prop="explanOutTime" class="col-sm-4">
                    <el-time-select
                      v-model="explanation.explanOutTime"
                      placeholder="Explain Out"
                      class="time"
                      :picker-options="{
                        start: '06:00',
                        step: '00:15',
                        end: '23:45',
                      }"
                    />
                  </el-form-item>
                </div>
               
              </el-col>
            </el-row>

            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Reason</label>
              <el-form-item prop="title" class="col-sm-9">
                <el-input v-model="explanation.content" type="textarea" />
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
          <el-form ref="dataForm" :rules="rules" :model="message">
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
.time {
  width: 167%;
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
label {
  text-align: center;
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
import Constant from '~/constant'

export default {
  components: { SimplePagination },
  mixins: [validate],
  layout: 'admin',
  middleware: 'auth',
  data() {
    return {
      constant: Constant,
      tableData: [],
      groupSearch: '',
      userName: '',
      startDate: '',
      endDate: '',
      dialogFormWithInput: false,
      showFormMessage: false,
      titlePopup: '',
      dataReject: {},
      dialogMode: '',
      message: {
        response_msg: '',
      },
      groups: [],
      projects: [],
      account_receivers: [],
      abnormal_types: [
        'Late',
        'Early',
        'Check Missing',
        'Morning absence',
        'Afternoon absence',
        'Day absence',
      ],
      addMemberToGroup: {
        checkedMembers: [],
      },
      user: {
        account_sent: '',
        account_receiver: '',
        groupCompany: '',
      },
      explanation: {
        id: undefined,
        title: '',
        account_sent: '',
        account_receiver: '',
        groupCompany: '',
        content: '',
        type: '',
        mail_with: '',
      },
      rules: {
        title: this.validateRequired('title'),
        account_sent: this.validateRequired('account_sent'),
        account_receiver: this.validateRequired('account_receiver'),
        project: this.validateRequired('project'),
        type: this.validateRequired('type'),
        mail_with: this.validateEmailAddress(),
        explanInTime: this.validateRequired('explan in time'),
        explanOutTime: this.validateRequired('explan out time'),
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
    this.getListExplanation(this.page, this.size)
    // this.getListUser()
    this.getUserInfo()
  },
  methods: {
    fetch() {
        this.userName = ''
        this.groupSearch = ''
        this.startDate = ''
        this.endDate = ''
        this.getListExplanation(1, this.size)
      },
    canSelectRow(row) {
      return row.account_sent === this.user.username && row.status == 'Pending'
    },
    async getListExplanation(page, size) {
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
        await this.$services.explanation.getListExplanation(
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
        await this.$services.explanation.getListExplanation(
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
    async getListUser() {
      if (this.$authInfo.role() === Constant.Role.STAFF) {
        await this.$services.explanation.getListAccountReceiver(
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
    async searchExplanation() {
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
      await this.$services.explanation.getListExplanation(
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    changePageData(page) {
      this.getListExplanation(page, this.size)
      this.page = page
      const roleValue = this.$authInfo.roleValue()
      this.$router.push({
        name: `${roleValue}-request-explanation`,
        query: { page, size: this.size },
      })
    },
    resetUserData() {
      this.explanation = {
        id: undefined,
        title: '',
        account_sent: '',
        account_receiver: '',
        groupCompany: '',
        content: '',
        type: '',
        mail_with: '',
      }
    },
    handleInfo(index, row) {
      this.titlePopup = 'View'
      this.dialogMode = 'detail'
      this.dialogFormWithInput = true
      this.explanation = Object.assign({}, row)
      this.rowSelected = index + 1
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$services.explanation.createExplanation(
            {
              ...this.explanation,
              account_sent: this.user.username,
              groupCompany: this.user.groupCompanyName,
              explDate: new Date(),
            },
            (res) => {
              this.getListExplanation(this.page, this.size)
              this.dialogFormWithInput = false
              this.addMemberToGroup.checkedMembers = []
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
          this.$services.explanation.updateExplanation(
            {
              ...this.explanation,
              account_sent: this.user.username,
              groupCompany: this.user.groupCompanyName,
            },
            (res) => {
              this.getListExplanation(this.page, this.size)
              this.dialogFormWithInput = false
              this.addMemberToGroup.checkedMembers = []
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
    handleUpdate(index, row) {
      this.exception = Object.assign({}, row)
      this.dialogMode = 'update'
      this.titlePopup = 'Edit Explanation'
      this.dialogFormWithInput = true
      this.rowSelected = index + 1
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    handleAccept(index, row) {
      const data = Object.assign({}, row)
      this.rowSelected = index + 1

      this.$services.explanation.acceptExplanation(
        data,
        (res) => {
          this.notifySuccess(res.message)
          this.getListExplanation(this.page, this.size)
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
    },
    handleReject(index, row) {
      const data = Object.assign({}, row)
      this.dataReject = data
      this.rowSelected = index + 1
      this.showFormMessage = true
    },
    rejectItem() {
      this.$services.explanation.rejectExplanation(
        { ...this.dataReject, response_msg: this.message.response_msg },
        (res) => {
          this.notifySuccess(res.message)
          this.getListExplanation(this.page, this.size)
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
        this.$services.explanation.deleteExplanation(
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
          this.$services.explanation.deleteExplanation(
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
