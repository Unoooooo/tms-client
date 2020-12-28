<template>
  <section-block title="OverTime Request">
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
          <el-input
            v-model="projectSearch"
            :disabled="$authInfo.role() == constant.Role.STAFF"
            placeholder="Project"
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
            @click="searchOtRequest()"
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
          width="80px"
        />
        <el-table-column
          class-name="text-left"
          prop="title"
          :label="$t('Title')"
        />
        <el-table-column
          class-name="text-left"
          prop="account_sent"
          :label="$t('Account')"
          width="150px"
        />
        <el-table-column
          class-name="text-left"
          prop="project"
          :label="$t('Project')"
        />
        
        <el-table-column
          class-name="text-center"
          prop="date_ot"
          :label="$t('OverTime Date')"
        >
          <template slot-scope="{ row }">
            {{ row.date_ot ? showDateTime(row.date_ot, 'DD/MM/YYYY') : '' }}
          </template>
        </el-table-column>

        <el-table-column
          class-name="text-left"
          prop="status"
          sortable
          :label="$t('Status')"
          width="150px"
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
          <el-form ref="dataForm" :rules="rules" :model="request">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Title</label>
                  <el-form-item prop="title" class="col-sm-6">
                    <el-input
                      v-model="request.title"
                      :disabled="isDetailForm"
                    />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Fullname</label>
                  <el-form-item prop="full_name" class="col-sm-6">
                    <el-input v-model="user.full_name" disabled />
                  </el-form-item>
                </div>

                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">
                    Project <span>*</span>
                  </label>
                  <el-form-item prop="project" class="col-sm-6">
                    <el-select
                      v-model="request.project"
                      placeholder="Select project"
                      class="itemSelec"
                      :disabled="isDetailForm"
                    >
                      <el-option
                        v-for="item in projects"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Message</label>
                  <el-form-item prop="response_msg" class="col-sm-6">
                    <el-input v-model="request.response_msg" type="textarea" disabled />
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Group </label>
                  <el-form-item prop="groupCompanyName" class="col-sm-6">
                    <el-input v-model="user.groupCompanyName" disabled />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">
                    Receiver <span>*</span>
                  </label>
                  <el-form-item prop="account_receiver" class="col-sm-6">
                    <el-select
                      v-model="request.account_receiver"
                      placeholder="Account receiver"
                      class="itemSelec"
                      :disabled="isDetailForm"
                    >
                      <el-option
                        v-for="(item, index) in account_receivers"
                        :key="index"
                        :label="item.username"
                        :value="item.username"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">
                    OT Date <span>*</span>
                  </label>
                  <el-form-item prop="date_ot" class="col-sm-6">
                    <el-date-picker
                      v-model="request.date_ot"
                      type="date"
                      placeholder="Pick a day"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      class="itemSelec"
                      :disabled="isDetailForm"
                    />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Status</label>
                  <el-form-item prop="status" class="col-sm-6">
                    <el-input v-model="request.status" disabled />
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">
                    List Member With OT
                  </label>

                  <el-select
                    v-model="addMemberToGroup.checkedMembers"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="Select Member"
                    class="col-sm-8"
                    :disabled="isDetailForm"
                  >
                    <el-option
                      v-for="(member, index) in members"
                      :key="index"
                      :label="member.username"
                      :value="member.username"
                      
                    >
                    </el-option>
                  </el-select>
                  <!-- </el-form-item> -->
                </div>
              </el-col>
            </el-row>
            <!-- <el-form-item label="Note">
              <el-input
                v-model="request.content"
                :disabled="isDetailForm"
                type="textarea"
              ></el-input>
            </el-form-item> -->
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
  width: 50%;
  padding-right: 0;
}
.el-date-editor {
  width: 50%;
}
.el-select__tags {
  top: 36%;
}

