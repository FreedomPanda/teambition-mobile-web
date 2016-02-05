import {inject} from '../../../components/bases/Utils';
import {View} from '../../../components/bases/View';
import {RestAPI} from '../../../components/services/apis/RESTful';
import MessageService from '../inbox/service';

@inject([
  'RestAPI'
])
class InvitionView extends View {

  public ViewName = 'InvitionView';

  public MESSAGE;
  private RestAPI: RestAPI;
  private MessageService: MessageService;

  constructor() {
    super();
    this.MessageService = new MessageService(this.RestAPI);
    this.zone.run(angular.noop);
  }

  public onInit(): angular.IPromise<any> {
    return this.MessageService.findOne(this.$state.params._id)
    .then((message) => this.MESSAGE = message);
  }

  public getDetailUrl() {
    let url = '';
    if (this.MESSAGE) {
      if (this.MESSAGE._projectId) {
        url += `#/project/${this.MESSAGE._projectId}/home`;
      } else if (this.MESSAGE._organizationId) {
        url += `#/main/organization/${this.MESSAGE._organizationId}`;
      }
    }
    return url;
  }
}

angular.module('teambition').controller('InvitionView', InvitionView);
