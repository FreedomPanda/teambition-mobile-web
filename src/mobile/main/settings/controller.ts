import {IUserMe, Iapp} from 'teambition';
import {inject} from '../../../components/bases/Utils';
import {View} from '../../../components/bases/View';
import {RestAPI} from '../../../components/services/apis/RESTful';
import MeService from '../me/service';

@inject([
  'RestAPI',
  'app'
])
class SettingListView extends View {

  public ViewName = 'SettingListView';

  public ME: IUserMe;
  public SIGNOUT;
  private RestAPI: RestAPI;
  private app: Iapp;
  private MeService: MeService;
  // private PRIVILEGES;

  constructor($scope: angular.IScope) {
    super();
    this.$scope = $scope;
    this.MeService = new MeService(this.RestAPI);
    this.zone.run(angular.noop);
  }

  public onInit(): angular.IPromise<any> {

    this.ME = this.$rootScope.userMe;
    this.SIGNOUT = `${this.app.accountHost}/logout`;

    // return this.MeService.findMyPrivileges()
    //   .then((privileges) => {
    //     this.PRIVILEGES = privileges;
    //     console.log(this.PRIVILEGES.emoji);
    //   });
    return this.$q.resolve();
  }

  // public getEmojiPrivilegeValidityTerm() {
  //   let date = this.PRIVILEGES && this.PRIVILEGES.emoji.endDate;
  //   return date && moment(date).format('MMM DD');
  // }
}

angular.module('teambition').controller('SettingListView', SettingListView);
