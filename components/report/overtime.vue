<template>
  <section-block title="OverTime Report">
    <div>
      <section class="group-filter">
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
            $authInfo.role() == constant.Role.MANAGER ||
            $authInfo.role() == constant.Role.STAFF
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
          @click="searchOvertimeReport()"
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

        <div class="gr-button">
          <export-excel
            :data="excelData"
            :title="
              titleExcel.length == 0
                ? 'Account: | Group: | Start Date | End Date:'
                : titleExcel
            "
            name="OverTimeReport.xls"
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
          prop="account"
          sortable
          :label="$t('Account')"
        />
        <el-table-column
          class-name="text-left"
          prop="group"
          :label="$t('Group')"
        />
        <!-- <el-table-column
          class-name="text-left"
          prop="project"
          :label="$t('Project')"
        /> -->
        <el-table-column
          class-name="text-center"
          prop="totalTimeOtNormal"
          :label="$t('Total Normal OT')"
        />
        <el-table-column
          class-name="text-center"
          prop="totalTimeOtWeekend"
          :label="$t('Total Weekend OT')"
        />
        <el-table-column
          class-name="text-center"
          prop="totalTimeOtHoliday"
          :label="$t('Total Holiday OT')"
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

            <div class="noteBorder">
              <div class="noteTitle">Note</div>
              <div class="noteTxt">N: Normal</div>
              <div class="noteTxt">W: Weekend</div>
              <div class="noteTxt">H: Holiday</div>
            </div>

            <!-- <div class="form-group row">
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
            </div> -->

            <el-table
              :data="request.list"
              class="table-serenade"
              style="
                width: 582px;
                margin: 20px 0 20px 65px;
                border: 1px solid #e2e8f0;
              "
            >
              <el-table-column
                prop="project"
                label="Project"
                width="190"
                style="color: #000"
              >
              </el-table-column>

              <el-table-column label="Date" width="200">
                <template slot-scope="{ row }">
                  <i v-if="row.dateOt" class="el-icon-time"></i>
                  <span style="margin-left: 10px">
                    {{
                      row.dateOt ? showDateTime(row.dateOt, 'DD/MM/YYYY') : ''
                    }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                prop="timeOt"
                label="Time"
                width="190"
                style="color: #000"
              >
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
.noteBorder {
  border: 1px solid #000;
  width: 80px;
  float: right;
  margin-top: -97px;
  margin-bottom: 10px;
  margin-right: 80px;
}
.noteTitle {
  font-size: 15px;
  text-align: center;
  margin-top: 5px;
}
.noteTxt {
  font-size: 10px;
  margin-left: 10px;
  margin-bottom: 5px;
}
.data-detail {
  line-height: 35px;
}
.el-table th > .cell {
  color: #000;
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
      excelData: [],
      userName: '',
      fullnameSearch: '',
      groupSearch: '',
      groupID: '',
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
  fetch() {
        this.userName = ''
        this.groupSearch = ''
        this.startDate = ''
        this.endDate = ''
        this.getListOvertime(1, this.size)
      },
    async getListOvertime(page, size) {
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
        //excel
        let excelParam = {...params};
        excelParam.page = 0;
        excelParam.size = 1000;
        await this.$services.overtime.getListOvertime(
         excelParam,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.titleExcel = '';
              this.excelData = response.data
              this.titleExcel += 'Account: | Group: | Start Date: '+ response.startDate +'| End Date: '+ response.endDate + '';
              
              this.json_fields = {
                'STT': 'stt',
                'Account': 'account',
                'Group': 'group',
                'Time Normal OT': 'totalTimeOtNormal',
                'Total Weekend OT': 'totalTimeOtWeekend',
                'Total Holiday OT': 'totalTimeOtHoliday',
              }
            }
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
        //list
        await this.$services.overtime.getListOvertime(
          params,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.titleExcel = '';
              this.tableData = response.data
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
                'Account': 'account',
                'Group': 'group',
                'Time Normal OT': 'totalTimeOtNormal',
                'Total Weekend OT': 'totalTimeOtWeekend',
                'Total Holiday OT': 'totalTimeOtHoliday',
              }
            }
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
      } else {
        //excel
        let excelParam = {...params};
        excelParam.page = 0;
        excelParam.size = 1000;
        await this.$services.overtime.getListOvertime(
         params,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.titleExcel = '';
              this.excelData = response.data              
              this.titleExcel += 'Account: | Group: | Start Date: '+ response.startDate +'| End Date: '+ response.endDate + '';
              this.json_fields = {
                'STT': 'stt',
                'Account': 'account',
                'Group': 'group',
                'Time Normal OT': 'totalTimeOtNormal',
                'Total Weekend OT': 'totalTimeOtWeekend',
                'Total Holiday OT': 'totalTimeOtHoliday',
              }
            }
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
        //list
        await this.$services.overtime.getListOvertime(
          params,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.titleExcel = '';
              this.tableData = response.data
              // let temp = {}
              // let count = 0
              // this.tableData.forEach((item, index)=> {
              //   if(item.accountId === this.user.account_Id) {
              //     temp = item
              //     count ++
              //     this.tableData.splice(index, 1)
              //   } 
              // })
              // for(let i=0; i<count;i++) {
              //   this.tableData.unshift(temp)
              // }
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
                'Account': 'account',
                'Group': 'group',
                'Time Normal OT': 'totalTimeOtNormal',
                'Total Weekend OT': 'totalTimeOtWeekend',
                'Total Holiday OT': 'totalTimeOtHoliday',
              }
            }
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
      }
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
      //search excel
      let excelParam = {...params};
        excelParam.page = 0;
        excelParam.size = 1000;
      await this.$services.overtime.searchOvertimeReport(
        excelParam,
        (response) => {
          console.log(0)
          if (response.data && response.data.length > 0) {
            console.log(1)
            this.excelData = response.data 
            this.titleExcel = '';                   
             
            if (this.userName != undefined) {
              this.titleExcel += 'Account: ' + this.userName 
            }
            let groupLabel = ''
            for (let index = 0; index < this.groups.length; index++) {
              const element = this.groups[index]
              if (element.value === this.groupSearch) {
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
            this.excelData = []
            this.titleExcel += 'Account: | Group: | Start Date: '+ response.startDate +'| End Date: '+ response.endDate + '';
          }
        },
        (err) => {
          console.log(3)
          this.excelData = []
          this.totalPages = 0
          this.titleExcel += 'Account: | Group: | Start Date: '+ response.startDate +'| End Date: '+ response.endDate + '';
        }
      )
      //search List
      await this.$services.overtime.searchOvertimeReport(
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
            let groupLabel = ''
            for (let index = 0; index < this.groups.length; index++) {
              const element = this.groups[index]
              if (element.value === this.groupSearch) {
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
      this.getListOvertime(page, this.size)
      this.page = page
      const roleValue = this.$authInfo.roleValue()
      this.$router.push({
        name: `${roleValue}-report-overtime`,
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
    // async getListOvertime(page, size) {
    //   let params = {
    //     page: page - 1,
    //     size: size,
    //   }
    //   await this.$services.overtime.getListOvertime(
    //     params,
    //     (response) => {
    //       if (response.data && response.data.length > 0) {
    //         this.titleExcel = '';
    //         this.tableData = response.data
    //         this.totalPages = response.totalPages
    //         this.titleExcel += 'Account: | Group: | Start Date: '+ response.startDate +'| End Date: '+ response.endDate + '';

    //         this.json_fields = {
    //           'STT': 'stt',
    //           'Account': 'account',
    //           'Group': 'group',
    //           'Time Normal OT': 'totalTimeOtNormal',
    //           'Total Weekend OT': 'totalTimeOtWeekend',
    //           'Total Holiday OT': 'totalTimeOtHoliday',
    //         }
    //         console.log(this.json_fields)
    //       }
    //     },
    //     (err) => {
    //       this.notifyError(err.error.error)
    //     }
    //   )
    // },

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
