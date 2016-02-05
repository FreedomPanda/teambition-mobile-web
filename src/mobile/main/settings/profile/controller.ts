import {Iapp} from 'teambition';
import {inject} from '../../../../components/bases/Utils';
import {View} from '../../../../components/bases/View';
import {RestAPI} from '../../../../components/services/apis/RESTful';
import MeService from '../../me/service';
// import './filter';

@inject([
  '$http',
  'RestAPI',
  'app'
])
class SettingProfileView extends View {

  public ViewName = 'SettingProfileView';

  public ME: angular.IFormController;
  public me;
  private _me;
  private $http: angular.IHttpService;
  private RestAPI: RestAPI;
  private app: Iapp;
  private MeService: MeService;
  private _editing: boolean = false;
  private _saving: boolean = false;
  private NAMES = [
    'name',
    'email',
    'avatarUrl',
    'title',
    'birthday',
    'location',
    'phone',
    'website'
  ];
  private DECORATOR = (value, name) => value;
  private BIRTHDAY_DECORATOR = (value, name) => (name === 'birthday') ? new Date(value) : value;

  constructor($scope: angular.IScope) {
    super();
    this.$scope = $scope;
    this.MeService = new MeService(this.RestAPI, {
      $http: this.$http,
      $q: this.$q,
      options: this.app
    });
    this.zone.run(angular.noop);
  }

  public onInit(): angular.IPromise<any> {

    this.me = this.copy(
      this.$rootScope.userMe, this.me,
      this.NAMES,
      this.BIRTHDAY_DECORATOR
    );
    this._me = this.copy(this.me, {}, this.NAMES);
    // console.log(this.me.birthday, this._me.birthday);

    return this.$q.resolve();
  }

  public isEditing() {
    return !!this._editing;
  }

  public isSaving() {
    return !!this._saving;
  }

  public editOrSave() {
    if (this._editing) {
      this._saving = true;
      this._editing = false;
      this.$ionicLoading.show();
      this.save().finally(() => {
        this._saving = false;
        this.$ionicLoading.hide();
      });
    } else {
      this._editing = true;
    }
  }

  private save() {
    // this.$scope.$apply();
    // console.log(this.me);
    // console.log(this.me.birthday, this._me.birthday);
    let me = this.diff(this.me, this._me, this.NAMES);
    if (me && this.ME.$valid && this.ME.$dirty) {
      // me = this.copy(this.me, {}, this.NAMES);
      me.name = me.name || (this.me.name || '').trim();
      me.avatarUrl = this.me.avatarUrl;
      // console.log('save', me);
      return this.MeService.update(me)
        .then((me) => {
          this.copy(me, this.me, this.NAMES, this.BIRTHDAY_DECORATOR);
          this._me = this.copy(this.me, {}, this.NAMES);
          this.ME.$setPristine();
        });
    } else {
      return this.$q.resolve();
    }
  }

  private copy(from, to, names, decorator = this.DECORATOR) {
    to = to || {};
    names.forEach((name) => {
      let value = (from[name] || '');
      if (value) {
        to[name] = decorator(value, name);
      }
    });
    return to;
  }

  private diff(one, another, names, decorator = this.DECORATOR) {
    let difference = null;
    names.forEach((name) => {
      let value = (one[name] || ''),
          anotherValue = (another[name] || '');
      if (value === anotherValue ||
          value instanceof Date && anotherValue instanceof Date &&
          value.getTime() === anotherValue.getTime()) { return; }
      difference = difference || {};
      difference[name] = decorator(value, name);
    });
    return difference;
  }
}

angular.module('teambition').controller('SettingProfileView', SettingProfileView);
