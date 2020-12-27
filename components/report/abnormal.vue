<template>
  <section-block title="Abnormal Report">
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
          placeholder="Start Date"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
          class="date-picker"
        />

        <el-date-picker
          v-model="endDate"
          type="date"
          placeholder="End Date"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
          class="date-picker"
        />

        <el-button
          class="button-delete-multi"
          type="primary"
          @click="searchAbnormalRequest()"
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
            {{
              row.dateTimeSheet
                ? showDateTime(row.dateTimeSheet, 'DD/MM/YYYY')
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column
          class-name="text-center"
          prop="checkInTime"
          :label="$t('Check In')"
        />
        <el-table-column
          class-name="text-center"
          prop="checkOutTime"
          :label="$t('Check Out')"
        />
        <el-table-column
          class-name="text-left"
          prop="abnormalType"
          :label="$t('Abnormal Type')"
          width="160px"
        />
        <el-table-column
          class-name="text-left"
          prop="status"
          sortable
          :label="$t('Status')"
          width="120px"
        >
          <template slot-scope="{ row }">
            {{ row.status === 'Explained' ? 'Explained' : ' ' }}
          </template>
        </el-table-column>

        <el-table-column
          class-name="text-center"
          prop="action"
          :label="$t('Action')"
          width="110px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 'Explained'"
              class="button-action"
              type="primary"
              @click="handleInfo(scope.$index, scope.row)"
            >
              <i class="el-icon-user"></i>
            </el-button>
            <el-button
              v-if="
                scope.row.status !== 'Explained' &&
                user.account_id === scope.row.accountId
              "
              class="button-action"
              type="primary"
              @click="handleCreate(scope.$index, scope.row)"
            >
              <i class="el-icon-circle-plus"></i>
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
              <label class="col-sm-3 col-form-label">Type</label>
              <div class="col-sm-8 data-detail">
                {{ abnormal.type }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Account</label>
              <div class="col-sm-8 data-detail">
                {{ abnormal.account_sent }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Group</label>
              <div class="col-sm-8 data-detail">
                {{ abnormal.groupName }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Abnormal Type</label>
              <div class="col-sm-8 data-detail">
                {{ abnormal.type }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Explan In Time</label>
              <div class="col-sm-7 data-detail">
                {{ abnormal.explanInTime }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Explan Out Time</label>
              <div class="col-sm-7 data-detail">
                {{ abnormal.explanOutTime }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Status</label>
              <div class="col-sm-8 data-detail">
                {{ abnormal.status }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Note</label>
              <div class="col-sm-8 data-detail">
                {{ abnormal.content }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Message</label>
              <div class="col-sm-8 data-detail">
                {{ abnormal.message }}
              </div>
            </div>
          </div>
          <el-form v-else ref="dataForm" :rules="rules" :model="request">
            <el-row :gutter="20">
              <el-col :span="24">
                <div class="form-group row">
                  <label class="col-sm-2 col-form-label">Title</label>
                  <el-form-item prop="title" class="col-sm-9">
                    <el-input v-model="request.title" />
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
                <!-- <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Receiver</label>
                  <el-form-item prop="account_receiver" class="col-sm-8">
                    <el-input v-model="request.account_receiver" />
                  </el-form-item>
                </div> -->
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Request type</label>
                  <el-form-item prop="abnormalType" class="col-sm-6">
                    <el-input v-model="request.abnormalType" disabled />
                  </el-form-item>
                </div>

                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">
                    Explain In <span>*</span>
                  </label>
                  <el-form-item prop="explanInTime" class="col-sm-4">
                    <el-time-select
                      v-model="request.explanInTime"
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
                      v-model="request.account_receiver"
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
                      v-model="request.explanOutTime"
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
              <el-form-item prop="content" class="col-sm-9">
                <el-input v-model="request.content" type="textarea" />
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
        late_time: this.validateRequired('late time'),
        soon_time: this.validateRequired('soon time'),
        start_date: this.validateRequired('start date'),
        end_date: this.validateRequired('end date'),
        account_receiver: this.validateRequired('account_receiver'),
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
  async created() {
    //http://localhost:3000/humanresources/report/abnormal?page=1&size=2
    const query = this.$route.query
    if (query.page) {
      this.page = query.page
    }
    if (query.size) {
      this.size = query.size
    }
    await this.getUserInfo()
    await this.getListGroupAbnormal()
    await this.getListAbnormal(this.page, this.size)
    await this.getListAbnormalReceiver()
  },
  methods: {
      async fetch() {
        this.userName = ''
        this.groupSearch = ''
        this.startDate = ''
        this.endDate = ''
        await this.getListAbnormal(1, this.size)
        this.page = 1
        this.$router.push({name: this.$route.name, query: {
          page: 1
        }})
      },
     async getListAbnormal(page, size) {
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
        let excelParam = {...params};
        excelParam.page = 0;
        excelParam.size = 1000;
        await this.$services.abnormal.getListAbnormal(
          excelParam,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.titleExcel = '';
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
        //list
        await this.$services.abnormal.getListAbnormal(
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
        //excel
        let excelParam = {...params};
        excelParam.page = 0;
        excelParam.size = 1000;
        await this.$services.abnormal.getListAbnormal(
          excelParam,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.titleExcel = '';
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
        //list
        await this.$services.abnormal.getListAbnormal(
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
    async getUserInfo() {
      await this.$services.common.getUserInfo(
        (response) => {
          this.user = response.data
          console.log(this.user)
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    async getListAbnormalReceiver() {
      await this.$services.abnormal.getListAbnormalReceiver(
        (response) => {
          if (response.listReceiver && response.listReceiver.length > 0) {
            this.account_receivers = response.listReceiver.map((item) => {
              return { label: item.username, value: item.username }
            })
          }
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    async getListGroupAbnormal() {
      await this.$services.abnormal.getListGroupAbnormal(
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
    async searchAbnormalRequest() {
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
      //excel
      let excelParam = {...params};
      excelParam.page = 0;
      excelParam.size = 1000;
      await this.$services.abnormal.searchAbnormalRequest(
        excelParam,
        (response) => {
          console.log(0)
          if (response.data && response.data.length > 0) {
            console.log(1)
            this.excelData = response.data
            this.titleExcel = '';
            for (let index = 0; index < this.excelData.length; index++) {
                  if(this.excelData[index].status === true){
                    this.excelData[index].status = 'Explained';
                  }else{
                    this.excelData[index].status = ' ';
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
            this.excelData = []
            // this.titleExcel += 'Account: | Group: | Start Date: '+ response.startDate +'| End Date: '+ response.endDate + '';           
          }
        },
        (err) => {
          console.log(3)
          this.excelData = []
          // this.titleExcel += 'Account: | Group: | Start Date: '+ response.startDate +'| End Date: '+ response.endDate + '';
          // this.notifyError(err.error.error)
        }
      )
      //list
      await this.$services.abnormal.searchAbnormalRequest(
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
    async getInfo(accountId, explanId) {
      this.startLoading()
      console.log(accountId)
      console.log(explanId)
      await this.$services.abnormal.detailAbnormal(
        accountId,
        explanId,
        (response) => {
          if (response && response.data) {
            this.abnormal = response.data
            console.log(response)
          }
          this.endLoading()
        },
        (err) => {
          this.endLoading()
          this.notifyError(err.error.error)
        }
      )
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    changePageData(page) {
      this.getListAbnormal(page, this.size)
      this.page = page
      this.$router.push({name: this.$route.name, query: {
        page: page
      }})
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
    handleCreate(index, row) {
      this.dialogMode = 'create'
      this.titlePopup = 'Create Explanation'
      this.dialogFormWithInput = true
      this.request = Object.assign({}, row)
      console.log(this.request)
      this.rowSelected = index + 1
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
          this.getListAbnormalStaff(this.page, this.size)
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
          this.getListAbnormalStaff(this.page, this.size)
          this.showFormMessage = false
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
    },
    async handleInfo(index, row) {
      this.titlePopup = 'Detail'
      this.dialogMode = 'detail'
      this.request = Object.assign({}, row)
      console.log(row)
      this.rowSelected = index + 1
      await this.getInfo(row.accountId, row.explanationId)
      console.log(this.abnormal)
      this.dialogFormWithInput = true
    },
    handleUpdate(index, row) {
      this.explanation = Object.assign({}, row)
      this.dialogMode = 'update'
      this.titlePopup = 'Edit Absence'
      this.dialogFormWithInput = true
      this.rowSelected = index + 1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$services.explanation.createExplanation(
            { ...this.request, type: this.request.abnormalType },
            () => {
              this.dialogFormWithInput = false
              this.$router.push({
                name: `${this.$authInfo.roleValue()}-request-explanation`,
              })
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
          this.notifySuccess('coding')
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