.titleForm {
  margin-right: 31px;
}
.data-detail {
  line-height: 35px;
}
.itemSelec {
  width: 100%;
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
label {
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
.list-member > .el-checkbox {
  display: flex;
  margin: 12px 0;
  align-items: center;
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
      projectSearch: '',
      userName: '',
      startDate: '',
      endDate: '',
      dialogFormWithInput: false,
      showFormMessage: false,
      titlePopup: '',
      dialogMode: '',
      groups: [],
      projects: [],
      isDetailForm: false,
      listUsernameWithOt: [],
      account_receivers: [],
      members: [],
      addMemberToGroup: {
        checkedMembers: [],
      },
      message: {
        response_msg: '',
      },
      request: {
        id: '',
        title: '',
        account_sent: '',
        account_receiver: '',
        project: '',
        content: '',
        date_ot: '',
      },
      user: {
        account_sent: '',
        account_receiver: '',
        groupCompany: '',
      },
      rules: {
        title: this.validateRequired('title'),
        account_sent: this.validateRequired('account sent'),
        account_receiver: this.validateRequired('account receiver'),
        project: this.validateRequired('project'),
        date_ot: this.validateRequired('date ot'),
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
    this.getListOTRequest(this.page, this.size)
    this.listDataOtRequest()
    this.getUserInfo()
  },
  methods: {
     async fetch() {
        this.userName = ''
        this.projectSearch = ''
        this.startDate = ''
        this.endDate = ''
        await this.getListOTRequest(1, this.size)
        this.page = 1
        this.$router.push({name: this.$route.name, query: {
          page: 1
        }})
        
      },
    canSelectRow(row) {
      return row.account_sent === this.user.username && row.status == 'Pending'
    },
    async getListOTRequest(page, size) {
      this.tableData = []
      let params = {
        page: page - 1,
        size: size,
      }
     if (!this.userName.length == 0 || this.userName.trim()) {
        params.userName = this.userName.trim()
      }
       if(this.projectSearch !== '' && !this.projectSearch == 0 ) {
        params.projectName = this.projectSearch
      }
      if(this.startDate && this.startDate.trim() !== '') {
        params.startDate = this.startDate
      }
      if(this.endDate && this.endDate.trim() !== '') {
        params.endDate = this.endDate
      }
      if (this.$authInfo.roleValue() === 'staff') {
        await this.$services.request.getListOTRequest(
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
        await this.$services.request.getListOTRequest(
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
    async listDataOtRequest() {
      await this.$services.request.listDataOtRequest(
        (response) => {
          this.projects = response.listAllProjectOfGroup.map((item) => {
            return { label: item.name, value: Number(item.project_id) }
          })
          this.account_receivers = response.listReceiver
          this.members = response.listAllMemberOfProject
        },
        (err) => this.notifyError(err.error.error)
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
    async searchOtRequest() {
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
      await this.$services.request.getListOTRequest(
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
      this.getListOTRequest(page, this.size)
      this.page = page
      const roleValue = this.$authInfo.roleValue()
      this.$router.push({
        name: `${roleValue}-request-overtime`,
        query: { page, size: this.size },
      })
    },
    resetUserData() {
      this.request = {
        id: undefined,
        title: '',
        account_sent: '',
        account_receiver: '',
        project: '',
        content: '',
        date_ot: '',
        listUsernameWithOt: [],
      }
    },
    handleCreate() {
      this.addMemberToGroup.checkedMembers = []
      this.isDetailForm = false
      this.dialogMode = 'create'
      this.titlePopup = 'Create OverTime Request'
      this.dialogFormWithInput = true
      this.resetUserData()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
      handleInfo(index, row) {
      this.titlePopup = 'View OverTime Request'
      this.dialogMode = 'detail'
      this.isDetailForm = true
      this.dialogFormWithInput = true
      this.request = Object.assign({}, row)
      this.addMemberToGroup.checkedMembers = [...row.listUsernameWithOt]
      this.rowSelected = index + 1
    },
    handleUpdate(index, row) {
      this.request = Object.assign({}, row)
      this.isDetailForm = false
      this.dialogMode = 'update'
      this.titlePopup = 'Edit OverTime Request'
      this.dialogFormWithInput = true
      this.addMemberToGroup.checkedMembers = [...row.listUsernameWithOt]
      this.rowSelected = index + 1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
  
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$services.request.addOtRequest(
            {
              ...this.request,
              account_sent: this.$authInfo.username(),
              listUsernameWithOt: this.addMemberToGroup.checkedMembers,
            },
            (res) => {
              this.getListOTRequest(this.page, this.size)
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
          this.$services.request.updateOtRequest(
            {
              ...this.request,
              listUsernameWithOt: this.addMemberToGroup.checkedMembers,
            },
            (res) => {
              this.getListOTRequest(this.page, this.size)
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
    handleAccept(index, row) {
      const data = Object.assign({}, row)
      this.rowSelected = index + 1

      this.$services.request.acceptOvertime(
        data,
        (res) => {
          this.notifySuccess(res.message)
          this.getListOTRequest(this.page, this.size)
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
      this.$services.request.rejectOvertime(
        { ...this.dataReject, response_msg: this.message.response_msg },
        (res) => {
          this.notifySuccess(res.message)
          this.getListOTRequest(this.page, this.size)
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
        this.$services.request.deleteOtRequest(
          row.ot_id,
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
          this.$services.request.deleteOtRequest(
            element.ot_id,
            (res) => {
              const data = this.tableData.filter(
                (item) => item.ot_id !== element.ot_id
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
