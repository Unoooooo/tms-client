<template>
  <section-block title="OverTime Report">
    <div>
      <section class="group-filter">
        <div  class="gr-search">
          <el-input
          :disabled="$authInfo.role() == 4"
            v-model="fullnameSearch"
            placeholder="Account"
            class="input-search"
            clearable
          />
          <el-select v-model="groupSearch" class="table" placeholder="Group" :disabled="$authInfo.role() == 3 || $authInfo.role() == 4">
            <el-option
              v-for="(item, index) in groups"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          
        </div>

        <div class="el-searchDate">
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
            @click="searchOvertimeReport()"
          >
            <i class="el-icon-search"></i>
          </el-button>

          <el-button
            class="button-delete-multi"
            type="primary"
            @click="getListOvertime(page, size)"
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
          class-name="text-left"
          prop="account"
          sortable
          :label="$t('Account')"
        />
        <el-table-column
          class-name="text-left"
          prop="group"
          :label="$t('Group')"
        />
        <el-table-column
          class-name="text-left"
          prop="project"
          :label="$t('Project')"
        />
        <!-- <el-table-column class-name="text-center" :label="$t('Start Date')">
          <template slot-scope="{ row }">
            {{
              row.startDate ? showDateTime(row.startDate, 'DD/MM/YYYY') : ''
            }}
          </template>
        </el-table-column>
         <el-table-column class-name="text-center" :label="$t('End Date')">
          <template slot-scope="{ row }">
            {{
              row.endDate ? showDateTime(row.endDate, 'DD/MM/YYYY') : ''
            }}
          </template>
        </el-table-column> -->
        <el-table-column
          class-name="text-center"
          prop="totalTimeOt"
          :label="$t(' Time OverTime')"
        />

        <el-table-column
          class-name="text-center"
          prop="action"
          :label="$t('Action')"
          width="110px"
        >
          <template slot-scope="scope">
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
              <label class="col-sm-3 col-form-label">Account</label>
              <div class="col-sm-8 data-detail">
                {{ overtime.account }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Group</label>
              <div class="col-sm-8 data-detail">
                {{ overtime.group }}
              </div>
            </div>

            <el-table
              :data="request.list"
              style="
                width: 60%;
                margin: 20px 0 20px 65px;
                border: 1px solid #e2e8f0;
              "
            >
              <el-table-column prop="project" label="Project" width="180">
              </el-table-column>
              <el-table-column label="Time Overtime" width="200">
                <template slot-scope="{ row }">
                  <i v-if="row.totalTimeOt" class="el-icon-time"></i>
                  <span style="margin-left: 10px">
                    {{ row.totalTimeOt }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>

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
.data-detail {
  line-height: 35px;
}
.content {
  margin: 70px 32px 20px;
  .title {
    margin: 30px 0 40px;
  }
}
.table {
  width: 150px;
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
.searchCombox {
  width: 150px;
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
label {
  text-align: center;
}
.group-filter {
  margin-bottom: 20px;
  display: flex;
  .gr-button {
    float: right;
    margin-bottom: 15px;
  }
  .gr-search {
    margin-right: 3px;
  }
  .gr-searchDate {
    margin-left: 3px;
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
}
</style>

<script>
import SimplePagination from '~/components/pagination/SimplePagination'
import validate from '@/helpers/custom-rules-validate'

export default {
  components: { SimplePagination },
  mixins: [validate],
  layout: 'admin',
  middleware: 'auth',
  data() {
    return {
      tableData: [],
      fullnameSearch: '',
      groupSearch: '',
      startDate: '',
      endDate: '',
      dialogFormWithInput: false,
      showFormMessage: false,
      dataReject: {},
      titlePopup: '',
      dialogMode: '',
      // account: '',
      groups: [],
      projects: [],
      message: {
        response_msg: '',
      },

      user: {
        account: '',
        group: '',
        project: '',
      },
      totalTimeOt: '',
      request: {
        account: this.$authInfo.name(),
        title: '',
        reason: '',
        groupCompany: '',
        late_time: '',
        soon_time: '',
        start_date: '',
        end_date: '',
        cc_mail_ids: '',
        content: '',
        response_msg: '',
        status: '',
        radio: 1,
      },
      rules: {
        title: this.validateRequired('title'),
        groupCompany: this.validateRequired('groupCompany'),
        late_time: this.validateRequired('late_time'),
        soon_time: this.validateRequired('soon_time'),
        start_date: this.validateRequired('start_date'),
        end_date: this.validateRequired('end_date'),
        account_receiver: this.validateRequired('account_receiver'),
      },
      rowSelected: null,
      multipleSelection: [],
      totalPages: 1,
      page: 1,
      size: undefined,
      overtime: {},
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
    this.getListOvertime(this.page, this.size)
    this.getUserInfo()
    this.getListGroupOvertime()
  },
  methods: {
    // async refreshSearch() {
    //   this.startLoading()
    //   this.fullnameSearch = ""
    //   this.startDate = ""
    //   this.endDate = ""
    //   this.groupSearch = ""
    //   this.getListOvertime(0, 20)
    //   setTimeout(()=> {
    //     this.endLoading()
    //   }, 300)
    // },
    async getListOvertime(page, size) {
      this.startLoading()
      let params = {
        page: page - 1,
        size: size,
      }
      if (this.$authInfo.roleValue() === 'staff') {
        await this.$services.overtime.getListOvertime(
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
        await this.$services.overtime.getListOvertime(
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
      setTimeout(() => {
        this.endLoading()
      }, 300)
    },
    async getListGroupOvertime() {
      await this.$services.overtime.getListGroupOvertime(
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
    async getUserInfo() {
      await this.$services.common.getUserInfo(
        (response) => {
          this.user = response.data
          console.log(response.data)
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    async getListUser() {
      await this.$services.user.getListUser(
        {},
        (response) => {
          if (response.data && response.data.length > 0) {
            this.account = response.data.map((item) => {
              return { label: item.username, value: item.username }
            })
          }
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    async searchOvertimeReport() {
      this.startLoading()
      let filterObj = {}
      console.log(this.groupSearch)
      if (!this.fullnameSearch.length == 0 || this.fullnameSearch.trim()) {
        filterObj.userName = this.fullnameSearch.trim()
      }
      if (this.groupSearch !== '') {
        filterObj.groupId = this.groupSearch
      }
      if (
        this.startDate &&
        (!this.startDate.length == 0 || this.startDate.trim())
      ) {
        filterObj.startDate = this.startDate
      }
      if (this.endtDate && (!this.endDate.length == 0 || this.endDate.trim())) {
        filterObj.endDate = this.endDate
      }
      await this.$services.overtime.searchOvertimeReport(
        filterObj,
        (response) => {
          if (response.data && response.data.length > 0) {
            this.tableData = response.data
            this.totalPages = response.totalPages
          } else {
            this.tableData = []
            this.totalPages = 0
          }
        },
        (err) => {
          this.tableData = []
          this.totalPages = 0
          this.endLoading()
          this.notifyError(err.error.error)
        }
      )
      this.endLoading()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    changePageData(page) {
      this.getListOvertime(page, this.size)
      this.page = page
      const roleValue = this.$authInfo.roleValue()
      this.$router.push({
        name: `${roleValue}-report-abnormal`,
        query: { page, size: this.size },
      })
    },
    resetUserData() {
      this.request = {
        account: this.$authInfo.username(),
        title: '',
        reason: '',
        groupCompany: '',
        late_time: '',
        start_date: '',
        end_date: '',
        cc_mail_ids: '',
        content: '',
        response_msg: '',
        status: '',
        radio: 1,
      }
    },

    async getListOvertime(page, size) {
      let params = {
        page: page - 1,
        size: size,
      }
      await this.$services.overtime.getListOvertime(
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
    },

    getListOvertimeDetail(dataRequest) {
      this.startLoading()
      this.$services.overtime.getListOvertimeDetail(
        dataRequest,
        (res) => {
          this.request.list = res
          this.dialogFormWithInput = true
          this.endLoading()
        },
        (err) => {
          this.dialogFormWithInput = true
          this.endLoading()
          this.request.list = []
          this.notifyError(err.error.error)
        }
      )
    },
    handleInfo(index, row) {
      this.titlePopup = 'Detail'
      this.dialogMode = 'detail'
      const data = Object.assign({}, row)
      const dataRequest = {
        accountId: data.account_id,
        startDate: data.startDate || null,
        endDate: data.endtDate || null,
      }
      this.overtime = Object.assign({}, row)
      this.getListOvertimeDetail(dataRequest)
    },
  },
}
</script>
