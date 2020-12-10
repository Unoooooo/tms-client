<template>
  <div>
    <section-block title="System setting ">
      <el-form ref="dataForm" :rules="rules" :model="setting">
        <h4 class="mt-30 mb-10 font">Checkin - Checkout Time</h4>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">Check in time</label>

                <el-form-item prop="checkInTime" class="col-sm-2">
                  <el-time-select
                    v-model="setting.checkInTime"
                    class="select-date"
                    placeholder="Select time"
                    :picker-options="{
                      start: '06:00',
                      step: '00:15',
                      end: '23:45',
                    }"
                  />
                </el-form-item>
              </div>
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">Check out time</label>

                <el-form-item prop="checkOutTime" class="col-sm-2">
                  <el-time-select
                    v-model="setting.checkOutTime"
                    class="select-date"
                    placeholder="Select time"
                    :picker-options="{
                      start: '06:00',
                      step: '00:15',
                      end: '23:45',
                    }"
                  />
                </el-form-item>
              </div>
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">OverTime on week</label>
                <div class="col-sm-8 d-flex align-items-center">
                  <el-form-item prop="overTimeDayOfTheWeekStart">
                    <el-time-select
                      v-model="setting.overTimeDayOfTheWeekStart"
                      class="select-date"
                      placeholder="Select time"
                      :picker-options="{
                        start: '06:00',
                        step: '00:15',
                        end: '23:45',
                      }"
                    />
                  </el-form-item>
                  <el-form-item prop="overTimeDayOfTheWeekEnd">
                    <el-time-select
                      v-model="setting.overTimeDayOfTheWeekEnd"
                      class="select-date"
                      placeholder="End time"
                      :picker-options="{
                        start: '06:00',
                        step: '00:15',
                        end: '23:45',
                        minTime: setting.overTimeDayOfTheWeekStart,
                      }"
                    />
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">
                  Afternoon check in time
                </label>

                <el-form-item prop="afternoonCheckTime" class="col-sm-2">
                  <el-time-select
                    v-model="setting.afternoonCheckTime"
                    class="select-date"
                    placeholder="Select time"
                    :picker-options="{
                      start: '06:00',
                      step: '00:15',
                      end: '23:45',
                    }"
                  />
                </el-form-item>
              </div>
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">Lunch time</label>

                <el-form-item prop="lunchTime" class="col-sm-2">
                  <el-time-select
                    v-model="setting.lunchTime"
                    class="select-date"
                    placeholder="Select time"
                    :picker-options="{
                      start: '06:00',
                      step: '00:15',
                      end: '23:45',
                    }"
                  />
                </el-form-item>
              </div>
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">
                  OverTime in weekend/holiday
                </label>
                <div class="col-sm-8 d-flex align-items-center">
                  <el-form-item prop="overTimeOnWeekendStart">
                    <el-time-select
                      v-model="setting.overTimeOnWeekendStart"
                      class="select-date"
                      placeholder="Select time"
                      :picker-options="{
                        start: '06:00',
                        step: '00:15',
                        end: '23:45',
                      }"
                    />
                  </el-form-item>
                  <el-form-item prop="overTimeOnWeekendEnd">
                    <el-time-select
                      v-model="setting.overTimeOnWeekendEnd"
                      class="select-date"
                      placeholder="End time"
                      :picker-options="{
                        start: '06:00',
                        step: '00:15',
                        end: '23:45',
                        minTime: setting.overTimeOnWeekendStart,
                      }"
                    />
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <h4 class="mt-30 mb-10 font">Fingerprinters</h4>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">
                  Time Reset(minutes)
                </label>
                <el-form-item prop="timeReset" class="col-sm-3">
                  <el-input v-model="setting.timeReset" />
                </el-form-item>
              </div>
          
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">Port</label>
                <el-form-item prop="port" class="col-sm-3">
                  <el-input v-model="setting.port" />
                </el-form-item>
              </div>
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">Push Device</label>
                <el-form-item prop="pushDevice" class="col-sm-8">
                  <el-select
                    v-model="setting.pushDevice"
                    placeholder="Please select Push Device"
                    class="col-sm-4 pl-0"
                  >
                    <el-option
                      v-for="item in pushDevices"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
             
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">Ipv4</label>

                <el-form-item prop="ipv4" class="col-sm-4">
                  <el-input v-model="setting.ipv4" />
                </el-form-item>
              </div>
              <div class="form-group row">
                <label class="col-sm-3 col-form-label"> Machine Number </label>
                <el-form-item prop="machineNumber" class="col-sm-4">
                  <el-input v-model="setting.machineNumber" />
                </el-form-item>
              </div>
               <div class="form-group row">
                <label class="col-sm-3 col-form-label"> Clear Log </label>
                <el-form-item prop="clearLog" class="col-sm-8">
                  <el-select
                    v-model="setting.clearLog"
                    placeholder="Please select clearLog"
                    class="col-sm-4 pl-0"
                  >
                    <el-option
                      v-for="item in clearLogs"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div class="mt-30">
        <el-button type="primary" @click="updateData()">Save changes</el-button>
        <el-button type="danger" @click="resetData()">Reset</el-button>

      </div>
    </section-block>
    
      <section-block title="Job service" style="margin-top: 30px">
      <div>
        <section class="jobservice">
           <el-button type="danger" @click="dailyTimesheet()">
          DailyTimesheet
        </el-button>
        <el-button type="danger" @click="rejectRequest()">
          Reject Request
        </el-button>
        </section>

      </div>
    </section-block>

    <section-block title="List day off" style="margin-top: 30px">
      <div>
        <section class="project-filter">
          <div class="gr-button">
            <!-- <el-button
              class="button-delete-multi"
              type="danger"
              @click="handleDeleteMulti()"
            >
              <i class="el-icon-delete"></i>
            </el-button> -->
            <el-button class="add-new" @click="handleCreate()">
              {{ $t('Add new') }}
            </el-button>
          </div>
        </section>

        <el-table
          ref="multipleTable"
          :data="listDayOff"
          highlight-current-row
          border
          style="width: 100%"
          class="table-serenade"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column
            type="selection"
            class-name="text-center"
            width="60px"
          /> -->
          <el-table-column class-name="text-center" :label="$t('Date')">
            <template slot-scope="{ row }">
              {{ row.date ? showDateTime(row.date, 'DD/MM/YYYY') : '' }}
            </template>
          </el-table-column>
          <el-table-column
            class-name="text-left"
            prop="description"
            :label="$t('Description')"
          />
          <el-table-column
            class-name="text-center"
            prop="action"
            :label="$t('Action')"
            width="100px"
          >
            <template slot-scope="scope">
              <el-button
                class="button-action"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >
                <i class="el-icon-delete"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <section>
          <el-dialog
            title="Add date off"
            :visible.sync="dialogFormAdd"
            width="50%"
          >
            <el-form ref="dataFormAdd" :rules="rulesAddDate" :model="addOff">
              <hr />
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">Date</label>
                <div class="dialog-alert">{{ $t('(*)') }}</div>
                <el-form-item prop="workOffDate" class="col-sm-8">
                  <el-date-picker
                    v-model="addOff.workOffDate"
                    type="date"
                    placeholder="Pick a date"
                    format="dd-MM-yyyy"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
              </div>
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">Description</label>
                <div class="dialog-alert">{{ $t('(*)') }}</div>
                <el-form-item prop="contentDate" class="col-sm-8">
                  <el-input v-model="addOff.contentDate" />
                </el-form-item>
              </div>
            </el-form>
            <hr class="mb-0" />
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogFormAdd = false">Cancel</el-button>
              <el-button type="primary" @click="createData()">
                Submit
              </el-button>
            </span>
          </el-dialog>
        </section>
      </div>
    </section-block>

  
  </div>
