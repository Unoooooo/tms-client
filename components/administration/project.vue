<template>
  <section-block title="Manage Project">
    <div>
      <section class="project-filter">
        <el-input
          v-model="projectSearch"
          placeholder="Project"
          class="input-search"
          clearable
        />
        <el-input
          v-model="groupSearch"
          placeholder="Group"
          class="input-search"
          clearable
        />

        <el-button
          class="button-delete-multi"
          type="primary"
          @click="searchProject()"
        >
          <i class="el-icon-search"></i>
        </el-button>

        <el-button
          class="button-delete-multi"
          type="primary"
          @click="getListProject(page, size)"
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
        <el-table-column
          class-name="text-left"
          prop="name"
          sortable
          :label="$t('Project Name')"
        />
        <el-table-column
          class-name="text-left"
          prop="group_name"
          :label="$t('Group Name')"
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
              <label class="col-sm-3 col-form-label">Project Name</label>
              <div class="col-sm-8 data-detail">
                {{ project.name }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Group Name</label>
              <div class="col-sm-8 data-detail">
                {{ project.group_name }}
              </div>
            </div>
          </div>

          <el-form v-else ref="dataForm" :rules="rules" :model="project">
            <h6 v-if="dialogMode === 'update'">
              {{ $t('No.') + rowSelected }}
            </h6>
            <hr />
            <div class="form-group row" style="margin-top: 1rem">
              <label class="col-sm-3 col-form-label"
                >Project Name <span>*</span></label
              >
              <el-form-item prop="name" class="col-sm-8">
                <el-input v-model="project.name" />
              </el-form-item>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label"
                >Group Name <span>*</span></label
              >
              <el-form-item prop="group_name" class="col-sm-8">
                <el-select
                  v-model="project.group_name"
                  placeholder="Please select group"
                  class="col-sm-8 pl-0"
                >
                  <el-option
                    v-for="item in groups"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
          <hr class="mb-0" />
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormWithInput = false">Cancel</el-button>
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
label {
  text-align: center;
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

.project-filter {
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
      tableData: [],
      groupSearch: '',
      projectSearch: '',
      dialogFormWithInput: false,
      dialogMode: '',
      titlePopup: '',
      nameUpdate: '',
      groups: [],
      projects: [],
      rules: {
        name: this.validateRequired('project name'),
        group_name: this.validateRequired('group name'),
      },
      project: {
        id: '',
        name: '',
        project_code: '',
        group_name: '',
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
    this.getListProject(this.page, this.size)
    this.getListGroup()
  },
  methods: {
    async getListProject(page, size) {
      let params = {
        page: page - 1,
        size,
      }
      this.loading = true
      await this.$services.project.getListProject(
        params,
        (response) => {
          if (response.data && response.data.length > 0) {
            this.tableData = response.data
            this.totalPages = response.totalPages

            this.projects = response.data.map((item) => {
              return { label: item.name, value: Number(item.project_id) }
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
    async getListGroup() {
      await this.$services.group.getListGroup(
        {},
        (response) => {
          if (response.data && response.data.length > 0) {
            this.groups = response.data.map((item) => {
              return { label: item.name, value: item.group_id }
            })
          }
        },
        (err) => this.notifyError(err.error.error)
      )
    },

    async searchProject() {
      this.loading = true
      await this.$services.project.searchProject(
        this.projectSearch,
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
    changePageData(page) {
      this.getListProject(page, this.size)
      this.page = page
      const roleValue = this.$authInfo.roleValue()
      this.$router.push({
        name: `${roleValue}-administration-project`,
        query: { page, size: this.size },
      })
    },
    resetDataGroup() {
      this.project = {
        id: undefined,
        name: '',
        project_code: '',
      }
    },
    handleCreate() {
      this.titlePopup = 'Create Project'
      this.dialogMode = 'create'
      this.dialogFormWithInput = true

      this.resetDataGroup()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(index, row) {
      this.titlePopup = 'Edit Project'
      this.dialogMode = 'update'
      this.dialogFormWithInput = true
      this.project = Object.assign({}, row)
      this.nameUpdate = this.project.name
      this.rowSelected = index + 1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleInfo(index, row) {
      this.titlePopup = 'View Project'
      this.dialogMode = 'detail'
      this.dialogFormWithInput = true
      this.project = Object.assign({}, row)
      this.rowSelected = index + 1
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$services.project.createProject(
            this.project,
            (res) => {
              this.getListProject(this.page, this.size)
              this.dialogFormWithInput = false
              this.notifySuccess(res.message)
            },
            (err) => {
              this.notifyError(err.error.error)
            }
          )
        } else {
          this.focusError()
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = {
            group_name: this.project.group_name,
          }
          if (this.nameUpdate !== this.project.name) {
            data.name = this.project.name
          }

          this.$services.project.updateProject(
            this.nameUpdate,
            data,
            (res) => {
              this.getListProject(this.page, this.size)
              this.dialogFormWithInput = false
              this.notifySuccess(res.message)
            },
            (err) => {
              this.notifyError(err.error.error)
            }
          )
        } else {
          this.focusError()
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
        this.$services.project.deleteProject(
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
          this.$services.project.deleteProject(
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
