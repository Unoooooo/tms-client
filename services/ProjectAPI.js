import BaseService from './BaseService'

export default class ProjectAPI extends BaseService {
  async getListProject(params, success, error) {
    await this.get(
      `projects?page=${params.page}&size=${params.size}`,
      success,
      error
    )
  }

  async createProject(params, success, error) {
    await this.post('projects/createProject', params, success, error)
  }

  async updateProject(projectName, params, success, error) {
    await this.put('projects/' + projectName, params, success, error)
  }

  async detailProject(projectName, success, error) {
    await this.get(`projects/${projectName}`, success, error)
  }

  async deleteProject(projectName, success, error) {
    this.delete(`projects/${projectName}`, {}, success, error)
  }

  async searchProject(projectname, groupname, params, success, error) {
    this.get(`projects/search?projectname=${projectname}&groupname=${groupname}${params}`, success, error)
  }
}
