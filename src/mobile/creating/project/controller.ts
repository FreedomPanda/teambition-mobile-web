import {IOrganizationData} from 'teambition';
import {inject} from '../../../components/bases/Utils';
import {View} from '../../../components/bases/View';
import {RestAPI} from '../../../components/services/apis/RESTful';
import {OrganizationAPI} from '../../../components/services/apis/OrganizationAPI';
import ProjectService from './service';

@inject([
  'OrganizationAPI',
  'RestAPI'
])
class CreatingProjectView extends View {

  public static $inject = ['$scope'];
  public ViewName = 'CreatingProjectView';

  public PROJECT: angular.IFormController;  // 创建 Project 表单控件
  public ORGANIZATIONS: IOrganizationData[];
  public VISIBILITIES = {                   // 可见性：值-文本
    project: '私有项目',
    organization: '企业项目',
    all: '公开项目'
  };
  public project;                         // Project 表单数据
  public organization;
  private IONIC_MODAL = {
    ORGANIZATION: 'creating/project/organization.html',
    VISIBILITY: 'creating/project/visibility.html',
    DESCRIPTION: 'creating/project/description.html'
  };
  private OrganizationAPI: OrganizationAPI;
  private RestAPI: RestAPI;
  private ProjectService: ProjectService;

  constructor($scope: angular.IScope) {
    super();
    this.$scope = $scope;
    this.ProjectService = new ProjectService(this.RestAPI);
    this.project = {
      _organizationId: null,
      visibility: 'project'
    };
    this.zone.run(angular.noop);
  }

  public onInit(): angular.IPromise<any> {
    Object.keys(this.IONIC_MODAL).forEach((TYPE) => {
      let templateUrl = this.IONIC_MODAL[TYPE];
      this.IONIC_MODAL[TYPE] = this.$ionicModal.fromTemplateUrl(templateUrl, {
        scope: this.$scope,
        animation: 'slide-in-right'
      });
    });
    return this.OrganizationAPI.fetch()
    .then((organizations: IOrganizationData[]) => {
      this.ORGANIZATIONS = organizations;
    });
  }

  public create() {
    if (this.PROJECT.$valid) {
      this.$ionicLoading.show();
      this.ProjectService.create(this.project)
      .then((project) => {
        this.project = null;
        this.PROJECT.$setPristine();
        this.$location.url(`/project/${project._id}/home`);
      })
      .finally(() => {
        this.$ionicLoading.hide();
      });
    }
  }

  public showIonicModel(TYPE) {
    this.IONIC_MODAL[TYPE].then((modal) => modal.show());
  }

  public hideIonicModel(TYPE) {
    this.IONIC_MODAL[TYPE].then((modal) => modal.hide());
  }

  public setOrganization(organization) {
    this.organization = organization;
    this.hideIonicModel('ORGANIZATION');
  }

  public getVisibilities() {
    return Object.keys(this.VISIBILITIES);
  }
}

angular.module('teambition').controller('CreatingProjectView', CreatingProjectView);
