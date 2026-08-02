import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule, DOCUMENT } from '@angular/common';

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
  private document = inject<Document>(DOCUMENT);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
  ) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.items.set(this.buildBreadcrumbs(this.route.root)));

    this.items.set(this.buildBreadcrumbs(this.route.root));

    effect(() => {
      this.updateBreadcrumbJsonLd(this.items());
    });


    this.destroyRef.onDestroy(() => {
      this.document.getElementById('breadcrumb-jsonld')?.remove();
    });
  }

  private buildBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: BreadcrumbItem[] = [],
  ): BreadcrumbItem[] {
    const children = route.children;
    if (children.length === 0) return breadcrumbs;

    for (const child of children) {
      const routeUrl = child.snapshot.url.map(s => s.path).join('/');
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

  private updateBreadcrumbJsonLd(items: BreadcrumbItem[]): void {

    this.document.getElementById('breadcrumb-jsonld')?.remove();

    if (!items.length) return;

    const origin = this.document.location.origin;

    const itemListElement = items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(index < items.length - 1 ? { item: `${origin}${item.url}` } : {}),
    }));

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement,
    };

    const script = this.document.createElement('script');
    script.id = 'breadcrumb-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }
}
