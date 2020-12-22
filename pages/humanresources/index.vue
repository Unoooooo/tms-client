<template>
  <section-block title="Dashboard">
    <el-row :gutter="12" class="row">
       <div class="column1"></div>
       <div class="column1">
        <el-card shadow="always">
          <div class="number-req">
            <label>{{ dataDashboard.totalAccount }}</label>
            <i class="el-icon-folder-opened"></i>
          </div>
          <label>Total Users</label>
        </el-card>
      </div>
      <div class="column1">
        <el-card shadow="always">
          <div class="number-req">
            <label>{{ dataDashboard.totalGroup }}</label>
            <i class="el-icon-folder-opened"></i>
          </div>
          <label>Total Group</label>
         </el-card>
      </div>
       <div class="column1"></div>
    </el-row>
    <el-row :gutter="12" class="row">
      <div class="column">
        <el-card shadow="always">
          <div class="number-req">
            <label>{{ dataDashboardStaff.personal_request }}</label>
            <i class="el-icon-folder-opened"></i>
          </div>
          <label>Personal Request</label>
        </el-card>
      </div>
      <div class="column">
        <el-card shadow="always">
          <div class="number-req">
            <label>{{ dataDashboardStaff.personal_absence }}</label>
            <i class="el-icon-document"></i>
          </div>
          <label>Personal Absence Request</label>
        </el-card>
      </div>
      <div class="column">
        <el-card shadow="always">
          <div class="number-req">
            <label>{{ dataDashboardStaff.personal_ot_request }}</label>
            <i class="el-icon-timer"></i>
          </div>
          <label>Personal OT Request</label>
        </el-card>
      </div>
      <div class="column">
        <el-card shadow="always">
          <div class="number-req">
            <label>{{ dataDashboardStaff.personal_explaned }}</label>
            <i class="el-icon-document"></i>
          </div>
          <label>Personal Exception cases</label>
        </el-card>
      </div>
      <div class="column">
        <el-card shadow="always">
          <div class="number-req">
            <label>{{ dataDashboardStaff.personal_exception }}</label>
            <i class="el-icon-document"></i>
          </div>
          <label>Personal Explanation</label>
        </el-card>
      </div>
    </el-row>

    <div class="table-data">
      <section class="group-filter">
        <label>Request Summary</label>
        <!-- <el-select
          v-if="$authInfo.role() != constant.Role.STAFF"
          v-model="group"
        />

        <el-button class="button-delete-multi" type="primary">
          <i class="el-icon-search"></i>
        </el-button> -->
      </section>
      <div class="container">
        <div class="row">
          <div class="col-md">
            <VueApexCharts
              type="line"
              height="400"
              :options="chartOptions"
              :series="series"
            />
          </div>
        </div>
      </div>
    </div>
  </section-block>
</template>

<style lang="scss" scoped>
.row {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  .column {
    padding: 0px 6px;
    width: 20%;
    margin-bottom: 10px;
    min-width: 200px;
    .el-card {
      height: 100%;
    }
  }
 .column1{
 padding: 0px 6px;
    width: 25%;
    margin-bottom: 10px;
    min-width: 200px;
   }
}
.number-req {
  label {
    font-size: 30px;
  }
  i {
    float: right;
    font-size: 3rem;
  }
}
.table-data {
  border: 1px solid #e2e8f0;
  margin-top: 20px;
}
.container {
  .row {
    .col-sm {
      margin: 20px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .title {
        font-size: 30x;
        font-weight: bold;
        border-bottom: 1px solid #e2e8f0;
        margin-top: 30px;
        width: 100%;
      }
      .pending {
        margin: 30px;
        display: flex;
        label {
          text-align: center;
        }
        .sub-title {
          text-align: left;
          flex: 2;
        }
        .percent {
          flex: 3;
          border: 1px solid red;
          &.pc-approved {
            border: 1px solid green;
          }
          &.pc-rejected {
            border: 1px solid blue;
          }
        }
        .value {
          flex: 2;
        }
      }
    }
  }
}
.el-select {
  padding-right: 0;
}
.group-filter {
  max-width: 1280px;
  margin: auto;
  margin-top: 20px;
  margin-bottom: 5px;
  padding: 0 15px;
  .gr-button {
    float: right;
  }
  label {
    min-width: 30%;
    font-size: 30px;
    font-weight: bold;
  }
}
</style>

<script>
import validate from '@/helpers/custom-rules-validate'
import Constant from '~/constant'

export default {
  components: {
    VueApexCharts: () => import('vue-apexcharts'),
  },
  mixins: [validate],
  layout: 'admin',
  middleware: 'auth',
  data() {
    return {
      constant: Constant,
      loading: false,
      tableData: [],
      startDate: '',
      endDate: '',
      group: [],
      dataDashboard: {},
      dataDashboardStaff: {},
      series: [
        {
          name: 'Desktops',
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          height: 400,
          type: 'line',
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'straight',
        },
        title: {
          text: '',
          align: 'left',
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5,
          },
        },
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        xaxis: {
          categories: [],
        },
      },
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.startLoading()
      this.$services.dashboard.dashboardAdmin(
        (response) => {
          if (response.data) {
            this.dataDashboard = response.data
            this.mappingDataChart(response.data.list)
          }
          this.endLoading()
        },
        (err) => {
          this.notifyError(err.error.error)
          this.endLoading()
        }
      )
      this.$services.dashboard.dashboardStaff(
        this.$authInfo.id(),
        (response) => {
          this.dataDashboardStaff = response.data;
          console.log(response.data)
          this.endLoading()
        },
        (err) => {
          this.notifyError(err.error.error)
          this.endLoading()
        }
      )
    },
    mappingDataChart(data) {
      let labels = []
      let totalAccount = []
      let totalAbsenceRequest = []
      let totalExceptionCaseRequest = []
      let totalExplanationRequest = []
      let totalOtRequest = []

      data.forEach((element) => {
        labels.push(element.date)
        totalAccount.push(element.totalAccount)
        totalAbsenceRequest.push(element.totalAbsenceRequest)
        totalExceptionCaseRequest.push(element.totalExceptionCaseRequest)
        totalExplanationRequest.push(element.totalExplanationRequest)
        totalOtRequest.push(element.totalOtRequest)
      })

      this.chartOptions = {
        ...this.chartOptions,
        ...{
          labels,
        },
      }

      this.series = [
        {
          name: 'Total Account',
          data: totalAccount,
        },
        {
          name: 'Total AbsenceRequest',
          data: totalAbsenceRequest,
        },
        {
          name: 'Total ExceptionCaseRequest',
          data: totalExceptionCaseRequest,
        },
        {
          name: 'Total ExplanationRequest',
          data: totalExplanationRequest,
        },
        {
          name: 'Total OTRequest',
          data: totalOtRequest,
        },
      ]
    },
  },
}
</script>
