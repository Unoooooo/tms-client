<template>
  <section-block title="Manage Group">
    <section class="page-content">
      <div class="content">
        <el-row :gutter="20">
          <el-col :span="12">
            <h5 style="margin-bottom: 15px">Group name: {{ groupName }}</h5>
          </el-col>
        </el-row>

        <section class="project-filter">
          <el-input
            v-model="fullnameSearch"
            placeholder="Full name"
            class="input-search"
            clearable
          />

          <el-button
            class="button-delete-multi"
            type="primary"
            @click="getDetailGroup()"
          >
            <i class="el-icon-refresh"></i>
          </el-button>

          <div class="gr-button">
            <el-button
              class="button-delete-multi"
              type="danger"
              @click="handleDeleteMulti()"
            >
              <i class="el-icon-delete"></i>
            </el-button>

            <el-button class="add-new" @click="handleCreate()">
              {{ $t('Add member') }}
            </el-button>
          </div>
        </section>

        <section>
          <el-dialog
            title="Add member"
            :visible.sync="dialogFormWithInputNew"
            width="50%"
          >
            <el-form ref="dataForm" :model="addMemberToGroup">
              <hr />
              <div class="form-group row">
                <label class="col-sm-3 col-form-label"
                  >Member <span>*</span></label
                >
                <el-form-item prop="checkedMembers" class="col-sm-8">
                  <el-checkbox-group
                    v-model="addMemberToGroup.checkedMembers"
                    class="list-member"
                  >
                    <el-checkbox
                      v-for="(member, index) in members"
                      :key="index"
                      :label="member.username"
                    >
                      {{ member.username }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div>
            </el-form>
            <hr class="mb-0" />
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogFormWithInputNew = false">
                Cancel
              </el-button>
              <el-button type="primary" @click="createData()">
                Submit
              </el-button>
            </span>
          </el-dialog>
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
            type="selection"
            class-name="text-center"
            width="60px"
          />
          <el-table-column
            class-name="text-center"
            prop="full_name"
            sortable
            :label="$t('Full name')"
          />
          <el-table-column
            class-name="text-center"
            prop="username"
            :label="$t('Account')"
          />
          <el-table-column
            class-name="text-center"
            prop="mobile"
            :label="$t('Phone number')"
          />
          <el-table-column class-name="text-center" :label="$t('DOB')">
            <template slot-scope="{ row }">
              {{ row.dob ? showDateTime(row.dob, 'DD/MM/YYYY') : '' }}
            </template>
          </el-table-column>
          <el-table-column
            class-name="text-center"
            :label="$t('Gender')"
            width="120px"
          >
            <template slot-scope="{ row }">
              {{ row.gender === 0 ? 'Male' : 'Female' }}
            </template>
          </el-table-column>
          <el-table-column
            class-name="text-center"
            prop="role"
            :label="$t('Role')"
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
            width="70%"
          >
            <div v-if="dialogMode === 'detail'">
              <el-col :span="12">
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label"></label>
                  <div class="block" style="padding-top: calc(0.375rem + 1px)">
                    <el-image :src="image_preview">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">User Name</label>
                  <div
                    class="col-sm-8 data-detail"
                    style="padding-top: calc(0.375rem + 1px)"
                  >
                    {{ user.username }}
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Email</label>
                  <div
                    class="col-sm-8 data-detail"
                    style="padding-top: calc(0.375rem + 1px)"
                  >
                    {{ user.email }}
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Phone Number</label>
                  <div
                    class="col-sm-8 data-detail"
                    style="padding-top: calc(0.375rem + 1px)"
                  >
                    {{ user.mobile }}
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">DOB</label>
                  <div
                    class="col-sm-8 data-detail"
                    style="padding-top: calc(0.375rem + 1px)"
                  >
                    {{ user.dob ? showDateTime(user.dob, 'DD/MM/YYYY') : '' }}
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Address</label>
                  <div
                    class="col-sm-8 data-detail"
                    style="padding-top: calc(0.375rem + 1px)"
                  >
                    {{ user.address }}
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Gender</label>
                  <div
                    class="col-sm-8 data-detail"
                    style="padding-top: calc(0.375rem + 1px)"
                  >
                    {{ user.gender ? 'Male' : 'Female' }}
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Contract Date</label>
                  <div
                    class="col-sm-8 data-detail"
                    style="padding-top: calc(0.375rem + 1px)"
                  >
                    {{
                      user.contract_date
                        ? showDateTime(user.contract_date, 'DD/MM/YYYY')
                        : ''
                    }}
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Group</label>
                  <div
                    class="col-sm-8 data-detail"
                    style="padding-top: calc(0.375rem + 1px)"
                  >
                    {{ user.groupCompanyName }}
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Role</label>
                  <div
                    class="col-sm-8 data-detail"
                    style="padding-top: calc(0.375rem + 1px)"
                  >
                    {{ user.role }}
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label"
                    >Fingerprint Code</label
                  >
                  <div
                    class="col-sm-5 data-detail"
                    style="padding-top: calc(0.375rem + 1px)"
                  >
                    {{ user.fingerprint_code }}
                  </div>
                </div>
              </el-col>
            </div>

            <el-form v-else ref="dataForm" :rules="rules" :model="user">
              <el-col :span="12">
                <div v-if="dialogMode !== 'create'" class="form-group row">
                  <label class="col-sm-3 col-form-label"></label>
                  <div class="dialog-alert"></div>
                  <el-form-item prop="image_url" class="col-sm-8">
                    <div class="block" style="padding-left: 150px">
                      <el-image :src="image_preview">
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                      </el-image>
                    </div>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">User Name</label>
                  <div class="dialog-alert">{{ $t('(*)') }}</div>
                  <el-form-item
                    prop="username"
                    class="col-sm-7"
                    style="padding-top: calc(0.375rem + 1px)"
                  >
                    <el-input v-model="user.username" disabled />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Full Name</label>
                  <div class="dialog-alert">{{ $t('(*)') }}</div>
                  <el-form-item prop="full_name" class="col-sm-7">
                    <el-input v-model="user.full_name" disabled />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Email</label>
                  <div class="dialog-alert">{{ $t('(*)') }}</div>
                  <el-form-item prop="email" class="col-sm-7">
                    <el-input v-model="user.email" type="email" disabled />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Phone Number</label>
                  <div class="dialog-alert">{{ $t('(*)') }}</div>
                  <el-form-item prop="mobile" class="col-sm-7">
                    <el-input v-model="user.mobile" disabled />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">DOB</label>
                  <div class="dialog-alert">{{ $t('(*)') }}</div>
                  <el-form-item prop="dob" class="col-sm-7">
                    <el-date-picker
                      v-model="user.dob"
                      type="date"
                      placeholder="Pick a DOB"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      disabled
                    />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Address</label>
                  <div class="dialog-alert"></div>
                  <el-form-item prop="address" class="col-sm-7">
                    <el-input v-model="user.address" disabled />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Gender</label>
                  <div class="dialog-alert">{{ $t('(*)') }}</div>
                  <el-form-item prop="gender" class="col-sm-7">
                    <el-select
                      v-model="user.gender"
                      placeholder="Please select gender"
                      class="col-sm-8 pl-0"
                      disabled
                    >
                      <el-option
                        v-for="item in genders"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Contract Date</label>
                  <div class="dialog-alert">{{ $t('(*)') }}</div>
                  <el-form-item prop="contract_date" class="col-sm-7">
                    <el-date-picker
                      v-model="user.contract_date"
                      type="date"
                      placeholder="Pick a day"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      disabled
                    />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Group</label>
                  <div class="dialog-alert">{{ $t('(*)') }}</div>
                  <el-form-item prop="groupCompanyName" class="col-sm-7">
                    <el-select
                      v-model="user.groupCompanyName"
                      placeholder="Please select group"
                      class="col-sm-7 pl-0"
                      disabled
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
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Role</label>
                  <div class="dialog-alert">{{ $t('(*)') }}</div>
                  <el-form-item prop="role" class="col-sm-7">
                    <el-select
                      v-model="user.role"
                      placeholder="Please select role"
                      class="col-sm-7 pl-0"
                    >
                      <el-option
                        v-for="item in roles"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label"
                    >Fingerprint code</label
                  >
                  <div class="dialog-alert">{{ $t('(*)') }}</div>
                  <el-form-item prop="fingerprint_code" class="col-sm-7">
                    <el-input v-model="user.fingerprint_code" disabled />
                  </el-form-item>
                </div>
              </el-col>
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
      </div>
    </section>
  </section-block>
</template>

<style lang="scss" scoped>
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
.input-search {
  width: 150px;
}
[class*='el-col-'] {
  float: right;
  box-sizing: border-box;
}
.el-image {
  width: 200px;
}

.list-member > .el-checkbox {
  display: flex;
  margin: 12px 0;
  align-items: center;
}
</style>

<script>
import validate from '@/helpers/custom-rules-validate'
import moment from 'moment'

export default {
  components: {},
  mixins: [validate],
  layout: 'admin',
  middleware: 'auth',
  data() {
    return {
      groupName: this.$route.params.id,
      group_id: '',
      titlePopup: '',
      image_preview: '',
      tableData: [],
      checkboxGroup: [],
      fullnameSearch: '',
      members: [],
      pattern: '',
      dialogFormWithInput: false,
      dialogFormWithInputNew: false,
      dialogMode: '',
      groups: [],
      addMemberToGroup: {
        checkedMembers: [],
      },
      user: {
        id: '',
        username: '',
        email: '',
        full_name: '',
        contract_date: moment().format('YYYY-MM-DD'),
        role: '',
        mobile: '',
        addresss: '',
        dob: '',
        gender: 1,
        groupCompanyName: '',
        fingerprint_code: '',
      },
      genders: [
        {
          value: true,
          label: 'Male',
        },
        {
          value: false,
          label: 'Female',
        },
      ],
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
      rules: {
        memberName: this.validateRequired('member name'),
      },
      rowSelected: null,
      multipleSelection: [],
    }
  },
  watch: {
    fullnameSearch(val) {
      this.tableData = this.tableData.filter((item) =>
        val
          .toLowerCase()
          .split(' ')
          .every(
            (v) => item.full_name && item.full_name.toLowerCase().includes(v)
          )
      )
    },
  },
  created() {
    this.groupName = this.$route.params.id
    this.getDetailGroup()
  },
  methods: {
    getAvatar(image) {
      this.$services.common.getAvatar(
        image,
        (res) => {
          this.image_preview = 'data:image/png;base64,' + res.imageBase64
        },
        (err) => {
          console.log(err)
          this.image_preview =
            'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QB3RXhpZgAASUkqAAgAAAACAA4BAgA/AAAAJgAAAJiCAgAKAAAAZQAAAAAAAABQcm9maWxlIHBpY3R1cmUgdmVjdG9yIGlsbHVzdHJhdGlvbiBpc29sYXRlZCBvbiBncmF5IGJhY2tncm91bmRNcnNXaWxraW5z/+EFdmh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+Cgk8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgoJCTxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6SXB0YzR4bXBDb3JlPSJodHRwOi8vaXB0Yy5vcmcvc3RkL0lwdGM0eG1wQ29yZS8xLjAveG1sbnMvIiAgIHhtbG5zOkdldHR5SW1hZ2VzR0lGVD0iaHR0cDovL3htcC5nZXR0eWltYWdlcy5jb20vZ2lmdC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBsdXM9Imh0dHA6Ly9ucy51c2VwbHVzLm9yZy9sZGYveG1wLzEuMC8iICB4bWxuczppcHRjRXh0PSJodHRwOi8vaXB0Yy5vcmcvc3RkL0lwdGM0eG1wRXh0LzIwMDgtMDItMjkvIiB4bWxuczp4bXBSaWdodHM9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9yaWdodHMvIiBkYzpSaWdodHM9Ik1yc1dpbGtpbnMiIHBob3Rvc2hvcDpDcmVkaXQ9IkdldHR5IEltYWdlcy9pU3RvY2twaG90byIgR2V0dHlJbWFnZXNHSUZUOkFzc2V0SUQ9IjU4NzgwNTA3OCIgeG1wUmlnaHRzOldlYlN0YXRlbWVudD0iaHR0cHM6Ly93d3cuaXN0b2NrcGhvdG8uY29tL2xlZ2FsL2xpY2Vuc2UtYWdyZWVtZW50P3V0bV9tZWRpdW09b3JnYW5pYyZhbXA7dXRtX3NvdXJjZT1nb29nbGUmYW1wO3V0bV9jYW1wYWlnbj1pcHRjdXJsIiA+CjxkYzpjcmVhdG9yPjxyZGY6U2VxPjxyZGY6bGk+TXJzV2lsa2luczwvcmRmOmxpPjwvcmRmOlNlcT48L2RjOmNyZWF0b3I+PGRjOmRlc2NyaXB0aW9uPjxyZGY6QWx0PjxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+UHJvZmlsZSBwaWN0dXJlIHZlY3RvciBpbGx1c3RyYXRpb24gaXNvbGF0ZWQgb24gZ3JheSBiYWNrZ3JvdW5kPC9yZGY6bGk+PC9yZGY6QWx0PjwvZGM6ZGVzY3JpcHRpb24+CjxwbHVzOkxpY2Vuc29yPjxyZGY6U2VxPjxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPjxwbHVzOkxpY2Vuc29yVVJMPmh0dHBzOi8vd3d3LmlzdG9ja3Bob3RvLmNvbS9waG90by9saWNlbnNlLWdtNTg3ODA1MDc4LT91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybDwvcGx1czpMaWNlbnNvclVSTD48L3JkZjpsaT48L3JkZjpTZXE+PC9wbHVzOkxpY2Vuc29yPgoJCTwvcmRmOkRlc2NyaXB0aW9uPgoJPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0idyI/Pgr/7QCcUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAH8cAlAACk1yc1dpbGtpbnMcAngAP1Byb2ZpbGUgcGljdHVyZSB2ZWN0b3IgaWxsdXN0cmF0aW9uIGlzb2xhdGVkIG9uIGdyYXkgYmFja2dyb3VuZBwCdAAKTXJzV2lsa2lucxwCbgAYR2V0dHkgSW1hZ2VzL2lTdG9ja3Bob3RvAP/bAEMACgcHCAcGCggICAsKCgsOGBAODQ0OHRUWERgjHyUkIh8iISYrNy8mKTQpISIwQTE0OTs+Pj4lLkRJQzxINz0+O//bAEMBCgsLDg0OHBAQHDsoIig7Ozs7Ozs7Ozs7Ozs7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kkkkkkkkkkkkkkkkkkkgAAAAAAABFkkkkkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAABJAkkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkklAAAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAABMkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkktAAAAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkktAAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkoAAAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkAAAAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkklAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkkAAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkkAAAAAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAAMkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkloAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkklAAAAAAAAAAAAAJkkkkkkkkkkkkkkkkkkkkkkkklAAAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkkloAAAAAAAAAAAMkkkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkkkkkAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkkkktAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkkkkkklAAAAAAAABMkkkkkkkkkkkkkkkkkkkkkkkkkkkkkAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkkkkktoAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkkkkkkogAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkkkkkkJoAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkkkkkkkgIAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkkkkkkoABIAAAAABEkkkkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkhAAAAAAAAAAAAAANkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAAAAAABskkkkkkkkkkkkkkkkkllhAAAAAAAAAAAAAAAAABNskkkkkkkkkkkklktAAAAAAAAAAAAAAAAAAAAAAAJElkkkkkkkkllJAAAAAAAAAAAAAAAAAAAAAAAAAAAIBkkkkkkkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIkkkkloAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJkkkkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIkkkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMkkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMktAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAklgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIkoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN//xAAUEQEAAAAAAAAAAAAAAAAAAADA/9oACAEDAQE/EDlP/8QAFBEBAAAAAAAAAAAAAAAAAAAAwP/aAAgBAgEBPxA5T//EACwQAQABAgQEBQQDAQAAAAAAAAERADEhQFBRQWFxoYGRscHwIDBg0RDh8ZD/2gAIAQEAAT8Q/wCRL0KuRWMeJZe1HGPz1qfz/dBueslbWbqaC4ZbCPwZQThw4/GhQgcA+oBAE2SsQE+b2rGWDyakSWyR+ASIJ4BNcFHNlpfB2zp9uFIbJNYyleZWM4O/6VxhwThrmFsG/wClYLG7xcgNA8zemYtyYirghviqzDg7axiOQXd+RRkwFgyhUGcya2Z0UpWxdE/Vf6B+q+IfqgPVECdSjTA0GTgWMysEtipcS7jqJu63djehw4HfNTLikPHUehNDi7y9s3EFsXVw+c9Rmg4PM5vjo2DdpVKSrK6gILigoLIHnm3dOM9nvqMm7CfF+OcBgkSGnQuo1Cd3z7Z3oifG361CJ8jncLaU+eWntmjC2AzolNj6On3M8MfIae2actuGd789TUHJ5fTO9+euodAyd86sfMahJspds6oLc+jqEG5D5f7nX1ku396h0iT39s68PYX01DkYc65BsfV1BtXOwnOOeWB21C10PAoAAsYZxMNgmPPUIluH2zqI5EpFKuMOn94+uexPzeunuWbM9M9M4746fhbaPzyzvKhNFtP6oDxzs6bw9/bUOWOLpxzsuwJfPPUHEredMevHORbaYOhqN26PfNwIwsOqrajcQU9aOPI9s0UhPfdTg5eHyc8y4zxxZ6ariJ4jLnZQlpbqUuqyXAe58cvEC77Hw1YVAuMlAdgSZaUCxjx46vi1xUeHD5yypOWE0qlJVldXky5UIQcUvQ+dtZwVcN57OUx7wt0ayocFhuUgAyJI5Kal0g8dbnT4N/tkusU+X+60CCVsH8Y94Hk3yPaezWu59qsP2HrSYuWVG3AX9xkDf19ta7n2/iINrJcoWVQtwutGkfY6PvjE6e2tdz7fzek5ORw/qlxMWLv9oEgGyfdknsPt76yCAKtgKYouFz9KAgEbjUJC24YrwomA9ST7gIWETtWDY9npq+ImBvxelQ4Td4uVjiGyVGZ0Lv21VwK5XseuYEQgWTx1TmYDM3ujVIVwGXhmYeTPL/dUwWL/ANmZlRZj1V21J0epu6UZOAgM1JYzjKIiiIlx4afJguXCoBB7LH7oIIM4FgjgF6mVPmYmmMQvNw86Ex7A86jCBwDQJxDmfpWJPiipnRZN6vT5pB3qyT5tY0FfFqACAg0SSYegaxwxtga8zCMPOpzgWGXJNWMOsFL9SWv6Sg79U1Yi+b1oqOmEaXcs7hDTvIpkoF91IqxfIcau3gk+lBsPURUm+Txsi3wUC5yCKtDc3H1oIINX7qBNXcvJ6UzvGJWIADmx8qRUCJwSH7qeCOJW/uolDzDX4gI58KkUTuvXGHBLn2kgMcB8WoAAABYPwIKHI3dacnAufYwZxLbvwUJDC49qhFEhMEeH1cUi7sUZKAg/BoYMMPV9UijHCdPwffJMOvCi30OBdRQEEAQfhEN4YHj9Eg2Pd+P4TIPih6P0RSu5/CQS4IrHjg/wIrigoraEH4Vga2F79/48JHm/hbkU4nU4/wAAtgH4YK8EzFf/2Q=='
        }
      )
    },
    async getListMemberNonGroup(id) {
      await this.$services.user.getListMemberNonGroup(
        id,
        (response) => {
          this.members = response.data
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    async getDetailGroup() {
      await this.$services.group.detailGroup(
        this.groupName,
        (response) => {
          this.tableData = response.members
          this.getListMemberNonGroup(response.group_id)
          this.group_id = response.group_id
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    handleCreate() {
      this.dialogMode = 'create'
      this.dialogFormWithInputNew = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async handleUpdate(index, row) {
      this.titlePopup = 'Edit Member'
      this.dialogMode = 'update'
      this.dialogFormWithInput = true
      this.user = Object.assign({}, row)
      if (row.image_url) {
        await this.getAvatar(row.image_url)
      } else {
        this.image_preview =
          'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QB3RXhpZgAASUkqAAgAAAACAA4BAgA/AAAAJgAAAJiCAgAKAAAAZQAAAAAAAABQcm9maWxlIHBpY3R1cmUgdmVjdG9yIGlsbHVzdHJhdGlvbiBpc29sYXRlZCBvbiBncmF5IGJhY2tncm91bmRNcnNXaWxraW5z/+EFdmh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+Cgk8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgoJCTxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6SXB0YzR4bXBDb3JlPSJodHRwOi8vaXB0Yy5vcmcvc3RkL0lwdGM0eG1wQ29yZS8xLjAveG1sbnMvIiAgIHhtbG5zOkdldHR5SW1hZ2VzR0lGVD0iaHR0cDovL3htcC5nZXR0eWltYWdlcy5jb20vZ2lmdC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBsdXM9Imh0dHA6Ly9ucy51c2VwbHVzLm9yZy9sZGYveG1wLzEuMC8iICB4bWxuczppcHRjRXh0PSJodHRwOi8vaXB0Yy5vcmcvc3RkL0lwdGM0eG1wRXh0LzIwMDgtMDItMjkvIiB4bWxuczp4bXBSaWdodHM9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9yaWdodHMvIiBkYzpSaWdodHM9Ik1yc1dpbGtpbnMiIHBob3Rvc2hvcDpDcmVkaXQ9IkdldHR5IEltYWdlcy9pU3RvY2twaG90byIgR2V0dHlJbWFnZXNHSUZUOkFzc2V0SUQ9IjU4NzgwNTA3OCIgeG1wUmlnaHRzOldlYlN0YXRlbWVudD0iaHR0cHM6Ly93d3cuaXN0b2NrcGhvdG8uY29tL2xlZ2FsL2xpY2Vuc2UtYWdyZWVtZW50P3V0bV9tZWRpdW09b3JnYW5pYyZhbXA7dXRtX3NvdXJjZT1nb29nbGUmYW1wO3V0bV9jYW1wYWlnbj1pcHRjdXJsIiA+CjxkYzpjcmVhdG9yPjxyZGY6U2VxPjxyZGY6bGk+TXJzV2lsa2luczwvcmRmOmxpPjwvcmRmOlNlcT48L2RjOmNyZWF0b3I+PGRjOmRlc2NyaXB0aW9uPjxyZGY6QWx0PjxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+UHJvZmlsZSBwaWN0dXJlIHZlY3RvciBpbGx1c3RyYXRpb24gaXNvbGF0ZWQgb24gZ3JheSBiYWNrZ3JvdW5kPC9yZGY6bGk+PC9yZGY6QWx0PjwvZGM6ZGVzY3JpcHRpb24+CjxwbHVzOkxpY2Vuc29yPjxyZGY6U2VxPjxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPjxwbHVzOkxpY2Vuc29yVVJMPmh0dHBzOi8vd3d3LmlzdG9ja3Bob3RvLmNvbS9waG90by9saWNlbnNlLWdtNTg3ODA1MDc4LT91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybDwvcGx1czpMaWNlbnNvclVSTD48L3JkZjpsaT48L3JkZjpTZXE+PC9wbHVzOkxpY2Vuc29yPgoJCTwvcmRmOkRlc2NyaXB0aW9uPgoJPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0idyI/Pgr/7QCcUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAH8cAlAACk1yc1dpbGtpbnMcAngAP1Byb2ZpbGUgcGljdHVyZSB2ZWN0b3IgaWxsdXN0cmF0aW9uIGlzb2xhdGVkIG9uIGdyYXkgYmFja2dyb3VuZBwCdAAKTXJzV2lsa2lucxwCbgAYR2V0dHkgSW1hZ2VzL2lTdG9ja3Bob3RvAP/bAEMACgcHCAcGCggICAsKCgsOGBAODQ0OHRUWERgjHyUkIh8iISYrNy8mKTQpISIwQTE0OTs+Pj4lLkRJQzxINz0+O//bAEMBCgsLDg0OHBAQHDsoIig7Ozs7Ozs7Ozs7Ozs7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kkkkkkkkkkkkkkkkkkkgAAAAAAABFkkkkkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAABJAkkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkklAAAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAABMkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkktAAAAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkktAAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkoAAAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkAAAAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkklAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkkAAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkkAAAAAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAAMkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkloAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkklAAAAAAAAAAAAAJkkkkkkkkkkkkkkkkkkkkkkkklAAAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkkloAAAAAAAAAAAMkkkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkkkkkAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkkkktAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkkkkkklAAAAAAAABMkkkkkkkkkkkkkkkkkkkkkkkkkkkkkAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkkkkktoAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkkkkkkogAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkkkkkkJoAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkkkkkkkgIAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkkkkkkoABIAAAAABEkkkkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkhAAAAAAAAAAAAAANkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAAAAAABskkkkkkkkkkkkkkkkkllhAAAAAAAAAAAAAAAAABNskkkkkkkkkkkklktAAAAAAAAAAAAAAAAAAAAAAAJElkkkkkkkkllJAAAAAAAAAAAAAAAAAAAAAAAAAAAIBkkkkkkkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIkkkkloAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJkkkkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIkkkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMkkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMktAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAklgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIkoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN//xAAUEQEAAAAAAAAAAAAAAAAAAADA/9oACAEDAQE/EDlP/8QAFBEBAAAAAAAAAAAAAAAAAAAAwP/aAAgBAgEBPxA5T//EACwQAQABAgQEBQQDAQAAAAAAAAERADEhQFBRQWFxoYGRscHwIDBg0RDh8ZD/2gAIAQEAAT8Q/wCRL0KuRWMeJZe1HGPz1qfz/dBueslbWbqaC4ZbCPwZQThw4/GhQgcA+oBAE2SsQE+b2rGWDyakSWyR+ASIJ4BNcFHNlpfB2zp9uFIbJNYyleZWM4O/6VxhwThrmFsG/wClYLG7xcgNA8zemYtyYirghviqzDg7axiOQXd+RRkwFgyhUGcya2Z0UpWxdE/Vf6B+q+IfqgPVECdSjTA0GTgWMysEtipcS7jqJu63djehw4HfNTLikPHUehNDi7y9s3EFsXVw+c9Rmg4PM5vjo2DdpVKSrK6gILigoLIHnm3dOM9nvqMm7CfF+OcBgkSGnQuo1Cd3z7Z3oifG361CJ8jncLaU+eWntmjC2AzolNj6On3M8MfIae2actuGd789TUHJ5fTO9+euodAyd86sfMahJspds6oLc+jqEG5D5f7nX1ku396h0iT39s68PYX01DkYc65BsfV1BtXOwnOOeWB21C10PAoAAsYZxMNgmPPUIluH2zqI5EpFKuMOn94+uexPzeunuWbM9M9M4746fhbaPzyzvKhNFtP6oDxzs6bw9/bUOWOLpxzsuwJfPPUHEredMevHORbaYOhqN26PfNwIwsOqrajcQU9aOPI9s0UhPfdTg5eHyc8y4zxxZ6ariJ4jLnZQlpbqUuqyXAe58cvEC77Hw1YVAuMlAdgSZaUCxjx46vi1xUeHD5yypOWE0qlJVldXky5UIQcUvQ+dtZwVcN57OUx7wt0ayocFhuUgAyJI5Kal0g8dbnT4N/tkusU+X+60CCVsH8Y94Hk3yPaezWu59qsP2HrSYuWVG3AX9xkDf19ta7n2/iINrJcoWVQtwutGkfY6PvjE6e2tdz7fzek5ORw/qlxMWLv9oEgGyfdknsPt76yCAKtgKYouFz9KAgEbjUJC24YrwomA9ST7gIWETtWDY9npq+ImBvxelQ4Td4uVjiGyVGZ0Lv21VwK5XseuYEQgWTx1TmYDM3ujVIVwGXhmYeTPL/dUwWL/ANmZlRZj1V21J0epu6UZOAgM1JYzjKIiiIlx4afJguXCoBB7LH7oIIM4FgjgF6mVPmYmmMQvNw86Ex7A86jCBwDQJxDmfpWJPiipnRZN6vT5pB3qyT5tY0FfFqACAg0SSYegaxwxtga8zCMPOpzgWGXJNWMOsFL9SWv6Sg79U1Yi+b1oqOmEaXcs7hDTvIpkoF91IqxfIcau3gk+lBsPURUm+Txsi3wUC5yCKtDc3H1oIINX7qBNXcvJ6UzvGJWIADmx8qRUCJwSH7qeCOJW/uolDzDX4gI58KkUTuvXGHBLn2kgMcB8WoAAABYPwIKHI3dacnAufYwZxLbvwUJDC49qhFEhMEeH1cUi7sUZKAg/BoYMMPV9UijHCdPwffJMOvCi30OBdRQEEAQfhEN4YHj9Eg2Pd+P4TIPih6P0RSu5/CQS4IrHjg/wIrigoraEH4Vga2F79/48JHm/hbkU4nU4/wAAtgH4YK8EzFf/2Q=='
      }
      this.rowSelected = index + 1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async handleInfo(index, row) {
      this.titlePopup = 'View Member'
      this.dialogMode = 'detail'
      this.dialogFormWithInput = true
      this.user = Object.assign({}, row)
      if (row.image_url) {
        await this.getAvatar(row.image_url)
      } else {
        this.image_preview =
          'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QB3RXhpZgAASUkqAAgAAAACAA4BAgA/AAAAJgAAAJiCAgAKAAAAZQAAAAAAAABQcm9maWxlIHBpY3R1cmUgdmVjdG9yIGlsbHVzdHJhdGlvbiBpc29sYXRlZCBvbiBncmF5IGJhY2tncm91bmRNcnNXaWxraW5z/+EFdmh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+Cgk8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgoJCTxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6SXB0YzR4bXBDb3JlPSJodHRwOi8vaXB0Yy5vcmcvc3RkL0lwdGM0eG1wQ29yZS8xLjAveG1sbnMvIiAgIHhtbG5zOkdldHR5SW1hZ2VzR0lGVD0iaHR0cDovL3htcC5nZXR0eWltYWdlcy5jb20vZ2lmdC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBsdXM9Imh0dHA6Ly9ucy51c2VwbHVzLm9yZy9sZGYveG1wLzEuMC8iICB4bWxuczppcHRjRXh0PSJodHRwOi8vaXB0Yy5vcmcvc3RkL0lwdGM0eG1wRXh0LzIwMDgtMDItMjkvIiB4bWxuczp4bXBSaWdodHM9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9yaWdodHMvIiBkYzpSaWdodHM9Ik1yc1dpbGtpbnMiIHBob3Rvc2hvcDpDcmVkaXQ9IkdldHR5IEltYWdlcy9pU3RvY2twaG90byIgR2V0dHlJbWFnZXNHSUZUOkFzc2V0SUQ9IjU4NzgwNTA3OCIgeG1wUmlnaHRzOldlYlN0YXRlbWVudD0iaHR0cHM6Ly93d3cuaXN0b2NrcGhvdG8uY29tL2xlZ2FsL2xpY2Vuc2UtYWdyZWVtZW50P3V0bV9tZWRpdW09b3JnYW5pYyZhbXA7dXRtX3NvdXJjZT1nb29nbGUmYW1wO3V0bV9jYW1wYWlnbj1pcHRjdXJsIiA+CjxkYzpjcmVhdG9yPjxyZGY6U2VxPjxyZGY6bGk+TXJzV2lsa2luczwvcmRmOmxpPjwvcmRmOlNlcT48L2RjOmNyZWF0b3I+PGRjOmRlc2NyaXB0aW9uPjxyZGY6QWx0PjxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+UHJvZmlsZSBwaWN0dXJlIHZlY3RvciBpbGx1c3RyYXRpb24gaXNvbGF0ZWQgb24gZ3JheSBiYWNrZ3JvdW5kPC9yZGY6bGk+PC9yZGY6QWx0PjwvZGM6ZGVzY3JpcHRpb24+CjxwbHVzOkxpY2Vuc29yPjxyZGY6U2VxPjxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPjxwbHVzOkxpY2Vuc29yVVJMPmh0dHBzOi8vd3d3LmlzdG9ja3Bob3RvLmNvbS9waG90by9saWNlbnNlLWdtNTg3ODA1MDc4LT91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybDwvcGx1czpMaWNlbnNvclVSTD48L3JkZjpsaT48L3JkZjpTZXE+PC9wbHVzOkxpY2Vuc29yPgoJCTwvcmRmOkRlc2NyaXB0aW9uPgoJPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0idyI/Pgr/7QCcUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAH8cAlAACk1yc1dpbGtpbnMcAngAP1Byb2ZpbGUgcGljdHVyZSB2ZWN0b3IgaWxsdXN0cmF0aW9uIGlzb2xhdGVkIG9uIGdyYXkgYmFja2dyb3VuZBwCdAAKTXJzV2lsa2lucxwCbgAYR2V0dHkgSW1hZ2VzL2lTdG9ja3Bob3RvAP/bAEMACgcHCAcGCggICAsKCgsOGBAODQ0OHRUWERgjHyUkIh8iISYrNy8mKTQpISIwQTE0OTs+Pj4lLkRJQzxINz0+O//bAEMBCgsLDg0OHBAQHDsoIig7Ozs7Ozs7Ozs7Ozs7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kkkkkkkkkkkkkkkkkkkgAAAAAAABFkkkkkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAABJAkkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkklAAAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAABMkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkktAAAAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkktAAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkoAAAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkAAAAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkklAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkkAAAAAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkkAAAAAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAAMkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkloAAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkklAAAAAAAAAAAAAJkkkkkkkkkkkkkkkkkkkkkkkklAAAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkkloAAAAAAAAAAAMkkkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkkkkkAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkkkktAAAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkkkkkklAAAAAAAABMkkkkkkkkkkkkkkkkkkkkkkkkkkkkkAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkkkkktoAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkkkkkkogAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkkkkkkJoAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkkkkkkkgIAAAAAAAAkkkkkkkkkkkkkkkkkkkkkkkkkkkkoABIAAAAABEkkkkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkkklgAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAABkkkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAIkkkkkkkkkkkkkkkkkkkkkkkkkgAAAAAAAAAAAAEkkkkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAABEkkkkkkkkkkkkkkkkkkkkkkkhAAAAAAAAAAAAAANkkkkkkkkkkkkkkkkkkkkksAAAAAAAAAAAAAAAABskkkkkkkkkkkkkkkkkllhAAAAAAAAAAAAAAAAABNskkkkkkkkkkkklktAAAAAAAAAAAAAAAAAAAAAAAJElkkkkkkkkllJAAAAAAAAAAAAAAAAAAAAAAAAAAAIBkkkkkkkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIkkkkloAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJkkkkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIkkkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMkkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMktAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAklgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIkoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN//xAAUEQEAAAAAAAAAAAAAAAAAAADA/9oACAEDAQE/EDlP/8QAFBEBAAAAAAAAAAAAAAAAAAAAwP/aAAgBAgEBPxA5T//EACwQAQABAgQEBQQDAQAAAAAAAAERADEhQFBRQWFxoYGRscHwIDBg0RDh8ZD/2gAIAQEAAT8Q/wCRL0KuRWMeJZe1HGPz1qfz/dBueslbWbqaC4ZbCPwZQThw4/GhQgcA+oBAE2SsQE+b2rGWDyakSWyR+ASIJ4BNcFHNlpfB2zp9uFIbJNYyleZWM4O/6VxhwThrmFsG/wClYLG7xcgNA8zemYtyYirghviqzDg7axiOQXd+RRkwFgyhUGcya2Z0UpWxdE/Vf6B+q+IfqgPVECdSjTA0GTgWMysEtipcS7jqJu63djehw4HfNTLikPHUehNDi7y9s3EFsXVw+c9Rmg4PM5vjo2DdpVKSrK6gILigoLIHnm3dOM9nvqMm7CfF+OcBgkSGnQuo1Cd3z7Z3oifG361CJ8jncLaU+eWntmjC2AzolNj6On3M8MfIae2actuGd789TUHJ5fTO9+euodAyd86sfMahJspds6oLc+jqEG5D5f7nX1ku396h0iT39s68PYX01DkYc65BsfV1BtXOwnOOeWB21C10PAoAAsYZxMNgmPPUIluH2zqI5EpFKuMOn94+uexPzeunuWbM9M9M4746fhbaPzyzvKhNFtP6oDxzs6bw9/bUOWOLpxzsuwJfPPUHEredMevHORbaYOhqN26PfNwIwsOqrajcQU9aOPI9s0UhPfdTg5eHyc8y4zxxZ6ariJ4jLnZQlpbqUuqyXAe58cvEC77Hw1YVAuMlAdgSZaUCxjx46vi1xUeHD5yypOWE0qlJVldXky5UIQcUvQ+dtZwVcN57OUx7wt0ayocFhuUgAyJI5Kal0g8dbnT4N/tkusU+X+60CCVsH8Y94Hk3yPaezWu59qsP2HrSYuWVG3AX9xkDf19ta7n2/iINrJcoWVQtwutGkfY6PvjE6e2tdz7fzek5ORw/qlxMWLv9oEgGyfdknsPt76yCAKtgKYouFz9KAgEbjUJC24YrwomA9ST7gIWETtWDY9npq+ImBvxelQ4Td4uVjiGyVGZ0Lv21VwK5XseuYEQgWTx1TmYDM3ujVIVwGXhmYeTPL/dUwWL/ANmZlRZj1V21J0epu6UZOAgM1JYzjKIiiIlx4afJguXCoBB7LH7oIIM4FgjgF6mVPmYmmMQvNw86Ex7A86jCBwDQJxDmfpWJPiipnRZN6vT5pB3qyT5tY0FfFqACAg0SSYegaxwxtga8zCMPOpzgWGXJNWMOsFL9SWv6Sg79U1Yi+b1oqOmEaXcs7hDTvIpkoF91IqxfIcau3gk+lBsPURUm+Txsi3wUC5yCKtDc3H1oIINX7qBNXcvJ6UzvGJWIADmx8qRUCJwSH7qeCOJW/uolDzDX4gI58KkUTuvXGHBLn2kgMcB8WoAAABYPwIKHI3dacnAufYwZxLbvwUJDC49qhFEhMEeH1cUi7sUZKAg/BoYMMPV9UijHCdPwffJMOvCi30OBdRQEEAQfhEN4YHj9Eg2Pd+P4TIPih6P0RSu5/CQS4IrHjg/wIrigoraEH4Vga2F79/48JHm/hbkU4nU4/wAAtgH4YK8EzFf/2Q=='
      }
      this.rowSelected = index + 1
    },
    createData() {
      if (this.addMemberToGroup.checkedMembers.length > 0) {
        const data = {
          listData: [...this.addMemberToGroup.checkedMembers],
        }
        this.$services.group.addMemberToGroup(
          this.group_id,
          data,
          (res) => {
            this.dialogFormWithInputNew = false
            this.addMemberToGroup.checkedMembers = []
            this.getDetailGroup()
            this.notifySuccess(res.message)
            this.endLoading()
          },
          (err) => {
            this.endLoading()
            this.notifyError(err.error.error)
          }
        )
      } else {
        this.notifyError('Please select member!')
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.startLoading()
          this.$services.user.updateUser(
            this.user.username,
            this.user,
            (res) => {
              this.getDetailGroup()
              this.dialogFormWithInput = false
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
        this.$services.group.deleteMemberGroup(
          row.groupCompanyName,
          row.username,
          (res) => {
            this.tableData.splice(index, 1)
            this.notifySuccess(res.message)
            this.endLoading()
          },
          (err) => {
            this.endLoading()
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
        this.startLoading()
        for (let index = 0; index < this.multipleSelection.length; index++) {
          const element = this.multipleSelection[index]
          this.$services.group.deleteMemberGroup(
            element.groupCompanyName,
            element.username,
            (res) => {
              const data = this.tableData.filter(
                (item) => item.username !== element.username
              )
              this.notifySuccess(res.message)
              this.tableData = data
            },
            (err) => {
              this.notifyError(err.error.error)
            }
          )
        }
        this.endLoading()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
  },
}
</script>
