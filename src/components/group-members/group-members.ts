import { Groups } from '../../models/groups.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'group-members',
  templateUrl: 'group-members.html'
})
export class GroupMembersComponent {

  @Input() grupo: Groups;
  constructor() {
  }

}
