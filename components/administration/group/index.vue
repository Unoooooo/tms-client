<template>
  <section-block  title="Group Management">
    <div>
      <section class="group-filter">
        <el-input
          v-model="groupSearch"
          placeholder="Group"
          class="input-search"
          clearable
        />

        <el-button
          class="button-delete-multi"
          type="primary"
          @click="searchGroup()"
        >
          <i class="el-icon-search"></i>
        </el-button>

        <el-button
          class="button-delete-multi"
          type="primary"
          @click="getListGroup(page, size)"
        >
          <i class="el-icon-refresh"></i>
        </el-button>

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
        v-loading="loading"
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
          prop="name"
          sortable
          :label="$t('Group Name')"
        />
        <el-table-column
          class-name="text-left"
          prop="manager_name"
          :label="$t('Group Manager')"
        />
        <el-table-column
          class-name="text-right"
          prop="manager_phone"
          :label="$t('GM Number Phone')"
        />
        <el-table-column class-name="text-right" :label="$t('Number Member')">
          <template slot-scope="{ row }">
            {{ row.number_member }}
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
              class="button-action"
              type="warning"
              @click="handleUpdate(scope.$index, scope.row)"
            >
              <i class="el-icon-edit-outline"></i>
            </el-button>
            <el-button
              class="button-action"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
              <i class="el-icon-delete"></i>
            </el-button>
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
              <label class="col-sm-3 col-form-label">Group Name</label>
              <div class="col-sm-8 data-detail">
                {{ group.name }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Group Manager</label>
              <div class="col-sm-8 data-detail">
                {{ group.manager_name }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Group Manage Phone</label>
              <div class="col-sm-8 data-detail">
                {{ group.manager_phone }}
              </div>
            </div>
          </div>

          <el-form v-else ref="dataForm" :rules="rules" :model="group">
            <!-- <h6 v-if="dialogMode === 'update'">
              {{ $t('No.') + rowSelected }}
            </h6> -->
            <hr />
            <div class="form-group row" style="margin-top: 1rem">
              <label class="col-sm-3 col-form-label">Group Name <span>*</span></label>
              <el-form-item prop="name" class="col-sm-8">
                <el-input v-model="group.name" />
              </el-form-item>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Group Manage <span>*</span></label>
              <el-form-item prop="manager_name" class="col-sm-8">
                <el-select
                  v-model="group.manager_name"
                  placeholder="Choose group manager"
                  class="col-sm-8 pl-0"
                >
                  <el-option
                    v-for="(item, index) in staffs"
                    :key="index"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
          <hr class="mb-0" />
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormWithInput = false"> Cancel </el-button>
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
.el-select {
  width: 50%;
  padding-right: 0;
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
.label{
  text-align: center;
}

.group-filter {
  margin-bottom: 20px;
  .gr-button {
    float: right;
  }
}
.button-action {
  padding: 5px;
  margin-left: 0;
}
.pagination {
  margin-top: 30px;
}
.data-detail {
  line-height: 35px;
}
.input-search {
  width: 150px;
  margin-bottom: 10px;
}
</style>

<script>
import SimplePagination from '~/components/pagination/SimplePagination'
import validate from '@/helpers/custom-rules-validate'

export default {
  components: { SimplePagination },
  mixins: [validate],
  layout: 'admin',
  middleware: 'auth',
  data() {
    return {
      loading: false,
      tabActiveName: 'first',
      tableData: [],
      staffs: [],
      groupFilter: '',
      groupSearch: '',
      pattern: '',
      dialogFormWithInput: false,
      dialogMode: '',
      titlePopup: '',
      nameUpdate: '',
      groups: [],
      group: {
        id: '',
        name: '',
        manager_name: '',
      },
      rules: {
        name: this.validateRequired('group name'),
        manager_name: this.validateRequired('group manage'),
      },
      rowSelected: null,
      multipleSelection: [],
      totalPages: 1,
      page: 1,
      size: undefined,
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
    this.getListGroup(this.page, this.size)
    this.getListStaff()
  },
  methods: {
    async getListGroup(page, size) {
      let params = {
        page: page - 1,
        size: size,
      }
      this.loading = true
      await this.$services.group.getListGroup(
        params,
        (response) => {
          if (response.data && response.data.length > 0) {
            this.tableData = response.data
            this.totalPages = response.totalPages

            this.groups = response.data.map((item) => {
              return { label: item.name, value: item.group_id }
            })
          }
          this.loading = false
        },
        (err) => {
          this.notifyError(err.error.error)
          this.loading = false
        }
      )
    },

    async searchGroup() {
      this.loading = true
      await this.$services.group.searchGroup(
        this.groupSearch,
        '',
        (response) => {
          if (response.data && response.data.length > 0) {
            this.tableData = response.data
            this.totalPages = response.totalPages
          } else {
            this.tableData = []
            this.totalPages = 0
          }
          this.loading = false
        },
        (err) => {
          this.tableData = []
          this.totalPages = 0
          this.notifyError(err.error.error)
          this.loading = false
        }
      )
    },

    async getListStaff() {
      await this.$services.user.getListStaff(
        (response) => {
          this.staffs = response.username
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
    },
    changePageData(page) {
      this.getListGroup(page, this.size)
      this.page = page
      const roleValue = this.$authInfo.roleValue()
      this.$router.push({
        name: `${roleValue}-administration-group`,
        query: { page, size: this.size },
      })
    },
    resetDataGroup() {
      this.group = {
        id: undefined,
        name: '',
        manager_name: '',
      }
    },
    handleCreate() {
      this.titlePopup = 'Create Group'
      this.dialogMode = 'create'
      this.dialogFormWithInput = true

      this.resetDataGroup()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(index, row) {
      this.titlePopup = 'Edit Group'
      this.dialogMode = 'update'
      this.dialogFormWithInput = true
      this.group = Object.assign({}, row)
      this.nameUpdate = this.group.name
      this.rowSelected = index + 1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleInfo(index, row) {
      console.log(index + '/' + row)
      this.$router.push({
        name: 'admin-administration-group-id',
        params: { id: row.name },
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$services.group.createGroup(
            this.group,
            (res) => {
              this.getListGroup(this.page, this.size)
              this.getListStaff()
              this.dialogFormWithInput = false
              this.notifySuccess(res.message)
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
          const data = {
            ...this.group,
          }
          // if (this.nameUpdate === data.name) {
          //   delete data.name
          // }
          this.$services.group.updateGroup(
            this.nameUpdate,
            data,
            (res) => {
              this.getListGroup(this.page, this.size)
              this.dialogFormWithInput = false
              this.notifySuccess(res.message)
            },
            (err) => {
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
        this.$services.group.deleteGroup(
          row.name,
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
          this.$services.group.deleteGroup(
            element.name,
            (res) => {
              const data = this.tableData.filter(
                (item) => item.name !== element.name
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
  },
}
</script>
