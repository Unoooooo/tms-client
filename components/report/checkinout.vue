<template>
  <section-block title="TimeSheet Report">
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
          @click="searchTimeSheetReport()"
        >
          <i class="el-icon-search"></i>
        </el-button>
        <el-button
          class="button-delete-multi"
          type="primary"
          @click="getListTimeSheet(page, size)"
        >
          <i class="el-icon-refresh"></i>
        </el-button>
        <div class="gr-button">
          <export-excel
            :data="excelData"
            :title="titleExcel.length == 0 ? 'Account: | Group: | Start Date | End Date:': titleExcel"
            name="checkInOut.xls"
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
          width="60px"
        />
        <el-table-column
          class-name="text-left"
          prop="account"
          :label="$t('Account')"
           width="100px"
        />
        <el-table-column
          class-name="text-left"
          prop="groupName"
          :label="$t('Group')"
          width="100px"
        />
        <el-table-column class-name="text-center" :label="$t('Date')"  width="100px">
          <template slot-scope="{ row }">
            {{ row.date ? showDateTime(row.date, 'DD/MM/YYYY') : '' }}
          </template>
        </el-table-column>

        <el-table-column
          class-name="text-center"
          prop="check_in"
          :label="$t('Check In')"
           width="110px"
        />

        <el-table-column
          class-name="text-center"
          prop="check_out"
          :label="$t('Check Out')"
           width="115px"
        />
        <el-table-column
          class-name="text-center"
          prop="explan_in"
          :label="$t('Explan In')"
        />
         <el-table-column
          class-name="text-center"
          prop="explan_out"
          :label="$t('Explan Out')"
        />
        <el-table-column
          class-name="text-center"
          prop="time_offical"
          :label="$t('Time Offical')"
        />
        <el-table-column
          class-name="text-center"
          prop="work_day"
          :label="$t('Work day')"
          width="110px"
        />
        <el-table-column
          class-name="text-center"
          prop="work_time"
          :label="$t('Work time')"
          width="110px"
        />
      
      </el-table>
      <section>
        <el-dialog
          :title="titlePopup"
          :visible.sync="dialogFormWithInput"
          width="50%"
        >
          <div v-if="dialogMode === 'detail'">
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">FullName</label>
              <div class="col-sm-8 data-detail">
                {{ dailytimesheet.name }}
              </div>
            </div>

            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Account</label>
              <div class="col-sm-8 data-detail">
                {{ dailytimesheet.user_name }}
              </div>
            </div>

            <el-table
              :data="dailytimesheet.list"
              style="
                width: 60%;
                margin: 20px 0 20px 65px;
                border: 1px solid #e2e8f0;
              "
            >
              <el-table-column label="Time" width="100">
                <template slot-scope="{ row }">
                  <i v-if="check_time" class="el-icon-time"></i>
                  <span style="margin-left: 10px">
                    {{
                      row.check_time
                        ? showDateTime(row.check_time, 'HH:mm')
                        : ''
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="Type" width="180">
              </el-table-column>
              <el-table-column prop="value" label="Value"> </el-table-column>
            </el-table>

            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Time offical</label>
              <div class="col-sm-8 data-detail">
                {{ dailytimesheet.time_offical }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Work day</label>
              <div class="col-sm-8 data-detail">
                {{ dailytimesheet.work_day }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Fines</label>
              <div class="col-sm-8 data-detail">
                {{ dailytimesheet.number_fines }}
              </div>
            </div>
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
      excelData: [],
      tableData: [],
      fullnameSearch: '',
      groupSearch: '',
      groupID: '',
      userName: '',
      startDate: '',
      endDate: '',
      dateDailyDate: '',
      dateDailyReport: '',
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
        groupCompany: '',
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
    await this.getUserInfo()
    await this.getListTimeSheet(this.page, this.size)
    await this.getListGroupTimesheet()
  },
  methods: {

async getListTimeSheet(page, size) {
      let params = {

        page: page - 1,
        size: size
      }
       if (!this.fullnameSearch.length == 0 || this.fullnameSearch.trim()) {
        filterObj.userName = this.fullnameSearch.trim()
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
        await this.$services.dailytimesheet.getListTimeSheet(
          params,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.titleExcel = '';
              this.tableData = response.data
              this.totalPages = response.totalPages
              this.titleExcel += 'Account: | Group: | Start Date: '+ response.startDate +'| End Date: '+ response.endDate + '';

              for (let index = 0; index < this.tableData.length; index++) {
                  if(this.tableData[index].status === true){
                    this.tableData[index].status = 'Explained';
                    console.log(this.tableData[index].status)
                  }else{
                    this.tableData[index].status = ' ';
                  }
              }
              
              this.json_fields = {
                'STT': 'stt',
                'Account': 'userName',
                'Group': 'groupName',
                'Date': 'dateTimeSheet',
                'Check In': 'checkInTime',
                'Check Out': 'checkOutTime',
                'Abnormal Type': 'abnormalType',
                'Status': 'status'
              }
            }
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
      } else {
        await this.$services.dailytimesheet.getListTimeSheet(
          params,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.titleExcel = '';
              this.tableData = response.data
           
              this.totalPages = response.totalPages
              this.titleExcel += 'Account: | Group: | Start Date: '+ response.startDate +'| End Date: '+ response.endDate + '';

              for (let index = 0; index < this.tableData.length; index++) {
                  if(this.tableData[index].status === true){
                    this.tableData[index].status = 'Explained';
                  }else{
                    this.tableData[index].status = ' ';
                  }
              }
              this.json_fields = {
                'STT': 'stt',
                'Account': 'userName',
                'Group': 'groupName',
                'Date': 'dateTimeSheet',
                'Check In': 'checkInTime',
                'Check Out': 'checkOutTime',
                'Abnormal Type': 'abnormalType',
                'Status': 'status'
              }
            }
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
      }  
    },
    
    async getListGroupTimesheet() {
      await this.$services.dailytimesheet.getListGroupTimesheet(
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
          // console.log(response.data)
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
    async searchTimeSheetReport() {
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
      await this.$services.dailytimesheet.searchTimeSheetReport(
        params,
        (response) => {
          console.log(0)
          if (response.data && response.data.length > 0) {
            console.log(1)
            this.tableData = response.data
            this.totalPages = response.totalPages
            this.titleExcel = '';
            for (let index = 0; index < this.tableData.length; index++) {
                  if(this.tableData[index].status === true){
                    this.tableData[index].status = 'Explained';
                  }else{
                    this.tableData[index].status = ' ';
                  }
              }                    
             
            if (this.userName != undefined) {
              this.titleExcel += 'Account: ' + this.userName 
            }
            let groupLabel = '';
            for (let index = 0; index < this.groups.length; index++) {
              const element = this.groups[index];
              if (element.value === this.groupSearch){
                groupLabel = element.label
              }
            }
            if (this.groupSearch != undefined) {
              this.titleExcel += '| Group: ' + groupLabel 
            }
            if (this.startDate != undefined) {
              this.titleExcel += '| Start Date: ' + this.startDate 
            }
            if (this.endDate != undefined) {
              this.titleExcel += '| End Date:' + this.endDate 
            }
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
      this.getListTimeSheet(page, this.size)
      this.page = page
      const roleValue = this.$authInfo.roleValue()
      this.$router.push({
        name: `${roleValue}-report-checkinout`,
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
