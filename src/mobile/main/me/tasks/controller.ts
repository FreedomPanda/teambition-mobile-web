import {inject} from '../../../../components/bases/Utils';
import {View} from '../../../../components/bases/View';
import {RestAPI} from '../../../../components/services/apis/RESTful';
import MeService from '../../me/service';

@inject([
  'RestAPI'
])
class MyTaskListView extends View {

  public ViewName = 'MyTaskListView';

  public TASKS = {};
  public TASK_TYPE = 'UNFULFILLED';
  public TASK_TYPE_TO_TITLE = {
    UNFULFILLED: '未完成任务',
    FULFILLED: '已完成任务',
    FOLLOWING: '我参与的任务',
    CREATING: '我创建的任务'
  };
  private _id;
  private RestAPI: RestAPI;
  private MeService: MeService;

  constructor() {
    super();
    this.MeService = new MeService(this.RestAPI, {$q: this.$q});
    this.zone.run(angular.noop);
  }

  public onInit(): angular.IPromise<any> {
    this._id = this.$rootScope.userMe._id;
    return this.load();
  }

  public load(): angular.IPromise<any> {
    return this.MeService[`findMy${
          this.capitalizeFirstLetter(this.TASK_TYPE, true)
        }Tasks`]()
    .then((tasks) => {
      this.TASKS[this.TASK_TYPE] = tasks;
      // console.log(this.TASK_TYPE, tasks);
    });
  }

  public toggle(taskType) {
    if (this.TASK_TYPE === taskType) { return; }
    this.$ionicLoading.show();
    this.TASK_TYPE = taskType;
    this.load().finally(() => {
      this.$ionicLoading.hide();
    });
  }

  public popupIonicActionSheet() {
    const self = this;
    this.$ionicActionSheet.show({
      buttons: Object.keys(this.TASK_TYPE_TO_TITLE).map((taskType) => {
        return {text: this.TASK_TYPE_TO_TITLE[taskType]};
      }),
      buttonClicked: (index) => {
        let taskTypes = Object.keys(self.TASK_TYPE_TO_TITLE);
        self.toggle(taskTypes[index]);
        return true;
      }
    });
  }

  private capitalizeFirstLetter(string: string, toLowerCase: boolean = false) {
    if (toLowerCase) {
      string = string.toLowerCase();
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

angular.module('teambition').controller('MyTaskListView', MyTaskListView);
