import {inject} from '../../../components/bases/Utils';
import {View} from '../../../components/bases/View';
import {RestAPI} from '../../../components/services/apis/RESTful';
import MessageService from './service';

@inject([
  'RestAPI'
])
class InboxView extends View {

  public static $inject = ['$scope'];
  public ViewName = 'InboxView';

  private _messages: Array<any> = [];
  private _mention_only: boolean = false;
  private _removing: boolean = false;
  private _more: boolean = true;
  private _loading: boolean = false;  // 数据加载中
  private _page: number = 1;  // 数据分页
  private _count: number = 10;  // 每页数据条数
  private MESSAGE_TYPE_TO_ICON_CLASS = {
    post: 'icon-wall',
    task: 'icon-board',
    event: 'icon-calendar',
    work: 'icon-file',
    entry: 'icon-bookkeeping',
    system: 'icon-circle-info'
  };
  private MESSAGE_TYPE_SYSTEM = 'system';
  private MESSAGE_TYPE_OBJECT = 'object';
  private RestAPI: RestAPI;
  private MessageService: MessageService;

  constructor($scope: angular.IScope) {
    super();
    this.$scope = $scope;
    this.MessageService = new MessageService(this.RestAPI);
    this.zone.run(angular.noop);
  }

  public onInit(): angular.IPromise<any> {
    let $loading = this.load(1);
    return $loading && $loading.then((messages) => {
      this._messages = messages;
      this._page = 2;
      this._more = messages.length === this._count;
    });
  }

  public load(from = this._page, size = this._count, mentionOnly = this._mention_only): angular.IPromise<any> {
    if (this._loading) { return; }
    this._loading = true;
    return this.MessageService.find(from, size, mentionOnly)
    .finally(() => this._loading = false);
  }

  public refresh() {
    let $loading = this.load(1);
    if (!$loading) { return this.refreshed(); }
    $loading.then((messages) => {
      this._messages = messages;
      this._page = 2;
      this._more = messages.length === this._count;
    }).finally(() => {
      this.refreshed();
    });
  }

  public canLoadMore() {
    return this._more;
  }

  public doInfiniteLoading() {
    if (!this._more) { return; }
    let $loading = this.load();
    if (!$loading) { return this.endInfiniteLoading(); }
    $loading.then((messages) => {
      this._messages = this._messages.concat(messages);
      this._page ++;
      this._more = messages.length === this._count;
    }).finally(() => {
      this.endInfiniteLoading();
    });
  }

  public getMessages() {
    return this._messages;
  }

  public removeMessage(index) {
    if (this._removing) { return; }
    this._removing = true;
    let message = this._messages[index];
    this.MessageService.remove(message._id)
    .then(() => {
      this.removeLocalMessage(index);
    })
    .finally(() => this._removing = false);
  }

  public isReadMessage(index) {
    return this._messages[index].isRead;
  }

  public markMessageRead(index) {
    if (this.isReadMessage(index)) { return; }
    let message = this._messages[index];
    this.MessageService.markRead(message._id)
    .then(() => {
      this.markLocalMessageRead(index);
    });
  }

  public popupIonicActionSheet() {
    const self = this;
    this.$ionicActionSheet.show({
      buttons: [
        {text: self._mention_only ? '恢复显示所有消息' : '只显示@我的消息'},
        {text: '标记所有已读'}
      ],
      destructiveText: '删除所有已读消息',
      cancelText: '关闭',
      destructiveButtonClicked: () => {
        self.removeAllReadMessages();
        return true;
      },
      buttonClicked: (index) => {
        switch (index) {
          case 0:
            self._mention_only = !self._mention_only;
            let $loading = self.load(1);
            if (!$loading) { break; }
            $loading.then((messages) => {
              self._messages = messages;
              self._page = 2;
              self._more = messages.length === self._count;
            });
            break;
          case 1:
            self.markAllMessagesRead();
            break;
        }
        return true;
      }
    });
  }

  public getMessageType(index) {
    let message = this._messages[index];
    return message.objectType || message.type;
  }

  public typeToIconClass(index) {
    return this.MESSAGE_TYPE_TO_ICON_CLASS[this.getMessageType(index)];
  }

  public getMessageDetailUrl(index) {
    let message = this._messages[index],
        _id = message._id,
        _objectId = message._objectId,
        messageType = this.getMessageType(index);
    if (messageType === this.MESSAGE_TYPE_SYSTEM) {
      return `#/main/invition/${ _id }`;
    } else if (message.type === this.MESSAGE_TYPE_OBJECT) {
      return `#/detail/${ messageType }/${ _objectId }`;
    } else {
      return '';
    }
  }

  private refreshed() {
    this.$scope.$broadcast('scroll.refreshComplete');
  }

  private endInfiniteLoading() {
    this.$scope.$broadcast('scroll.infiniteScrollComplete');
  }

  private markLocalMessageRead(index: number) {
    angular.extend(this._messages[index], {
      unreadActivitiesCount: 0,
      isRead: true
    });
  }

  private removeLocalMessage(index: number) {
    this._messages.splice(index, 1);
  }

  private markAllMessagesRead() {
    if (this._messages.every((undefined, index) => {
      return this.isReadMessage(index);
    })) { return; }
    this.MessageService.markAllRead(this._mention_only)
    .then(() => {
      this._messages.forEach((undefined, index) => {
        this.markLocalMessageRead(index);
      });
    });
  }

  private removeAllReadMessages() {
    if (this._removing) { return; }
    if (this._messages.some((undefined, index) => {
      return this.isReadMessage(index);
    })) {
      this._removing = true;
      this.MessageService.removeAllRead(this._mention_only)
      .then(() => {
        for (let index = this._messages.length - 1; index >= 0; index --) {
          if (this.isReadMessage(index)) {
            this.removeLocalMessage(index);
          }
        }
      })
      .finally(() => this._removing = false);
    }
  }
}

angular.module('teambition').controller('InboxView', InboxView);
