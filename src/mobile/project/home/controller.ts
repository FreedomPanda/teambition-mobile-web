import {inject} from '../../../components/bases/Utils';
import {View} from '../../../components/bases/View';
// import {RestAPI} from '../../../components/services/apis/RESTful';
import {ProjectsAPI} from '../../../components/services/apis/ProjectsAPI';
import {MemberAPI} from '../../../components/services/apis/MemberAPI';
// import MeService from './service';

// @parentView('TabsView')
@inject([
  'RestAPI',
  'ProjectsAPI',
  'MemberAPI'
])
class ProjectHomeView extends View {

  public ViewName = 'ProjectHomeView';

  public PROJECT;
  public MEMBERS;
  private _id;
  // private RestAPI: RestAPI;
  private ProjectsAPI: ProjectsAPI;
  private MemberAPI: MemberAPI;
  // private MeService: MeService;

  constructor() {
    super();
    // this.MeService = new MeService(this.RestAPI);
    this.zone.run(angular.noop);
  }

  public onInit(): angular.IPromise<any> {
    this._id = this.$state.params._id;
    return this.$q.all([
      this.ProjectsAPI.fetchById(this._id)
        .then((project) => this.PROJECT = project),
      this.MemberAPI.fetch(this._id)
          .then((members) => this.MEMBERS = members)
    ]);
  }
}

angular.module('teambition').controller('ProjectHomeView', ProjectHomeView);
