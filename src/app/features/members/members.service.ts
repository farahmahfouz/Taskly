import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AcceptInviteRequest, InviteMemberRequest, Member } from './members.model';
import { API } from '../../core/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  constructor(private http: HttpClient) {}

  getProjectMembers(projectId: string) {
    return this.http.get<Member[]>(`${API.MEMBERS}?project_id=eq.${projectId}`);
  }

  inviteMember(request: InviteMemberRequest) {
    return this.http.post<void>(`${API.INVITE_MEMBER}/invite_member`, request);
  }

  acceptInvite(request: AcceptInviteRequest) {
    return this.http.post<void>(`${API.INVITE_MEMBER}/accept_invitation`, request);
  }
}
