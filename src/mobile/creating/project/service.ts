import {RestAPI} from '../../../components/services/apis/RESTful';

export default class {

  private $restful: RestAPI;

  constructor($restful: RestAPI) {
    this.$restful = $restful;
  }

  // 创建 Project
  create(project): angular.IPromise<any> {
    return this.$restful.save({
      Type: 'projects'
    }, project).$promise;
  }
};
