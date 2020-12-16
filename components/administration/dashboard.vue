<template>
  <section-block title="Dashboard">
    <el-row :gutter="12">
      <el-col :span="6">
        <el-card style="padding: 20px 40px" shadow="always">
          <div class="number-req">
            <label>{{ dataDashboard.totalAccount }}</label>
            <i class="el-icon-folder-opened"></i>
          </div>
          <label>Total Users</label>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="padding: 20px 40px" shadow="always">
          <div class="number-req">
            <label>{{ dataDashboard.totalSite }}</label>
            <i class="el-icon-timer"></i>
          </div>
          <label>Onsite User</label>
        </el-card>
      </el-col>
    </el-row>
    <div class="table-data">
      <section class="group-filter">
        <label>Request Summary</label>
        <el-select
          v-if="$authInfo.role() != constant.Role.STAFF"
          v-model="group"
        />

        <el-button class="button-delete-multi" type="primary">
          <i class="el-icon-search"></i>
        </el-button>
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
    },
    mappingDataChart(data) {
      const totalAccount = data.map((item) => item.totalAccount)
      const totalAbsenceRequest = data.map((item) => item.totalAbsenceRequest)
      const totalExceptionCaseRequest = data.map(
        (item) => item.totalExceptionCaseRequest
      )

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
      ]
    },
  },
}
</script>
