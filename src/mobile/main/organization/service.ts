import {RestAPI} from '../../../components/services/apis/RESTful';

export default class {

  private $restful: RestAPI;

  constructor($restful: RestAPI) {
    this.$restful = $restful;
  }

  findById(_id): angular.IPromise<any> {
    return this.$restful.get({
        Type: 'organizations',
        Id: _id
      }).$promise;
  }

  findStatisticsOf(_id): angular.IPromise<any> {
    return this.$restful.get({
        Type: 'organizations',
        Id: _id,
        Path1: 'dataForChart'
      }).$promise;
  }
};
