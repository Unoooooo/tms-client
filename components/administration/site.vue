<template>
  <section-block title="Manage Site">
    <div>
      <section class="project-filter">
        <el-input
          v-model="siteSearch"
          placeholder="Site"
          class="input-search"
          clearable
        />
        <el-button
          class="button-delete-multi"
          type="primary"
          @click="searchSite()"
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
          class-name="text-center"
          prop="stt"
          :label="$t('STT')"
          width="80px"
        />
        <el-table-column
          class-name="text-left"
          prop="name"
          sortable
          :label="$t('Site Name')"
        />
        <el-table-column
          class-name="text-left"
          prop="address"
          :label="$t('Address')"
        />

        <el-table-column
          class-name="text-right"
          prop="latitude"
          :label="$t('Latitude')"
        />

        <el-table-column
          class-name="text-right"
          prop="longitude"
          :label="$t('Longitude')"
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
              <label class="col-sm-3 col-form-label">Site Name</label>
              <div class="col-sm-8 data-detail">
                {{ site.name }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Address</label>
              <div class="col-sm-8 data-detail">
                {{ site.address }}
              </div>
            </div>

            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Latitude</label>
              <div class="col-sm-8 data-detail">
                {{ site.latitude }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Longitude</label>
              <div class="col-sm-8 data-detail">
                {{ site.longitude }}
              </div>
            </div>
          </div>

          <el-form v-else ref="dataForm" :rules="rules" :model="site">
            <h6 v-if="dialogMode === 'update'">
              {{ $t('No.') + rowSelected }}
            </h6>
            <hr />
            <div class="form-group row" style="margin-top: 1rem">
              <label class="col-sm-3 col-form-label">
                Site Name <span>*</span>
              </label>
              <el-form-item prop="name" class="col-sm-8">
                <el-input v-model="site.name" />
              </el-form-item>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">
                Address <span>*</span>
              </label>
              <el-form-item prop="address" class="col-sm-8">
                <el-input v-model="site.address" />
              </el-form-item>
            </div>

            <div class="form-group row">
              <label class="col-sm-3 col-form-label">
                Latitude <span>*</span>
              </label>
              <el-form-item prop="latitude" class="col-sm-8">
                <el-input v-model="site.latitude" />
              </el-form-item>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">
                Longitude <span>*</span>
              </label>
              <el-form-item prop="longitude" class="col-sm-8">
                <el-input v-model="site.longitude" />
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
label {
  text-align: center;
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
      siteSearch: '',
      dialogFormWithInput: false,
      dialogMode: '',
      titlePopup: '',
      nameUpdate: '',
      sites: [],
      rules: {
        name: this.validateRequired('site name'),
        longitude: this.validateRequired('longitude'),
        latitude: this.validateRequired('latitude'),
        address: this.validateRequired('address'),
      },
      site: {
        id: '',
        name: '',
        longitude: '',
        latitude: '',
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
    this.getListSite(this.page, this.size)
  },
  methods: {
    async fetch() {
        this.siteSearch= ''
        await this.getListSite(1, this.size)
        this.page = 1
        this.$router.push({name: this.$route.name, query: {
          page: 1
        }})
      },
    async getListSite(page, size) {
      this.tableData = []
       let params = {
        page: page - 1,
        size: size,
        sitename: this.siteSearch,

      }
      if (!this.siteSearch.length == 0 || this.siteSearch.trim()) {
        params.sitename = this.siteSearch.trim()
      }
      if (this.$authInfo.roleValue() === 'staff') {
        await this.$services.site.getListSite(
          params,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.tableData = response.data
              this.totalPages = response.totalPages
            }
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
      } else {
        await this.$services.site.getListSite(
          params,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.tableData = response.data
              this.totalPages = response.totalPages
            }
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
      }
    },

    async searchSite() {
      this.loading = true
      this.page = 0
      await this.$services.site.searchSite(
         {
          sitename: this.siteSearch,
          page: 0,
        },
        (response) => {
          if (response.data && response.data.length > 0) {
            this.tableData = response.data
            this.totalPages = response.totalPages
            this.page = 1
            this.$router.push({name: this.$route.name, query: {
              page: 1
            }})
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
      this.getListSite(page, this.size)
      this.page = page
      const roleValue = this.$authInfo.roleValue()
      this.$router.push({
        name: `${roleValue}-administration-site`,
        query: { page, size: this.size },
      })
    },
    resetDataGroup() {
      this.site = {
        id: undefined,
        name: '',
        longitude: '',
        latitude: '',
      }
    },
    handleCreate() {
      this.titlePopup = 'Create Site'
      this.dialogMode = 'create'
      this.dialogFormWithInput = true

      this.resetDataGroup()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(index, row) {
      this.titlePopup = 'Edit Site'
      this.dialogMode = 'update'
      this.dialogFormWithInput = true
      this.site = Object.assign({}, row)
      this.nameUpdate = this.site.name
      this.rowSelected = index + 1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleInfo(index, row) {
      this.titlePopup = 'View'
      this.dialogMode = 'detail'
      this.dialogFormWithInput = true
      this.site = Object.assign({}, row)
      this.rowSelected = index + 1
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$services.site.createSite(
            this.site,
            (res) => {
              this.getListSite(this.page, this.size)
              this.dialogFormWithInput = false
              this.notifySuccess(res.message)
            },
            (err) => {
              // this.notifyError(err.error.error)
            }
          )
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$services.site.updateSite(
            this.nameUpdate,
            this.site,
            (res) => {
              this.getListSite(this.page, this.size)
              this.dialogFormWithInput = false
              this.notifySuccess(res.message)
            },
            (err) => {
              // this.notifyError(err.error.error)
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
        this.$services.site.deleteSite(
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
          this.$services.site.deleteSite(
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
