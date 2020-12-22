<template>
  <section-block title="Dashboard">
    <el-row :gutter="12" class="row">
      <div class="column">
        <el-card shadow="always">
          <div class="number-req">
            <label>{{ dataDashboard.personal_request }}</label>
            <i class="el-icon-folder-opened"></i>
          </div>
          <label>Personal Request</label>
        </el-card>
      </div>
      <div class="column">
        <el-card shadow="always">
          <div class="number-req">
            <label>{{ dataDashboard.personal_absence }}</label>
            <i class="el-icon-document"></i>
            
          </div>
          <label><a href="http://localhost:3000/staff/request/absence">Personal Absence Request</a></label>
        </el-card>
      </div>
      <div class="column">
        <el-card shadow="always">
          <div class="number-req">
            <label>{{ dataDashboard.personal_ot_request }}</label>
            <i class="el-icon-timer"></i>
          </div>
          <label>Personal OT Request</label>
        </el-card>
      </div>
      <div class="column">
        <el-card shadow="always">
          <div class="number-req">
            <label>{{ dataDashboard.personal_explaned }}</label>
            <i class="el-icon-document"></i>
          </div>
          <label>Personal Exception cases</label>
        </el-card>
      </div>
      <div class="column">
        <el-card shadow="always">
          <div class="number-req">
            <label>{{ dataDashboard.personal_exception }}</label>
            <i class="el-icon-document"></i>
          </div>
          <label>Personal Explanation</label>
        </el-card>
      </div>
    </el-row>
    <div class="table-data">
      <section class="group-filter">
        <label>Request Summary</label>
      </section>
      <div class="container" style="max-width: 90%">
        <div class="row">
          <div class="col-sm">
            <label class="title">Absence</label>
            <div class="pending">
              <label class="sub-title">Pending</label>
              <el-progress
                :text-inside="true"
                :stroke-width="30"
                :percentage="
                  (dataDashboard.absence_request_pending /
                    (dataDashboard.absence_request_pending +
                      dataDashboard.absence_request_approved +
                      dataDashboard.absence_request_rejected)) *
                  100
                "
                class="percent"
                status="warning"
                :show-text="false"
              />
              <label class="value">
                {{ dataDashboard.absence_request_pending }}
              </label>
            </div>
            <div class="pending">
              <label class="sub-title">Approved</label>
              <el-progress
                :text-inside="true"
                :stroke-width="30"
                :percentage="
                  (dataDashboard.absence_request_approved /
                    (dataDashboard.absence_request_pending +
                      dataDashboard.absence_request_approved +
                      dataDashboard.absence_request_rejected)) *
                  100
                "
                class="percent"
                status="success"
                :show-text="false"
              />
              <label class="value">
                {{ dataDashboard.absence_request_approved }}
              </label>
            </div>
            <div class="pending">
              <label class="sub-title">Rejected</label>
              <el-progress
                :text-inside="true"
                :stroke-width="30"
                :percentage="
                  (dataDashboard.absence_request_rejected /
                    (dataDashboard.absence_request_pending +
                      dataDashboard.absence_request_approved +
                      dataDashboard.absence_request_rejected)) *
                  100
                "
                class="percent"
                status="exception"
                :show-text="false"
              />
              <label class="value">
                {{ dataDashboard.absence_request_rejected }}
              </label>
            </div>
          </div>

          <div class="col-sm">
            <label class="title">OverTime</label>
            <div class="pending">
              <label class="sub-title">Pending</label>
              <el-progress
                :text-inside="true"
                :stroke-width="30"
                :percentage="
                  (dataDashboard.ot_request_pending /
                    (dataDashboard.ot_request_pending +
                      dataDashboard.ot_request_approved +
                      dataDashboard.ot_request_rejected)) *
                  100
                "
                class="percent"
                status="warning"
                :show-text="false"
              />
              <label class="value">
                {{ dataDashboard.ot_request_pending }}
              </label>
            </div>
            <div class="pending">
              <label class="sub-title">Approved</label>
              <el-progress
                :text-inside="true"
                :stroke-width="30"
                :percentage="
                  (dataDashboard.ot_request_approved /
                    (dataDashboard.ot_request_pending +
                      dataDashboard.ot_request_approved +
                      dataDashboard.ot_request_rejected)) *
                  100
                "
                class="percent"
                status="success"
                :show-text="false"
              />
              <label class="value">
                {{ dataDashboard.ot_request_approved }}
              </label>
            </div>
            <div class="pending">
              <label class="sub-title">Rejected</label>
              <el-progress
                :text-inside="true"
                :stroke-width="30"
                :percentage="
                  (dataDashboard.ot_request_rejected /
                    (dataDashboard.ot_request_pending +
                      dataDashboard.ot_request_approved +
                      dataDashboard.ot_request_rejected)) *
                  100
                "
                class="percent"
                status="exception"
                :show-text="false"
              />
              <label class="value">
                {{ dataDashboard.ot_request_rejected }}
              </label>
            </div>
          </div>
          <div class="col-sm">
            <label class="title">Exception cases</label>
            <div class="pending">
              <label class="sub-title">Pending</label>
              <el-progress
                :text-inside="true"
                :stroke-width="30"
                :percentage="
                  (dataDashboard.exception_request_pending /
                    (dataDashboard.exception_request_pending +
                      dataDashboard.exception_request_approved +
                      dataDashboard.exception_request_rejected)) *
                  100
                "
                class="percent"
                status="warning"
                :show-text="false"
              />
              <label class="value">
                {{ dataDashboard.exception_request_pending }}
              </label>
            </div>
            <div class="pending">
              <label class="sub-title">Approved</label>
              <el-progress
                :text-inside="true"
                :stroke-width="30"
                :percentage="
                  (dataDashboard.exception_request_approved /
                    (dataDashboard.exception_request_pending +
                      dataDashboard.exception_request_approved +
                      dataDashboard.exception_request_rejected)) *
                  100
                "
                class="percent"
                status="success"
                :show-text="false"
              />
              <label class="value">
                {{ dataDashboard.exception_request_approved }}
              </label>
            </div>
            <div class="pending">
              <label class="sub-title">Rejected</label>
              <el-progress
                :text-inside="true"
                :stroke-width="30"
                :percentage="
                  (dataDashboard.exception_request_rejected /
                    (dataDashboard.exception_request_pending +
                      dataDashboard.exception_request_approved +
                      dataDashboard.exception_request_rejected)) *
                  100
                "
                class="percent"
                status="exception"
                :show-text="false"
              />
              <label class="value">
                {{ dataDashboard.exception_request_rejected }}
              </label>
            </div>
          </div>
          <div class="col-sm">
            <label class="title">Explanation</label>
            <div class="pending">
              <label class="sub-title">Pending</label>
              <el-progress
                :text-inside="true"
                :stroke-width="30"
                :percentage="
                  (dataDashboard.explaned_pending /
                    (dataDashboard.explaned_pending +
                      dataDashboard.explaned_approved +
                      dataDashboard.explaned_rejected)) *
                  100
                "
                class="percent"
                status="warning"
                :show-text="false"
              />
              <label class="value">
                {{ dataDashboard.explaned_pending }}
              </label>
            </div>
            <div class="pending">
              <label class="sub-title">Approved</label>
              <el-progress
                :text-inside="true"
                :stroke-width="30"
                :percentage="
                  (dataDashboard.explaned_approved /
                    (dataDashboard.explaned_pending +
                      dataDashboard.explaned_approved +
                      dataDashboard.explaned_rejected)) *
                  100
                "
                class="percent"
                status="success"
                :show-text="false"
              />
              <label class="value">
                {{ dataDashboard.explaned_approved }}
              </label>
            </div>
            <div class="pending">
              <label class="sub-title">Rejected</label>
              <el-progress
                :text-inside="true"
                :stroke-width="30"
                :percentage="
                  (dataDashboard.explaned_rejected /
                    (dataDashboard.explaned_pending +
                      dataDashboard.explaned_approved +
                      dataDashboard.explaned_rejected)) *
                  100
                "
                class="percent"
                status="exception"
                :show-text="false"
              />
              <label class="value">
                {{ dataDashboard.explaned_rejected }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section-block>
</template>
<style lang="scss" scoped>
.row {
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
.el-progress-bar__outer {
  border-radius: 0px !important;
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
        margin: 30px 15px;
        display: flex;
        label {
          text-align: center;
        }
        .sub-title {
          text-align: left;
          flex: 3;
        }
        .percent {
          flex: 4;
        }
        .value {
          flex: 1;
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
import FrontendBase from '~/components/layouts/FrontendBase'

export default {
  components: {},
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'staff',
  data() {
    return {
      dataDashboard: '',
      startDate: '',
      endDate: '',
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.startLoading()
      this.$services.dashboard.dashboardStaff(
        this.$authInfo.id(),
        (response) => {
          this.dataDashboard = response.data
          this.endLoading()
        },
        (err) => {
          this.notifyError(err.error.error)
          this.endLoading()
        }
      )
    },
  },
}
</script>
