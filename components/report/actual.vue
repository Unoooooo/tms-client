<template>
  <section-block title="Actual in Out report">
    <div>
      <section class="group-filter">
        
      
          <el-input
          :disabled="$authInfo.role() == 4"
            v-model="fullnameSearch"
            placeholder="Account"
            class="input-search"
            clearable
          />

          <el-date-picker
            v-model="actualDate"
            type="date"
            placeholder="Daily Report"
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
        

        <div class="gr-button">
          <el-button
            class="button-delete-multi"
            type="primary"
            @click="getListTimeSheet(page, size)"
          >
            <i class="el-icon-refresh"></i>
          </el-button>
          <el-button class="add-new" @click="exportExcelDaily()">
            Export excel
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
          prop="userName"
          :label="$t('Account')"
        />
        <el-table-column class-name="text-center" :label="$t('Date')">
          <template slot-scope="{ row }">
            {{ row.date ? showDateTime(row.date, 'DD/MM/YYYY') : '' }}
          </template>
        </el-table-column>
        <el-table-column
          class-name="text-center"
          prop="check_time"
          :label="$t('Check Time')"
        />
        <!-- <el-table-column class-name="text-center" :label="$t('Check Time')">
          <template slot-scope="{ row }">
            {{ row.check_time ? showDateTime(row.check_time, 'HH: mm: ss') : '' }}
          </template>
        </el-table-column> -->
        <el-table-column
          class-name="text-left"
          prop="type"
          :label="$t('Type')"
        />

        <el-table-column
          class-name="text-left"
          prop="value"
          :label="$t('Value')"
        />
        <el-table-column
          class-name="text-right"
          prop="checkPosition"
          :label="$t('Position')"
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
      actualDate: '',
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
              this.tableData = response.data
              this.totalPages = response.totalPages
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
    // async getListGroupTimesheet() {
    //   await this.$services.dailytimesheet.getListGroupTimesheet(
    //     (response) => {
    //       if (response.listData && response.listData.length > 0) {
    //         this.groups = response.listData.map((item) => {
    //           return { label: item.name, value: Number(item.group_id) }
    //         })
    //       }
    //     },
    //     (err) => this.notifyError(err.error.error)
    //   )
    // },
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
     
      if (this.actualDate && (!this.actualDate.length == 0 || this.dateDailyDate.trim())) {
        filterObj.dateActualInOut = this.actualDate
      }

      await this.$services.actual.searchActualReport(
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
      this.getListTimeSheet(page, this.size)
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

  exportExcelDaily() {
    this.$confirm('Export danh sách?', 'Xác Thực', {
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
    }).then(() => {
      this.$services.dailytimesheet.getExportExcel(
        (res) => {
          var blob = res
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob)
          } else {
            var downloadLink = window.document.createElement('a')
            downloadLink.href = window.URL.createObjectURL(
              new Blob([blob], {
                type:
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              })
            )
            downloadLink.download = 'excel.xlsx'
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
          }
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
    })
  },
}
</script>
