import {RestAPI} from '../../../components/services/apis/RESTful';

export default class {

  private $restful: RestAPI;

  constructor($restful: RestAPI) {
    this.$restful = $restful;
  }

  /*
   * 分页获取 Message 数据
   *
   * @param from 第n页
   * @param size 页长
   * @param mentionOnly 只显示@me
   */
  find(from: number, size: number, mentionOnly: boolean = false): angular.IPromise<Array<any>> {
    let options = {
      V2: 'v2',
      Type: 'messages',
      page: from,
      count: size
    };
    if (mentionOnly) {
      options['type'] = 'ated';
    }
    return this.$restful.query(options).$promise;
  }

  findOne(_id: string): angular.IPromise<any> {
    return this.$restful.get({
        V2: 'v2',
        Type: 'messages',
        Id: _id
      }).$promise;
  }

  findAll(): angular.IPromise<Array<any>> {
    return this.$restful.query({
        V2: 'v2',
        Type: 'messages'
      }).$promise;
  }

  markRead(_id: string): angular.IPromise<any> {
    return this.$restful.update({
        Type: 'messages',
        Id: _id
      }, {
        unreadActivitiesCount: 0,
        isRead: true
      }).$promise;
  }

  markAllRead(mentionsOnly: boolean = false): angular.IPromise<any> {
    return this.$restful.update(
        {
          Type: 'messages',
          Id: 'markallread' // Path1: 'markallread'
        },
        mentionsOnly ? { type: 'ated' } : null
      ).$promise;
  }

  remove(_id: string): angular.IPromise<any> {
    return this.$restful.delete({
        Type: 'messages',
        Id: _id
      }).$promise;
  }

  removeAllRead(mentionsOnly: boolean = false): angular.IPromise<any> {
    // REVIEW: DELETE & OPTIONS
    return this.$restful.delete({
        Type: 'messages',
        type: mentionsOnly ? 'ated' : null
      }).$promise;
  }
};
