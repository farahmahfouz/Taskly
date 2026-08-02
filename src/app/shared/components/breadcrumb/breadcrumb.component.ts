import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

export interface BreadcrumbItem {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent {
  readonly items = signal<BreadcrumbItem[]>([]);

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.items.set(this.buildBreadcrumbs(this.route.root)));

    this.items.set(this.buildBreadcrumbs(this.route.root));
  }

  private buildBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: BreadcrumbItem[] = []
  ): BreadcrumbItem[] {
    const children = route.children;
    if (children.length === 0) return breadcrumbs;

    for (const child of children) {
      const routeUrl = child.snapshot.url.map((s) => s.path).join('/');
      const nextUrl = routeUrl ? `${url}/${routeUrl}` : url;

      const breadcrumbData = child.snapshot.data['breadcrumb'];
      const label =
        typeof breadcrumbData === 'function' ? breadcrumbData(child.snapshot) : breadcrumbData;

      if (label) {
        breadcrumbs.push({ label, url: nextUrl });
      }

      return this.buildBreadcrumbs(child, nextUrl, breadcrumbs);
    }

    return breadcrumbs;
  }
}