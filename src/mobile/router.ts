export default angular.module('teambition').config([
  '$stateProvider',
  '$urlRouterProvider',
  (
    $stateProvider,
    $urlRouterProvider
  ) => {

    $stateProvider

      // Main View
      .state('Main', {
        url: '/main',
        templateUrl: 'tabs.html'
      })

      .state('Main.Inbox', {
        url: '/inbox',
        views: {
          InboxView: {
            templateUrl: 'main/inbox/template.html'
          }
        }
      })
      .state('Main.Invition', {
        url: '/invition/:_id',
        views: {
          InboxView: {
            templateUrl: 'main/invition/template.html'
          }
        }
      })

      .state('Main.Projects', {
        url: '/projects',
        views: {
          ProjectListView: {
            templateUrl: 'main/projects/template.html'
          }
        }
      })

      .state('Main.Me', {
        url: '/me',
        views: {
          MeView: {
            templateUrl: 'main/me/template.html'
          }
        }
      })
      .state('Main.Settings', {
        url: '/settings',
        views: {
          MeView: {
            templateUrl: 'main/settings/template.html'
          }
        }
      })
      .state('Main.SettingProfile', {
        url: '/settings/profile',
        views: {
          MeView: {
            templateUrl: 'main/settings/profile/template.html'
          }
        }
      })
      .state('Main.SettingNotification', {
        url: '/settings/notification',
        views: {
          MeView: {
            templateUrl: 'main/settings/notification/template.html'
          }
        }
      })
      .state('Main.SettingPassword', {
        url: '/settings/password',
        views: {
          MeView: {
            templateUrl: 'main/settings/password/template.html'
          }
        }
      })
      .state('Main.MyTasks', {
        url: '/me/tasks',
        views: {
          MeView: {
            templateUrl: 'main/me/tasks/template.html'
          }
        }
      })
      .state('Main.MyEvents', {
        url: '/me/events',
        views: {
          MeView: {
            templateUrl: 'main/me/events/template.html'
          }
        }
      })
      .state('Main.MyFavorites', {
        url: '/me/favorites',
        views: {
          MeView: {
            templateUrl: 'main/me/favorites/template.html'
          }
        }
      })
      .state('Main.MyNotes', {
        url: '/me/notes',
        views: {
          MeView: {
            templateUrl: 'main/me/notes/template.html'
          }
        }
      })
      .state('Main.Organization', {
        url: '/organization/:_id',
        views: {
          InboxView: {
            templateUrl: 'main/organization/template.html'
          }
        }
      })

      // Detail View
      .state('Detail', {
        url: '/detail',
        templateUrl: 'detail/index.html'
      })
      .state('Detail.views', {
        url: '/:type/:_id',
        views: {
          'object': {
            templateUrl: ($stateParams: any) => {
              return `detail/${$stateParams.type}/index.html`;
            }
          },
          'detail-activities': {
            templateUrl: 'detail/activities/index.html'
          }
        }
      })
      .state('Detail.conjunction', {
        url: '/:type/conjunction/:_id',
        views: {
          'object': {
            templateUrl: ($stateParams: any) => {
              return `detail/${$stateParams.type}/index.html`;
            }
          },
          'detail-activities': {
            templateUrl: 'detail/activities/index.html'
          }
        }
      })
      .state('DetailTaskSubtask', {
        url: '/detail/task/:_id/subtasks',
        templateUrl: 'detail/task/subtask/index.html'
      })
      .state('DetailLink', {
        url: '/detail/:type/:_id/link',
        templateUrl: 'detail/linked/index.html'
      })

      // Project View
      .state('Project', {
        url: '/project/:_id',
        templateUrl: 'project/index.html'
      })
      .state('Project.Home', {
        url: '/home',
        views: {
          ProjectHome: {
            templateUrl: 'project/home/index.html'
          }
        }
      })
      .state('Project.TaskList', {
        url: '/tasklist',
        views: {
          ProjectTaskList: {
            templateUrl: 'project/tasklist/index.html'
          }
        }
      })
      .state('Project.Post', {
        url: '/post',
        views: {
          ProjectPost: {
            templateUrl: 'project/post/index.html'
          }
        }
      })
      .state('Project.WorkRootCollection', {
        url: '/work',
        views: {
          ProjectWork: {
            templateUrl: 'project/work/index.html'
          }
        }
      })
      .state('Project.WorkAnotherCollection', {
        url: '/work/:_collectionId',
        views: {
          ProjectWork: {
            templateUrl: 'project/work/index.html'
          }
        }
      })
      .state('Project.Event', {
        url: '/event',
        views: {
          ProjectEvent: {
            templateUrl: 'project/event/index.html'
          }
        }
      })
      // .state('Project.AnotherProjectHome', {
      //   url: '/another-home',
      //   views: {
      //     ProjectEvent: {
      //       templateUrl: 'project/home/template.html'
      //     }
      //   }
      // })

      .state('CreatingProject', {
        url: '/creating/project',
        templateUrl: 'creating/project/index.html'
      });

    $urlRouterProvider.otherwise('/main/projects');
  }
]);
