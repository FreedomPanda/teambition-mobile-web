import {inject} from '../../../components/bases/Utils';
import {View} from '../../../components/bases/View';
import {RestAPI} from '../../../components/services/apis/RESTful';
import OrganizationService from './service';

@inject([
  'RestAPI'
])
class OrganizationView extends View {

  public ViewName = 'OrganizationView';

  public ORGANIZATION;
  private ORGANIZATION_COUNTERS;
  private RestAPI: RestAPI;
  private OrganizationService: OrganizationService;

  constructor() {
    super();
    this.OrganizationService = new OrganizationService(this.RestAPI);
    this.zone.run(angular.noop);
  }

  public onInit(): angular.IPromise<any> {
    let _id = this.$state.params._id;
    return this.$q.all([
      this.OrganizationService.findById(_id),
      this.OrganizationService.findStatisticsOf(_id)
    ])
    .then((data) => {
      this.ORGANIZATION = data[0];
      this.ORGANIZATION_COUNTERS = data[1];
    });
  }

  public getCount(item: string) {
    item = item.toLowerCase() + 'Counts';
    if (this.ORGANIZATION_COUNTERS) {
      let counters = this.ORGANIZATION_COUNTERS[item];
      if (counters) {
        return counters[counters.length - 1];
      }
    }
    return 0;
  }

  public getTrend(item: string) {
    item = item.toLowerCase() + 'Counts';
    if (this.ORGANIZATION_COUNTERS) {
      let counters = this.ORGANIZATION_COUNTERS[item];
      if (counters && counters.length >= 2) {
        let trend = counters[counters.length - 1] - counters[counters.length - 2];
        return trend > 0 ? '+' + trend : trend;
      }
    }
    return 0;
  }
}

angular.module('teambition').controller('OrganizationView', OrganizationView);
