import {IUserMe} from 'teambition';
import {inject} from '../../../components/bases/Utils';
import {View} from '../../../components/bases/View';
import {RestAPI} from '../../../components/services/apis/RESTful';
import MeService from './service';

@inject([
  'RestAPI'
])
class MeView extends View {

  public ViewName = 'MeView';

  public ME: IUserMe;
  public COUNTERS;
  public EVENTS;
  public NOTES;
  public AFFAIRS;
  public AFFAIR_TYPE_TO_ICON_CLASS = {
    task: 'icon-checkbox-ios-checked',
    subtask: 'icon-checkbox-ios-checked',
    event: 'icon-calendar'
  };
  public AFFAIR_DATE_TO_LABEL = {
    TODAY: '今日事务',
    TOMORROW: '明日事务',
    FUTURE: '往后事务',
    OLD: '过往事务'
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
    this.ME = this.$rootScope.userMe;
    this._id = this.ME._id;
    return this.refresh(false);
  }

  public refresh(newly: boolean = true): angular.IPromise<any> {
    return this.load(newly).then((data) => {
      let me = data[0];
      let counters = data[1];
      let events = data[2];
      let affairs = data[3];
      let notes = data[4];
      this.ME = this.$rootScope.userMe = me;
      this.COUNTERS = counters;
      this.EVENTS = events;
      this.NOTES = notes;
      this.AFFAIRS = this.filter(affairs);
    });
  }

  public getAffairDetailUrl(affair) {
    return `#/detail/${affair.type}/${affair._id}`;
    // return affair.url;
  }

  // public getAffairDate(affair) {
  //   if ('dueDate' in affair) {
  //     // return moment(affair.dueDate).fromNow();
  //     return moment(affair.dueDate).format('HH:mm');
  //   } else {
  //     // return `${moment(affair.startDate).fromNow()} - ${moment(affair.endDate).fromNow()}`;
  //     return `${moment(affair.startDate).format('HH:mm')} - ${moment(affair.endDate).format('HH:mm')}`;
  //   }
  // }

  public getLabels() {
    return Object.keys(this.AFFAIR_DATE_TO_LABEL);
  }

  public typeToIconClass(affair) {
    if (affair.type === 'task' || affair.type === 'subtask') {
      if (!affair.isDone) {
        let iconClass = 'icon icon-checkbox-thin';
        if (this._id !== affair._creatorId && this._id !== affair._executorId) {
          iconClass += ' notAssignedToMe';
        }
        // console.log(this._id, affair._creatorId, affair._executorId);
        return iconClass;
      }
    }
    return 'icon ' + this.AFFAIR_TYPE_TO_ICON_CLASS[affair.type];
  }

  private load(newly: boolean = false): angular.IPromise<any> {
    return this.$q.all([
        this.MeService.find(newly),
        this.MeService.findMyCounters(newly),
        this.MeService.findMyEvents(newly),  // FIXME: API
        this.MeService.findMyRecentAffairs(newly),
        this.MeService.findMyNotes(newly)
      ]);
  }

  private filter(affairs, filtered = {
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
    affairs.forEach((affair) => {
      let AFFAIR_DATE = '';
      if ('dueDate' in affair) {
        let date = affair.dueDate || today; // REVIEW
        if (today.isAfter(date, 'day')) {
          AFFAIR_DATE = 'OLD';
        } else if (today.isSame(date, 'day')) {
          AFFAIR_DATE = 'TODAY';
        } else if (tomorrow.isSame(date, 'day')) {
          AFFAIR_DATE = 'TOMORROW';
        } else {
          AFFAIR_DATE = 'FUTURE';
        }
      } else {
        let startDate = moment(affair.startDate).valueOf(),
            endDate = moment(affair.endDate).valueOf();
        if (endDate < todayStart) {
          AFFAIR_DATE = 'OLD';
        } else if (startDate < todayEnd) {
          AFFAIR_DATE = 'TODAY';
        } else if (startDate < tomorrowEnd) {
          AFFAIR_DATE = 'TOMORROW';
        } else {
          AFFAIR_DATE = 'FUTURE';
        }
      }
      filtered[AFFAIR_DATE].push(affair);
    });
    return filtered;
  }
}

angular.module('teambition').controller('MeView', MeView);
