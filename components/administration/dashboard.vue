<template>
  <section-block title="Dashboard">
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card style="padding: 20px 40px" shadow="always">
          <div class="number-req">
            <label>5</label>
            <i class="el-icon-folder-opened"></i>
          </div>
          <label>Personal Request</label>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="padding: 20px 40px" shadow="always">
          <div class="number-req">
            <label>5</label>
            <i class="el-icon-timer"></i>
          </div>
          <label>Personal OT Request</label>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="padding: 20px 40px" shadow="always">
          <div class="number-req">
            <label>5</label>
            <i class="el-icon-document"></i>
          </div>
          <label>Personal Explain</label>
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
          @click="searchRequest()"
        >
          <i class="el-icon-search"></i>
        </el-button>

        <el-button
          class="button-delete-multi"
          style="margin-left: 0"
          type="primary"
          @click="getListRequest(page, size)"
        >
          <i class="el-icon-refresh"></i>
        </el-button>
      </section>
      <div class="container">
        <div class="row">
          <div class="col-sm">
            <label class="title">Request</label>
            <div class="pending">
              <label class="sub-title">Pending</label>
              <label class="percent">0%</label>
              <label class="value">0</label>
            </div>
            <div class="pending">
              <label class="sub-title">Approved</label>
              <label class="percent pc-approved">0%</label>
              <label class="value">0</label>
            </div>
            <div class="pending">
              <label class="sub-title">Rejected</label>
              <label class="percent pc-rejected">0%</label>
              <label class="value">0</label>
            </div>
          </div>
          <div class="col-sm">
            <label class="title">OT Request</label>
            <div class="pending">
              <label class="sub-title">Pending</label>
              <label class="percent">0%</label>
              <label class="value">0</label>
            </div>
            <div class="pending">
              <label class="sub-title">Approved</label>
              <label class="percent pc-approved">0%</label>
              <label class="value">0</label>
            </div>
            <div class="pending">
              <label class="sub-title">Rejected</label>
              <label class="percent pc-rejected">0%</label>
              <label class="value">0</label>
            </div>
          </div>
          <div class="col-sm">
            <label class="title">Explained</label>
            <div class="pending">
              <label class="sub-title">Pending</label>
              <label class="percent">0%</label>
              <label class="value">0</label>
            </div>
            <div class="pending">
              <label class="sub-title">Approved</label>
              <label class="percent pc-approved">0%</label>
              <label class="value">0</label>
            </div>
            <div class="pending">
              <label class="sub-title">Rejected</label>
              <label class="percent pc-rejected">0%</label>
              <label class="value">0</label>
            </div>
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
      roles: [
        {
          value: 'ROLE_ADMIN',
          label: 'ROLE_ADMIN',
        },
        {
          value: 'ROLE_HR',
          label: 'ROLE_HR',
        },
        {
          value: 'ROLE_MANAGER',
          label: 'ROLE_MANAGER',
        },
        {
          value: 'ROLE_STAFF',
          label: 'ROLE_STAFF',
        },
      ],
    }
  },
  methods: {
    async getListRequest(page, size) {
      let params = {
        page: page - 1,
        size: size,
      }
      this.loading = true
      await this.$services.user.getListRequest(
        params,
        (response) => {
          if (response.data && response.data.length > 0) {
            this.tableData = response.data
          }
          this.loading = false
        },
        (err) => {
          this.notifyError(err.error.error)
          this.loading = false
        }
      )
    },
    async searchRequest() {
      this.loading = true
      await this.$services.user.searchRequest(
        this.startDate,
        this.endDate,
        '',
        (response) => {
          if (response.data && response.data.length > 0) {
            this.tableData = response.data
          } else {
            this.tableData = []
          }
          this.loading = false
        },
        (err) => {
          this.tableData = []
          this.notifyError(err.error.error)
          this.loading = false
        }
      )
    },
  },
}
</script>
