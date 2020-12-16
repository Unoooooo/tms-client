<template>
  <div>
    <section-block title="Day Reincarnation" style="margin-top: 30px">
       <table class="table">
        <tr class="tr">
            <th class="th" colspan="2">Job information </th>
        </tr>
        <tr class="tr">
            <td class="td">Có chắc là chia tay rồi mình sẽ không đau Có chắc là ta sẽ ko nhớ thương? Có chắc khi mỗi đêm về mình lang thang phố lạnh Và đội bàn tay không vô tình ôm vào hư không</td>
            <td class="td"><el-button type="danger" @click="dailyTimesheet()">
            DailyTimesheet
          </el-button></td>
            
        </tr>
        <tr class="tr">
            <td class="td">Có chắc là chia tay rồi mình sẽ không đau Có chắc là ta sẽ ko nhớ thương? Có chắc khi mỗi đêm về mình lang thang phố lạnh Và đội bàn tay không vô tình ôm vào hư không</td>
            <td class="td"><el-button type="danger" @click="rejectRequest()">
            Reject Request
          </el-button></td>
           
        </tr>
         <tr class="tr">
            <td class="td">Có chắc là chia tay rồi mình sẽ không đau Có chắc là ta sẽ ko nhớ thương? Có chắc khi mỗi đêm về mình lang thang phố lạnh Và đội bàn tay không vô tình ôm vào hư không</td>
            <td class="td"><el-button type="danger" @click="jobDashBoardStaff()">
            DashBoard Staff
          </el-button></td>
           
        </tr>
         <tr class="tr">
            <td class="td">Có chắc là chia tay rồi mình sẽ không đau Có chắc là ta sẽ ko nhớ thương? Có chắc khi mỗi đêm về mình lang thang phố lạnh Và đội bàn tay không vô tình ôm vào hư không</td>
            <td class="td"><el-button type="danger" @click="jobDashBoardGroupManager()">
            DashBoard Group Manager
          </el-button></td>
           
        </tr>
        <tr class="tr">
            <td class="td">Có chắc là chia tay rồi mình sẽ không đau Có chắc là ta sẽ ko nhớ thương? Có chắc khi mỗi đêm về mình lang thang phố lạnh Và đội bàn tay không vô tình ôm vào hư không</td>
            <td class="td"><el-button type="danger" @click="jobDashBoardAdminHr()">
           DashBoard Admin-Hr
          </el-button></td>
           
        </tr>
        
    </table>
     </section-block>
    
  </div>
</template>

<style lang="scss" scoped>
.table{
  border: 1px solid #000;
  .tr{
     border: 1px solid #000;
     .td{
        border: 1px solid #000;
     }
     .th{
        border: 1px solid #000;
        text-align: center;
        font-size: 20px;
        text-transform: uppercase;
        
     }
  }
}
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
.jobservice {
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
    jobDashBoardGroupManager() {
      this.$services.systemSetting.jobDashBoardGroupManager(
        (res) => {
          this.notifySuccess(res.message)
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
    },
        jobDashBoardStaff() {
      this.$services.systemSetting.jobDashBoardStaff(
        (res) => {
          this.notifySuccess(res.message)
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
    },
      jobDashBoardAdminHr() {
      this.$services.systemSetting.jobDashBoardAdminHr(
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
