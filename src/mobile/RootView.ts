import {
  inject,
  host,
  View,
  RestAPI
} from './';
import {IUserMe, Iapp, IRootScope} from 'teambition';
import './main/inbox/controller';
import './main/invition/controller';
import './main/me/controller';
import './main/settings/controller';
import './main/settings/profile/controller';
import './main/settings/notification/controller';
import './main/settings/password/controller';
import './main/me/tasks/controller';
import './main/me/events/controller';
import './main/me/favorites/controller';
import './main/me/notes/controller';
import './main/projects/controller';
import './main/organization/controller';
import './creating/project/controller';
// import './project/home/controller';

declare let Spiderjs: any;
export let spider: any;

@inject([
  'app',
  '$ionicHistory',
  '$window',
  'socket',
  'RestAPI'
])
export class RootView extends View {

  public static $inject = ['$scope'];

  public ViewName = 'RootView';
  public $$id = 'RootView';

  public userMe: IUserMe;

  private app: Iapp;
  private $ionicHistory;
  private $window: angular.IWindowService;
  private socket: any;
  private RestAPI: RestAPI;

  constructor(
    $scope: angular.IScope
  ) {
    super();
    this.$scope = $scope;
    this.zone.run(angular.noop);
  }

  public onInit(): angular.IPromise<any> {
    this.zone.hasCreated = true;
    if (this.userMe && this.$rootScope.pending) {
      return this.$rootScope.pending;
    }
    return this.RestAPI.get({
      Type: 'users',
      Id: 'me'
    })
    .$promise
    .then((userMe: IUserMe): any => {
      this.initUser(userMe);
    })
    .catch((reason: any) => {
      this.userLogin();
    });
  }

  public ionicHistoryGoBack() {
    this.$ionicHistory.goBack();
  }

  public ionicHistoryHasBackView() {
    return !!this.$ionicHistory.viewHistory().backView;
  }

  private initRootscope(userMe: IUserMe): void {
    let $rootScope: IRootScope = this.$rootScope;
    $rootScope.global = {
      title: 'Teambition'
    };
    $rootScope.userMe = userMe;
    this.app.socket = this.socket(userMe.snapperToken);
  }

  private initUser(userMe: IUserMe) {
    if (!userMe) {
      this.userLogin();
    } else {
      this.initRootscope(userMe);
      this.userMe = userMe;
      try {
        let spiderOptions = {
          _userId: userMe._id,
          client: 'c6a5c100-73b3-11e5-873a-57bc512acffc',
          host: this.app.spiderhost
        };
        spider = new Spiderjs(spiderOptions);
      } catch (error) {
        console.error(error);
      }
    }
  }

  private userLogin(): void {
    let url = encodeURIComponent(host);
    this.$window.location.href = `${this.app.accountHost}/login?next_url=${url}`;
  }

}

angular.module('teambition').controller('RootView', RootView);

export * from './project/TabsView';
export * from './detail/DetailView';
// export * from './creating/project/CreateProjectView';
