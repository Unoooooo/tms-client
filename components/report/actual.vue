<template>
  <section-block title="Actual in Out report">
    <div>
      <section class="group-filter">
        <el-input
          v-model="userName"
          :disabled="$authInfo.role() == 4"
          placeholder="Account"
          class="input-search"
          clearable
        />
        <el-select
          v-model="groupSearch"
          class="table"
          placeholder="Group"
          :disabled="$authInfo.role() == 4"
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
          @click="fetch()"
        >
          <i class="el-icon-refresh"></i>
        </el-button>

        <div class="gr-button">
          <export-excel
            :data="excelData"
            :title="titleExcel"
            name="AbnormalReport.xls"
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
          class-name="text-center"
          prop="userName"
          sortable
          :label="$t('Account')"
        />
        <el-table-column
          class-name="text-left"
          prop="groupName"
          :label="$t('Group')"
        />
        <!-- <el-table-column
          class-name="text-center"
          prop="dateTimeSheet"
          sortable
          :label="$t('Date')"
          width="100px"
        /> -->
        <el-table-column class-name="text-center" :label="$t('Date')">
          <template slot-scope="{ row }">
            {{ row.date }}
          </template>
        </el-table-column>
       
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
          class-name="text-left"
          prop="checkPosition"
          :label="$t('Loccation')"
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
.time {
  width: 167%;
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
.itemSelec {
  width: 100%;
}
.line {
  margin-top: -30px;
}
.table {
  width: 150px;
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
      abnormal: {},

      titlePopup: '',
      dialogMode: '',
      account_receivers: [],
      groups: [],
      projects: [],
      message: {
        response_msg: '',
      },
      abnormal_types: [
        'Parttime working',
        'Late working',
        'Sooner working',
        'No check IN/OUT',
      ],
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
      size: 4
    }
  },
  async created() {
    //http://localhost:3000/humanresources/report/abnormal?page=1&size=2
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
    // await this.getListGroupAbnormal()
  },
  methods: {
    async fetch() {
        this.userName = ''
        this.groupSearch = ''
        this.startDate = ''
        this.endDate = ''
        await this.getListActual(1, this.size)
        this.page = 1
        this.$router.push({name: this.$route.name, query: {
          page: 1
        }})
    },
    async getListActual(page, size) {
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
        //excel
        await this.$services.actual.getListActual(
          params,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.titleExcel = '';
              this.tableData = response.data
              this.excelData = response.data
              this.totalPages = response.totalPages
              this.titleExcel += 'Account: | Group: | Start Date: '+ response.startDate +'| End Date: '+ response.endDate + '';

              for (let index = 0; index < this.excelData.length; index++) {
                  if(this.excelData[index].status === true){
                    this.excelData[index].status = 'Explained';
                    console.log(this.excelData[index].status)
                  }else{
                    this.excelData[index].status = ' ';
                  }
              }
              
              this.json_fields = {
                'STT': 'stt',
                'Account': 'userName',
                'Group': 'groupName',
                'Check Time': 'check_time',
                'Type': 'type',
                'Loccation': 'checkPosition',
              }
            }
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
        //list
        await this.$services.actual.getListActual(
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
                'Check Time': 'check_time',
                'Type': 'type',
                'Loccation': 'checkPosition',
              }
            }
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
      } else {
        //excel
        await this.$services.actual.getListActual(
          params,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.titleExcel = '';
              this.tableData = response.data
              this.excelData = response.data
              this.totalPages = response.totalPages
              this.titleExcel += 'Account: | Group: | Start Date: '+ response.startDate +'| End Date: '+ response.endDate + '';

              for (let index = 0; index < this.excelData.length; index++) {
                  if(this.excelData[index].status === true){
                    this.excelData[index].status = 'Explained';
                  }else{
                    this.excelData[index].status = ' ';
                  }
              }
              this.json_fields = {
                'STT': 'stt',
                'Account': 'userName',
                'Group': 'groupName',
                'Check Time': 'check_time',
                'Type': 'type',
                'Loccation': 'checkPosition',
              }
            }
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
        //list
        await this.$services.actual.getListActual(
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
                'Account': 'userName',
                'Group': 'groupName',
                'Check Time': 'check_time',
                'Type': 'type',
                'Loccation': 'checkPosition',
              }
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
          console.log(this.user)
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    // async getListGroupActual() {
    //   await this.$services.actual.getListGroupActual(
    //     (response) => {
    //       if (response.listReceiver && response.listReceiver.length > 0) {
    //         this.account_receivers = response.listReceiver.map((item) => {
    //           return { label: item.name, value: Number(item.group_id) }
    //         })
    //       }
    //     },
    //     (err) => this.notifyError(err.error.error)
    //   )
    // },
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
    async getListGroup() {
      await this.$services.group.getListGroup(
        {},
        (response) => {
          if (response.data && response.data.length > 0) {
            this.groups = response.data.map((item) => {
              return { label: item.name, value: Number(item.group_id) }
            })
          }
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    async searchActualReport() {
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
      await this.$services.actual.searchActualReport(
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
        account_sent: this.$authInfo.username(),
        title: '',
        reason: '',
        groupCompany: '',
        late_time: '',
        start_date: '',
        end_date: '',
        account_receiver: '',
        cc_mail_ids: '',
        content: '',
        response_msg: '',
        status: '',
        radio: 1,
      }
    },
  },
}
</script>
