import {inject} from '../../../../components/bases/Utils';
import {View} from '../../../../components/bases/View';
import {RestAPI} from '../../../../components/services/apis/RESTful';
import MeService from '../../me/service';

@inject([
  'RestAPI'
])
class SettingPasswordView extends View {

  public ViewName = 'SettingPasswordView';

  public PASSWORDS: angular.IFormController;
  public passwords;
  private RestAPI: RestAPI;
  private MeService: MeService;

  constructor() {
    super();
    this.MeService = new MeService(this.RestAPI);
    this.zone.run(angular.noop);
  }

  public onInit(): angular.IPromise<any> {
    return this.$q.resolve();
  }

  public save() {
    if (this.PASSWORDS.$valid) {
      console.log(this.passwords);
      this.$ionicLoading.show();
      // this.MeService.updateMyPassword(this.passwords)
      // .then(() => {
        this.passwords = null;
        this.PASSWORDS.$setPristine();
      // })
      // .finally(() => {
        this.$ionicLoading.hide();
      // });
    }
  }
}

angular.module('teambition').controller('SettingPasswordView', SettingPasswordView);
