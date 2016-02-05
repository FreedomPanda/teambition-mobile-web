import {inject} from '../../../../components/bases/Utils';
import {View} from '../../../../components/bases/View';
import {RestAPI} from '../../../../components/services/apis/RESTful';
import MeService from '../../me/service';

@inject([
  'RestAPI'
])
class MyNoteListView extends View {

  public static $inject = ['$scope'];
  public ViewName = 'MyNoteListView';

  public NOTES;
  public MODAL;
  public NOTE: angular.IFormController;
  public note;
  private _note;
  private removing = false;
  private editing = false;
  private saving = false;
  private RestAPI: RestAPI;
  private MeService: MeService;
  private angular: ng.IAngularStatic = angular;

  constructor($scope: angular.IScope) {
    super();
    this.$scope = $scope;
    this.MeService = new MeService(this.RestAPI, {$q: this.$q});
    this.zone.run(angular.noop);
  }

  public onInit(): angular.IPromise<any> {
    this.MODAL = this.$ionicModal.fromTemplateUrl('main/me/notes/detail.html', {
      scope: this.$scope,
      animation: 'slide-in-right'
    });
    return this.load();
  }

  public remove(index) {
    if (this.removing) {
      return this.$ionicListDelegate.closeOptionButtons();
    }
    this.removing = true;
    let _id = this.NOTES[index]._id;
    this.MeService.removeMyNote(_id)
    .then(() => this.removeLocal(index))
    .finally(() => {
      this.$ionicListDelegate.closeOptionButtons();
      this.removing = false;
    });
  }

  public showIonicModel(note) {
    this.MODAL.then((modal) => {
      this._note = note;
      this.note = this.angular.copy(note);
      this.NOTE.$setPristine();
      modal.show();
    });
  }

  public hideIonicModel(TYPE) {
    this.editing = false;
    this.saving = false;
    this.MODAL.then((modal) => modal.hide());
  }

  public editOrCancelOrSave() {
    if (!this.editing) {
      this.editing = true;
    } else if (this.NOTE.$pristine) {
      this.editing = false;
    } else if (this.NOTE.$valid) {
      this.$ionicLoading.show();
      this.saving = true;
      this.MeService.updateMyNote(this.note._id, this.note)
      .then((note) => {
        this.note = note;
        this.angular.extend(this._note, note);
        this.editing = false;
        this.NOTE.$setPristine();
      })
      .finally(() => {
        this.saving = false;
        this.$ionicLoading.hide();
      });
    }
  }

  private removeLocal(index) {
    this.NOTES.splice(index, 1);
  }

  private load(): angular.IPromise<any> {
    return this.MeService.findMyNotes()
    .then((notes) => {
      this.NOTES = notes;
    });
  }
}

angular.module('teambition').controller('MyNoteListView', MyNoteListView);
