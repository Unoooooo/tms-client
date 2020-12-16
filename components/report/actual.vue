<template>
  <section-block title="Actual in Out report">
    <div>
      <section class="group-filter">
        <el-input
          v-model="fullnameSearch"
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
          @click="searchActualReport()"
        >
          <i class="el-icon-search"></i>
        </el-button>
        <el-button
          class="button-delete-multi"
          type="primary"
          @click="getListActual(page, size)"
        >
          <i class="el-icon-refresh"></i>
        </el-button>

        <div class="gr-button">
          <export-excel
            :data="tableData"
            :title="titleExcel.length == 0 ? 'Account: | Group: | Start Date | End Date:': titleExcel"
            name="ActualIn/Out.xls"
            :fields="json_fields"
          >
            <el-button class="add-new">
              <i class="el-icon-download"></i> Export excel
            </el-button>
          </export-excel>
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
          prop="userName"
          :label="$t('Account')"
        />
        <el-table-column
          class-name="text-left"
          prop="groupName"
          :label="$t('Group')"
        />
        <el-table-column
          class-name="text-left"
          prop="date"
          :label="$t('Date')"
        />
        <!-- <el-table-column class-name="text-center" :label="$t('Date')">
          <template slot-scope="{ row }">
            {{ row.date ? showDateTime(row.date, 'DD/MM/YYYY') : '' }}
          </template>
        </el-table-column> -->
        <el-table-column
          class-name="text-center"
          prop="check_time"
          :label="$t('Check Time')"
        />
        <el-table-column
          class-name="text-left"
          prop="type"
          :label="$t('Type')"
        />
        <el-table-column
          class-name="text-right"
          prop="checkPosition"
          :label="$t('Location')"
        />
      </el-table>

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
  .gr-button {
    float: right;
    margin-bottom: 15px;
  }
  .gr-search {
    margin-bottom: 20px;
    margin-bottom: -41px;
  }
}
.table {
  width: 150px;
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
</style>

<script>
import SimplePagination from '~/components/pagination/SimplePagination'
import validate from '@/helpers/custom-rules-validate'
import Constant from '~/constant'

import Vue from 'vue'
import excel from 'vue-excel-export'
Vue.use(excel)
export default {
  components: { SimplePagination },
  mixins: [validate],
  layout: 'admin',
  middleware: 'auth',
  data() {
    return {
      json_fields: null,
      titleExcel: '',
      constant: Constant,
      tableData: [],
      groupSearch: '',
      fullnameSearch: '',
      actualDate: '',
      endDate: '',
      startDate: '',
      dateActualInOut: '',
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
        list: [],
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
      monthly: {},
    }
  },
  async created() {
    const query = this.$route.query
    if (query.page) {
      this.page = query.page
    }
    if (query.size) {
      this.size = query.size
    }
    await this.getListActual(this.page, this.size)
    await this.getUserInfo()
    await this.getListGroupActual()
  },
  methods: {
    // async refreshSearch() {
    //   this.startLoading()
    //   this.fullnameSearch = ""
    //   this.startDate = ""
    //   this.endDate = ""
    //   this.groupSearch = ""
    //   this.getListMonthly(0, 20)
    //   setTimeout(()=> {
    //     this.endLoading()
    //   }, 300)
    // },
    async getListActual(page, size) {
      this.startLoading()
      let params = {
        page: page - 1,
        size: size,
      }
      if (this.$authInfo.roleValue() === 'staff') {
        await this.$services.actual.getListActual(
          params,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.titleExcel = '';
              this.tableData = response.data
              this.totalPages = response.totalPages
              this.titleExcel += 'Account: | Group: | Start Date: '+ response.startDate +'| End Date: '+ response.endDate + '';

              this.json_fields = {
                'STT': 'stt',
                'Account': 'userName',
                'Group': 'groupName',
                'Date': 'date',
                'Check Time': 'check_time',
                'Type': 'type',
                'Location': 'checkPosition'
              }
            }
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
      } else {
        await this.$services.actual.getListActual(
          params,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.titleExcel = '';
              this.tableData = response.data
              this.totalPages = response.totalPages
              this.titleExcel += 'Account: | Group: | Start Date: '+ response.startDate +'| End Date: '+ response.endDate + '';

              this.json_fields = {
                'STT': 'stt',
                'Account': 'userName',
                'Group': 'groupName',
                'Date': 'date',
                'Check Time': 'check_time',
                'Type': 'type',
                'Location': 'checkPosition'
              }
               console.log(this.json_fields)
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
    async getListGroupActual() {
      await this.$services.actual.getListGroupActual(
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
    async searchActualReport() {
      this.startLoading()
      let filterObj = {}
      console.log(this.dateDailyDate)
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
      if (this.endDate && (!this.endDate.length == 0 || this.endDate.trim())) {
        filterObj.endDate = this.endDate
      }

      await this.$services.actual.searchActualReport(
        filterObj,
        (response) => {
          if (response.data && response.data.length > 0) {
            this.tableData = response.data
            this.totalPages = response.totalPages
            this.titleExcel = '';
            if (this.fullnameSearch != undefined) {
              this.titleExcel += 'Account: ' + this.fullnameSearch
            }
            if (this.groupSearch != undefined) {
              this.titleExcel += '| Group: ' + this.groupSearch
            }
            if (this.startDate != undefined) {
              this.titleExcel += '| Start Date: ' + this.startDate
            }
            if (this.endDate != undefined) {
              this.titleExcel += '| End Date:' + this.endDate
            }
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
      this.getListActual(page, this.size)
      this.page = page
      const roleValue = this.$authInfo.roleValue()
      this.$router.push({
        name: `${roleValue}-report-actual`,
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

    async getListTimeSheet(page, size) {
      let params = {
        page: page - 1,
        size: size,
      }
      await this.$services.dailytimesheet.getListTimeSheet(
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

    getListTimesheetDetail(dataRequest) {
      this.startLoading()
      this.$services.dailytimesheet.getListTimesheetDetail(
        dataRequest,
        (res) => {
          this.dailytimesheet = res.data
          this.dialogFormWithInput = true
          this.endLoading()
        },
        (err) => {
          this.dialogFormWithInput = true
          this.endLoading()
          this.dailytimesheet = {}
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
        dateDailyReport: data.date,
      }
      this.dailytimesheet = Object.assign({}, row)
      this.getListTimesheetDetail(dataRequest)
    },
  },

  // exportExcelDaily() {
  //   this.$confirm('Export danh sách?', 'Xác Thực', {
  //     confirmButtonText: 'Đồng ý',
  //     cancelButtonText: 'Hủy bỏ',
  //   }).then(() => {
  //     this.$services.dailytimesheet.getExportExcel(
  //       (res) => {
  //         var blob = res
  //         if (window.navigator.msSaveOrOpenBlob) {
  //           window.navigator.msSaveBlob(blob)
  //         } else {
  //           var downloadLink = window.document.createElement('a')
  //           downloadLink.href = window.URL.createObjectURL(
  //             new Blob([blob], {
  //               type:
  //                 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //             })
  //           )
  //           downloadLink.download = 'excel.xlsx'
  //           document.body.appendChild(downloadLink)
  //           downloadLink.click()
  //           document.body.removeChild(downloadLink)
  //         }
  //       },
  //       (err) => {
  //         this.notifyError(err.error.error)
  //       }
  //     )
  //   })
  // },
}
</script>
