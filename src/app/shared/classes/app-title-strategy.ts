import { Injectable } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
  constructor(private title: Title, private meta: Meta) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const pageTitle = this.buildTitle(routerState);
    this.title.setTitle(pageTitle ? `TASKLY | ${pageTitle}` : 'TASKLY');

    // هات آخر route نشط عشان نجيب منه الـ data
    // let route = routerState.root;
    // while (route.firstChild) {
    //   route = route.firstChild;
    // }

    // const description = route.data?.['description'] 
    //   ?? 'HERA - إدارة مهامك ومشاريعك بسهولة';

    // this.meta.updateTag({ name: 'description', content: description });
  }
}