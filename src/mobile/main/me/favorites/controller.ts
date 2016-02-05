import {inject} from '../../../../components/bases/Utils';
import {View} from '../../../../components/bases/View';
import {RestAPI} from '../../../../components/services/apis/RESTful';
import MeService from '../../me/service';

@inject([
  'RestAPI'
])
class MyFavoriteListView extends View {

  public ViewName = 'MyFavoriteListView';

  public FAVORITES;
  public FAVORITE_TYPE_TO_ICON_CLASS = {
    post: 'icon-wall',
    task: 'icon-board',
    event: 'icon-calendar',
    work: 'icon-file',
    entry: 'icon-bookkeeping'
  };
  private _id;
  private removing = false;
  private RestAPI: RestAPI;
  private MeService: MeService;

  constructor() {
    super();
    this.MeService = new MeService(this.RestAPI, {$q: this.$q});
    this.zone.run(angular.noop);
  }

  public onInit(): angular.IPromise<any> {
    this._id = this.$rootScope.userMe._id;
    return this.load();
  }

  public typeToIconClass(favorite) {
    let iconClass = 'icon ';
    if (favorite.refType === 'task') {
      if (favorite.data.isDone) {
        iconClass += 'icon-checkbox-ios-checked';
      } else {
        iconClass += 'icon-checkbox-thin';
        if (this._id !== favorite.data.executor._id &&
            this._id !== favorite.data.creator._id) {
          iconClass += ' notAssignedToMe';
        }
        // console.log(this._id, favorite.data.executor._id, favorite.data.creator._id);
      }
    } else {
      iconClass += this.FAVORITE_TYPE_TO_ICON_CLASS[favorite.refType];
    }
    return iconClass;
  }

  public formatEventDate(startDate, endDate) {
    // console.log(startDate, endDate);
    startDate = moment(startDate);
    endDate = moment(endDate);
    // console.log(startDate.isSame(endDate, 'day'));
    let string = startDate.format('MM-DD HH:mm') + ' - ',
        format = '';
    if (startDate.isSame(endDate, 'day')) {
      format = 'HH:mm';
    } else {
      format = 'MM-DD HH:mm';
    }
    string += endDate.format(format);
    return string;
  }

  public remove(index) {
    if (this.removing) {
      return this.$ionicListDelegate.closeOptionButtons();
    }
    this.removing = true;
    let _id = this.FAVORITES[index]._refId,
        type = this.FAVORITES[index].refType;
    this.MeService.removeMyFavorite(_id, type)
    .then(() => this.removeLocal(index))
    .finally(() => {
      this.$ionicListDelegate.closeOptionButtons();
      this.removing = false;
    });
  }

  private removeLocal(index) {
    this.FAVORITES.splice(index, 1);
  }

  private load(newly: boolean = false): angular.IPromise<any> {
    return this.MeService.findMyFavorites(newly)
    .then((favorites) => this.FAVORITES = favorites);
  }
}

angular.module('teambition').controller('MyFavoriteListView', MyFavoriteListView);
