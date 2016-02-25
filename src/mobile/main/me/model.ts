import {IUserMe} from 'teambition';
import BaseModel from '../../../components/bases/BaseModel';

class MeModel extends BaseModel {

  private USER_NAMESPACE = 'USER';
  private ME_ID = 'ME';

  private MY_NAMESPACE = 'MY';
  private COUNTER_LIST = 'COUNTERS';
  private NOTE_LIST = 'NOTES';
  private FAVORITE_LIST = 'FAVORITES';
  private AFFAIR_LIST = 'AFFAIRS';
  private EVENT_LIST = 'EVENTS';
  private UNFULFILLED_TASK_LIST = 'UNFULFILLED_TASKS';
  private FULFILLED_TASK_LIST = 'FULFILLED_TASKS';
  private FOLLOWING_TASK_LIST = 'FOLLOWING_TASKS';
  private CREATING_TASK_LIST = 'CREATING_TASKS';

  find(): IUserMe {
    return this._get<IUserMe>(this.USER_NAMESPACE, this.ME_ID);
  }
  update(me: IUserMe) {
    this._set(this.USER_NAMESPACE, this.ME_ID, me);
    return me;
  }
  remove() {
    this._delete(this.USER_NAMESPACE, this.ME_ID);
  }

  findMyCounters() {
    return this._get<any>(this.MY_NAMESPACE, this.COUNTER_LIST);
  }
  updateMyCounters(counters) {
    this._set(this.MY_NAMESPACE, this.COUNTER_LIST, counters);
    return counters;
  }
  removeMyCounters() {
    this._delete(this.MY_NAMESPACE, this.COUNTER_LIST);
  }

  findMyNotes() {
    return this._get<any>(this.MY_NAMESPACE, this.NOTE_LIST);
  }
  updateMyNotes(notes) {
    this._set(this.MY_NAMESPACE, this.NOTE_LIST, notes);
    return notes;
  }
  removeMyNotes() {
    this._delete(this.MY_NAMESPACE, this.NOTE_LIST);
  }
  removeMyNoteByID(_id) {
    let notes = this.findMyNotes() || [];
    console.log(_id, notes);
    notes.some((note, index) => {
      if (note._id === _id) {
        notes.splice(index, 1);
        console.log(this.findMyNotes());
        return true;
      }
    });
  }
  removeMyNoteByIndex(index) {
    let notes = this.findMyNotes() || [];
    if (index < notes.length) {
      notes.splice(index, 1);
    }
  }

  findMyFavorites() {
    return this._get<any>(this.MY_NAMESPACE, this.FAVORITE_LIST);
  }
  updateMyFavorites(favorites) {
    this._set(this.MY_NAMESPACE, this.FAVORITE_LIST, favorites);
    return favorites;
  }
  removeMyFavorites() {
    this._delete(this.MY_NAMESPACE, this.FAVORITE_LIST);
  }

  findMyAffairs() {
    return this._get<any>(this.MY_NAMESPACE, this.AFFAIR_LIST);
  }
  updateMyAffairs(affairs) {
    this._set(this.MY_NAMESPACE, this.AFFAIR_LIST, affairs);
    return affairs;
  }
  removeMyAffairs() {
    this._delete(this.MY_NAMESPACE, this.AFFAIR_LIST);
  }

  findMyEvents() {
    return this._get<any>(this.MY_NAMESPACE, this.EVENT_LIST);
  }
  updateMyEvents(events) {
    this._set(this.MY_NAMESPACE, this.EVENT_LIST, events);
    return events;
  }
  removeMyEvents() {
    this._delete(this.MY_NAMESPACE, this.EVENT_LIST);
  }

  findMyUnfulfilledTasks() {
    return this._get<any>(this.MY_NAMESPACE, this.UNFULFILLED_TASK_LIST);
  }
  updateMyUnfulfilledTasks(tasks) {
    this._set(this.MY_NAMESPACE, this.UNFULFILLED_TASK_LIST, tasks);
    return tasks;
  }
  removeMyUnfulfilledTasks() {
    this._delete(this.MY_NAMESPACE, this.UNFULFILLED_TASK_LIST);
  }

  findMyFulfilledTasks() {
    return this._get<any>(this.MY_NAMESPACE, this.FULFILLED_TASK_LIST);
  }
  updateMyFulfilledTasks(tasks) {
    this._set(this.MY_NAMESPACE, this.FULFILLED_TASK_LIST, tasks);
    return tasks;
  }
  removeMyFulfilledTasks() {
    this._delete(this.MY_NAMESPACE, this.FULFILLED_TASK_LIST);
  }

  findMyFollowingTasks() {
    return this._get<any>(this.MY_NAMESPACE, this.FOLLOWING_TASK_LIST);
  }
  updateMyFollowingTasks(tasks) {
    this._set(this.MY_NAMESPACE, this.FOLLOWING_TASK_LIST, tasks);
    return tasks;
  }
  removeMyFollowingTasks() {
    this._delete(this.MY_NAMESPACE, this.FOLLOWING_TASK_LIST);
  }

  findMyCreatingTasks() {
    return this._get<any>(this.MY_NAMESPACE, this.CREATING_TASK_LIST);
  }
  updateMyCreatingTasks(tasks) {
    this._set(this.MY_NAMESPACE, this.CREATING_TASK_LIST, tasks);
    return tasks;
  }
  removeMyCreatingTasks() {
    this._delete(this.MY_NAMESPACE, this.CREATING_TASK_LIST);
  }
}

export default new MeModel();
