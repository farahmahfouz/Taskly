import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OpenPopupService {
  private _selectedTaskId = signal<string>('');
  private _isOpen = signal<boolean>(false);

  selectedTaskId = this._selectedTaskId.asReadonly();
  isOpen = this._isOpen.asReadonly();

  open(taskId: string) {
    this._selectedTaskId.set(taskId);
    this._isOpen.set(true);
  }

  close() {
    this._isOpen.set(false);
  }
}
