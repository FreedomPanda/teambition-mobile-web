'use strict';
import {parentView, View} from '../../index';
import {IPostData} from 'teambition';

@parentView('DetailView')
export class PostView extends View {

  public ViewName = 'PostView';

  public post: IPostData;

  constructor() {
    super();
    this.zone.run(angular.noop);
  }

  public onInit() {
    this.parent.title = '分享详情';
    return this.parent.onInit();
  }

  public onAllChangesDone() {
    this.post = this.parent.detail;
  }
}

angular.module('teambition').controller('PostView', PostView);
