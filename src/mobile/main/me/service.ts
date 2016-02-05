import {IUserMe, Iapp} from 'teambition';
import {RestAPI} from '../../../components/services/apis/RESTful';
import MeModel from './model';

export default class {

  private $restful: RestAPI;
  private $http: angular.IHttpService;
  private $q: angular.IQService;
  private options: Iapp;

  constructor($restful: RestAPI, dependencies?: {
    $http?: angular.IHttpService,
    $q?: angular.IQService,
    options?: Iapp
  }) {
    this.$restful = $restful;
    // Object.assign(this, dependencies);
    if (dependencies) {
      this.$http = dependencies.$http;
      this.$q = dependencies.$q;
      this.options = dependencies.options;
    }
  }

  find(newly: boolean = false): angular.IPromise<IUserMe> {
    let me = null;
    if (!newly && (me = MeModel.find())) {
      return this.$q.resolve(me);
    }
    return this.$restful.get({
      Type: 'users',
      Id: 'me'
    }).$promise.then((me) => {
      return MeModel.update(me);
    });
  }

  findMyCounters(newly: boolean = false): angular.IPromise<any> {
    let counters = null;
    if (!newly && (counters = MeModel.findMyCounters())) {
      return this.$q.resolve(counters);
    }
    return this.$restful.get({
      Type: 'users',
      Id: 'me',
      Path1: 'count'
    }).$promise.then((counters) => {
      return MeModel.updateMyCounters(counters);
    });
  }

  // FIXME
  findMyEvents(newly: boolean = false): angular.IPromise<Array<any>> {
    let events = null;
    if (!newly && (events = MeModel.findMyEvents())) {
      return this.$q.resolve(events);
    }
    return this.$restful.query({
        Type: 'events',
        Id: 'me',
        endDate: moment().startOf('day').toISOString()
      }).$promise.then((events) => {
        return MeModel.updateMyEvents(events);
      });
  }

  // in 7 days
  findMyRecentAffairs(newly: boolean = false, days = 7): angular.IPromise<Array<any>> {
    let affairs = null;
    if (!newly && (affairs = MeModel.findMyAffairs())) {
      return this.$q.resolve(affairs);
    }
    return this.$restful.query({
        Type: 'users',
        Id: 'recent',
        dueDate: moment().endOf('day').add(days, 'days').toISOString()
      }).$promise.then((affairs) => {
        return MeModel.updateMyAffairs(affairs);
      });
  }

  // findMyPrivileges(): angular.IPromise<any> {
  //   return this.$restful.get({
  //       Type: 'privileges',
  //       Id: 'me'
  //     }).$promise;
  // }

  findMyTasks(options?, subsidiary = false): angular.IPromise<Array<any>> {
    let defaults = {
      V2: 'v2',
      Type: 'tasks',
      Id: 'me'
    };
    options = Object.assign({}, defaults, options);
    let $tasks = [
      this.$restful.query(Object.assign({}, {hasDueDate: true}, options)).$promise,
      this.$restful.query(Object.assign({}, {hasDueDate: false}, options)).$promise
    ];
    if (subsidiary) {
      $tasks.push(
          this.$restful.query(Object.assign({}, {hasDueDate: true, Path1: 'subtasks'}, options)).$promise,
          this.$restful.query(Object.assign({}, {hasDueDate: false, Path1: 'subtasks'}, options)).$promise
        );
    }
    return this.$q.all($tasks).then((all) => {
      let tasks = [];
      all.forEach((one) => { tasks = tasks.concat(one); });
      return tasks;
    });
  }

  findMyUnfulfilledTasks(newly: boolean = false): angular.IPromise<Array<any>> {
    let tasks = null;
    if (!newly && (tasks = MeModel.findMyUnfulfilledTasks())) {
      return this.$q.resolve(tasks);
    }
    return this.findMyTasks(null, true).then((tasks) => {
      return MeModel.updateMyUnfulfilledTasks(tasks);
    });
  }

  findMyFulfilledTasks(newly: boolean = false): angular.IPromise<Array<any>> {
    let tasks = null;
    if (!newly && (tasks = MeModel.findMyFulfilledTasks())) {
      return this.$q.resolve(tasks);
    }
    return this.findMyTasks({isDone: true}, true).then((tasks) => {
      return MeModel.updateMyFulfilledTasks(tasks);
    });
  }

  findMyFollowingTasks(newly: boolean = false): angular.IPromise<Array<any>> {
    let tasks = null;
    if (!newly && (tasks = MeModel.findMyFollowingTasks())) {
      return this.$q.resolve(tasks);
    }
    return this.findMyTasks({isInvolved: true}).then((tasks) => {
      return MeModel.updateMyFollowingTasks(tasks);
    });
  }

  findMyCreatingTasks(newly: boolean = false): angular.IPromise<Array<any>> {
    let tasks = null;
    if (!newly && (tasks = MeModel.findMyCreatingTasks())) {
      return this.$q.resolve(tasks);
    }
    return this.findMyTasks({isCreator: true}).then((tasks) => {
      return MeModel.updateMyCreatingTasks(tasks);
    });
  }

  findMyFavorites(newly: boolean = false): angular.IPromise<Array<any>> {
    let favorites = null;
    if (!newly && (favorites = MeModel.findMyFavorites())) {
      return this.$q.resolve(favorites);
    }
    return this.$restful.get({
        Type: 'favorites'
      }).$promise.then((data) => {
        let favorites = data.results;
        return MeModel.updateMyFavorites(favorites);
      });
  }

  findMyNotes(newly: boolean = false): angular.IPromise<any> {
    let notes = null;
    if (!newly && (notes = MeModel.findMyNotes())) {
      return this.$q.resolve(notes);
    }
    return this.$restful.query({
        Type: 'notes'
      }).$promise.then((notes) => {
        return MeModel.updateMyNotes(notes);
      });
  }

  update(me): angular.IPromise<any> {
    // let url = `${this.options.accountHost}/papi/account/update`;
    // return this.$http ? this.$http.put(url, me, {
    //   withCredentials: true
    // }) : null;
    return this.$restful.update({
        Type: 'users'
      }, me).$promise;
  }

  updateMyPreferences(_id, preferences): angular.IPromise<any> {
    return this.$restful.update({
      Type: 'preferences',
      Id: _id
    }, preferences).$promise;
  }

  updateMyNote(_id, note): angular.IPromise<any> {
    return this.$restful.update({
      Type: 'notes',
      Id: _id
    }, note).$promise;
  }

  removeMyNote(_id): angular.IPromise<any> {
    return this.$restful.delete({
      Type: 'notes',
      Id: _id
    }).$promise;
  }

  removeMyFavorite(_id, type): angular.IPromise<any> {
    const FAVORITE_TYPE_TO_URL = {
      task: 'tasks',
      post: 'posts',
      event: 'events',
      work: 'works',
      entry: 'entries'
    };
    return this.$restful.delete({
      Type: FAVORITE_TYPE_TO_URL[type],
      Id: _id,
      Path1: 'favorite'
    }).$promise;
  }
};
