import {inject} from '../../../../components/bases/Utils';
import {View} from '../../../../components/bases/View';
import {RestAPI} from '../../../../components/services/apis/RESTful';
import MeService from '../../me/service';

@inject([
  'RestAPI'
])
class MyEventListView extends View {

  public ViewName = 'MyEventListView';

  public EVENTS;
  public EVENT_DATE_TO_LABEL = {
    TODAY: '今日日程',
    TOMORROW: '明日日程',
    FUTURE: '往后日程',
    OLD: '过往日程'
  };
  private RestAPI: RestAPI;
  private MeService: MeService;

  constructor() {
    super();
    this.MeService = new MeService(this.RestAPI, {$q: this.$q});
    this.zone.run(angular.noop);
  }

  public onInit(): angular.IPromise<any> {
    return this.load();
  }

  public getLabels() {
    return Object.keys(this.EVENT_DATE_TO_LABEL);
  }

  private load(): angular.IPromise<any> {
    return this.MeService.findMyEvents()
    .then((events) => {
      this.EVENTS = this.filter(events);
    });
  }

  private filter(events, filtered = {
      TODAY: [],
      TOMORROW: [],
      FUTURE: [],
      OLD: []
    }) {
    let today = moment(),
        tomorrow = moment().add(1, 'day'),
        todayStart = today.startOf('day').valueOf(),
        todayEnd = today.endOf('day').valueOf(),
        tomorrowEnd = tomorrow.endOf('day').valueOf();
    events.forEach((event) => {
      let EVENT_DATE = '',
          startDate = moment(event.startDate).valueOf(),
          endDate = moment(event.endDate).valueOf();
      if (endDate < todayStart) {
        EVENT_DATE = 'OLD';
      } else if (startDate < todayEnd) {
        EVENT_DATE = 'TODAY';
      } else if (startDate < tomorrowEnd) {
        EVENT_DATE = 'TOMORROW';
      } else {
        EVENT_DATE = 'FUTURE';
      }
      filtered[EVENT_DATE].push(event);
    });
    return filtered;
  }
}

angular.module('teambition').controller('MyEventListView', MyEventListView);