</template>

<style lang="scss" scoped>
.el-date-editor--time-select {
  margin-right: 15px;
  max-width: 204px;
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

.demo-input-suffix .el-input {
  width: 80px;
}

.el-form-item__label {
  text-align: left;
}

.line {
  margin-top: -30px;
}

.project-filter {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}
.button-action {
  padding: 5px;
  margin-left: 0;
}
.table-serenade {
  margin: 15px 0;
}
.select-date {
  width: 140px;
}
label {
  text-align: center;
}
.font {
  font-size: 25px;
  font-weight: 100;
}
.jobservice{
  float: left;
  margin-bottom: 20px;
}
</style>

<script>
import validate from '@/helpers/custom-rules-validate'
import SectionBlock from '~/components/SectionBlock.vue'

export default {
  components: { SectionBlock },
  mixins: [validate],
  layout: 'admin',
  middleware: 'auth',
  data() {
    return {
      settingNormal: {},
      listDayOff: [],
      multipleSelection: [],
      dialogFormAdd: false,
      addOff: {
        workOffDate: '',
        contentDate: '',
      },
      setting: {
        checkInTime: '',
        checkOutTime: '',
        overTimeDayOfTheWeekStart: '',
        overTimeDayOfTheWeekEnd: '',
        afternoonCheckTime: '',
        lunchTime: '',
        overTimeOnWeekendStart: '',
        overTimeOnWeekendEnd: '',
        timeReset: '',
        clearLog: '',
        pushDevice: '',
        ipv4: '',
        port: '',
        machineNumber: '',
      },
      rules: {
        checkInTime: this.validateSelected('time'),
        checkOutTime: this.validateSelected('time'),
        overTimeDayOfTheWeekStart: this.validateSelected('time'),
        overTimeDayOfTheWeekEnd: this.validateSelected('time'),
        afternoonCheckTime: this.validateSelected('time'),
        lunchTime: this.validateSelected('time'),
        overTimeOnWeekendStart: this.validateSelected('time'),
        overTimeOnWeekendEnd: this.validateSelected('time'),
        timeReset: this.validateSelected('timeReset'),
        clearLog: this.validateSelected('clearLog'),
        pushDevice: this.validateSelected('pushDevice'),
        ipv4: this.validateSelected('ipv4'),
        port: this.validateSelected('port'),
        machineNumber: this.validateSelected('machineNumber'),
      },
      rulesAddDate: {
        workOffDate: this.validateSelected('workOffDate'),
        contentDate: this.validateSelected('description'),
      },
      pushDevices: [
        {
          value: true,
          label: 'True',
        },
        {
          value: false,
          label: 'False',
        },
      ],
      clearLogs: [
        {
          value: true,
          label: 'True',
        },
        {
          value: false,
          label: 'False',
        },
      ],
    }
  },
  created() {
    this.getSystemSetting()
    this.getListDayOff()
  },
  methods: {
    async getSystemSetting() {
      this.startLoading()
      await this.$services.systemSetting.getSystemSetting(
        (response) => {
          this.setting = response
          this.endLoading()
        },
        (err) => {
          this.endLoading()
          this.notifyError(err.error.error)
        }
      )
    },
    async getListDayOff() {
      this.startLoading()
      await this.$services.systemSetting.getListDayOff(
        (response) => {
          this.listDayOff = response.map((item) => {
            return { date: item.code, description: item.value }
          })
          this.endLoading()
        },
        (err) => {
          this.endLoading()
          this.notifyError(err.error.error)
        }
      )
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.startLoading()
          this.$services.systemSetting.updateSystemSetting(
            this.setting,
            (res) => {
              this.notifySuccess(res.message)
              this.endLoading()
            },
            (err) => {
              this.endLoading()
              this.notifyError(err.error.error)
            }
          )
        } else {
          this.focusError()
        }
      })
    },
    resetData() {
      this.setting = {
        checkInTime: '08:00',
        checkOutTime: '16:00',
        overTimeDayOfTheWeekStart: '19:00',
        overTimeDayOfTheWeekEnd: '21:00',
        afternoonCheckTime: '13:30',
        lunchTime: '12:00',
        overTimeOnWeekendStart: '08:00',
        overTimeOnWeekendEnd: '21:00',
        timeReset: '5',
        clearLog: false,
        pushDevice: true,
        ipv4: '192.168.100.201',
        port: '4370',
        machineNumber: '1',
      }
      this.updateData()
    },
    resetDataDateOff() {
      this.addOff = {
        workOffDate: '',
        contentDate: '',
      }
    },
    handleCreate() {
      this.dialogFormAdd = true
      this.resetDataDateOff()
      this.$nextTick(() => {
        this.$refs['dataFormAdd'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
          this.startLoading()
          this.$services.systemSetting.addDayOff(
            this.addOff,
            (res) => {
              this.getListDayOff()
              this.dialogFormAdd = false
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
        this.startLoading()
        this.$services.systemSetting.deleteDayOff(
          row.date,
          (res) => {
            this.endLoading()
            this.notifySuccess(res.message)
            this.listDayOff.splice(index, 1)
          },
          (err) => {
            this.endLoading()
            this.notifyError(err.error.error)
          }
        )
      })
    },
    dailyTimesheet() {
      this.$services.systemSetting.jobTimeSheet(
        (res) => {
          this.notifySuccess(res.message)
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
    },
    rejectRequest() {
      this.$services.systemSetting.rejectRequest(
        (res) => {
          this.notifySuccess(res.message)
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
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
          this.$services.systemSetting.deleteDayOff(
            element.date,
            (res) => {
              this.listDayOff = this.listDayOff.filter(
                (item) => item.date !== element.date
              )
              this.notifySuccess(res.message)
            },
            (err) => {
              this.endLoading()
              this.notifyError(err.error.error)
            }
          )
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
  },
}
</script>
