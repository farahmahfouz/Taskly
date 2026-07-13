import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProjectContextService {
  activeProjectId = signal<string | null>(null);

  constructor() {
    const saved = localStorage.getItem('activeProjectId');
    if (saved) {
      this.activeProjectId.set(saved);
    }
  }

  setProjectId(id: string) {
    localStorage.setItem('activeProjectId', id);
    this.activeProjectId.set(id);
  }

  clearProjectId() {
    localStorage.removeItem('activeProjectId');
    this.activeProjectId.set(null);
  }
}
