angular.module('teambition', [
    // 'angularMoment',
    'ionic',
    'ngResource',
    'tbTemplates',
    'ngFileUpload',
    'et.template'
  ]);

import {app} from '../components/config/config';
import {MomentLocale} from '../components/bases/MomentLocale';
import {rootZone} from '../components/bases/Utils';
import {Notify, ProjectHomeActivity} from '../components/et';
import {InputComponments} from '../components/et/input/input';
import './filter';

angular.module('et.template')
  .service('notify', Notify)
  .service('InputComponments', InputComponments)
  .service('ProjectHomeActivity', ProjectHomeActivity);

angular.module('teambition')
  .constant('app', app)
  .run(() => {
    app.NAME = 'teambition-mobile';
    MomentLocale(app.LANGUAGE, moment);
  });

rootZone.run(() => {
  angular.element(document).ready(() => {
    angular.bootstrap(document, ['teambition']);
  });
});

export * from '../components/et/input/input';
export * from '../components/et/notify/notify';
export * from '../components/config';
export * from '../components/directives';
export * from '../components/filters';
export * from '../components/bases/Utils';
export * from '../components/bases/View';
export * from '../components/services';
export * from './router';
export * from './RootView';
