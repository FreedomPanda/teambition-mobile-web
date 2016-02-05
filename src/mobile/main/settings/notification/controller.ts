import {inject} from '../../../../components/bases/Utils';
import {View} from '../../../../components/bases/View';
import {RestAPI} from '../../../../components/services/apis/RESTful';
import MeService from '../../me/service';

@inject([
  'RestAPI'
])
class SettingNotificationView extends View {

  public ViewName = 'SettingNotificationView';

  public NOTIFICATIONS: angular.IFormController;
  public notifications;
  public LABELS = {
    newpost: '新分享',
    newtask: '新任务',
    newwork: '新文件',
    newevent: '新日程',
    comment: '评论',
    involve: '添加相关者',
    update: '更新',
    daily: '每日提醒',
    monthly: '月刊订阅'
  };
  private _id;
  private ME;
  private RestAPI: RestAPI;
  private MeService: MeService;

  constructor() {
    super();
    this.MeService = new MeService(this.RestAPI);
    this.zone.run(angular.noop);
  }

  public onInit(): angular.IPromise<any> {
    this.ME = this.$rootScope.userMe;
    this.notifications = this.ME.notification;
    this._id = this.$rootScope.userMe._id;
    return this.$q.resolve();
  }

  public getNames() {
    return Object.keys(this.LABELS);
  }

  public save() {
    this.$ionicLoading.show();
    // console.log(this.notifications.newpost);
    return this.MeService.updateMyPreferences(
      this._id,
      {notification: this.notifications}
    ).then((preferences) => {
      // console.log(data.notification.newpost);
      this.notifications = this.ME.notification = preferences.notification;
      this.NOTIFICATIONS.$setPristine();
      this.$ionicLoading.hide();
    });
  }

  public exist(object, name) {
    return object && name in object;
  }
}

angular.module('teambition').controller('SettingNotificationView', SettingNotificationView);
