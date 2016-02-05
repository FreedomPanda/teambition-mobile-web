'use strict';
import {View, parentView} from '../../index';
import {IEventData} from 'teambition';

@parentView('DetailView')
export class EventView extends View {

  public ViewName = 'EventView';

  public event: IEventData;

  constructor() {
    super();
    this.zone.run(angular.noop);
  }

  public onInit() {
    this.parent.title = '日程详情';
    return this.parent.onInit();
  }

  public onAllChangesDone() {
    this.event = this.parent.detail;
  }
}

angular.module('teambition').controller('EventView', EventView);
