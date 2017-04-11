import { Component, ViewChild, ElementRef, HostListener, OnInit } from '@angular/core';

import { ECModalComponent, MODAL_EVENTS } from './ec-modal.component';

import { PullTopDrawerComponent, PULLDRAWER_EVENTS } from './pull-top-drawer.component';

import { IContentItem, ContentType } from './ec.service';

interface ILangcode {
  language: string;
  name: string;
};

interface IInvitee {
  email: string;
  name: string;
}

@Component({
  selector: 'my-root',
  templateUrl: './app/app.component.html',
  styleUrls: ['./app/app.component.css']
})
export class AppComponent {

  private activePreviewItem: IContentItem;

  private unmergedLoaded: boolean = false;
  private mergedLoaded: boolean = false;

  private isPreloading: boolean = true;

  private languages: ILangcode[] = [];

  private invitees: IInvitee[] = [{
    email: 'arjan@ec.uie.nl',
    name: 'Arjan van Hugten',
  }, {
    email: 'stan@ec.uie.nl',
    name: 'Stan boerekamp',
  }, {
    email: 'rick@ec.uie.nl',
    name: 'Rick Peters',
  }]

  @ViewChild(PullTopDrawerComponent)
  private pullDrawer: PullTopDrawerComponent;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    let elem = this.elementRef.nativeElement;

    let timeout = 2000;

    let unmerged: HTMLElement = elem.querySelector('#unmerged-doc');
    if (unmerged) {
      unmerged.addEventListener('load', () => {
        setTimeout(() => {
          this.unmergedLoaded = true;

          this.stopPreloader();
        }, timeout);
      });
    } else {
      this.unmergedLoaded = true;
    }

    let merged: HTMLElement = elem.querySelector('#merged-doc');
    if (merged) {
      merged.addEventListener('load', () => {
        setTimeout(() => {
          this.mergedLoaded = true;

          this.stopPreloader();
        }, timeout)
      });
    } else {
      this.mergedLoaded = true;

      this.stopPreloader();
    }

    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.responseText) {
        let data = JSON.parse(request.responseText);

        this.languages = data.languages;
      }
    };
    request.open('GET', '/assets/langcodes.json', true);
    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    request.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    request.send();
  }

  public shouldPreload() {
    return (!this.unmergedLoaded || !this.mergedLoaded) && this.isPreloading;
  }

  private stopPreloader() {
    if (this.shouldPreload()) {
      return;
    }

    let elem = this.elementRef.nativeElement

    let preloader = elem.parentElement.querySelector('#preloader');
    if (preloader) {
      let opacity = 1.;
      let interval = setInterval(() => {
        if (opacity <= .0) {
          clearInterval(interval);

          preloader.remove();
          this.isPreloading = false;
        } else {
          opacity -= .02;
        }

        preloader.style.opacity = opacity;
      }, .2);
    }
  }

  @HostListener(`window:${PULLDRAWER_EVENTS.itemClick}`, ['$event'])
  private onDrawerItemClick(event: CustomEvent) {
    this.activePreviewItem = this.pullDrawer.item;
  }

  @HostListener(`window:${MODAL_EVENTS.close}`, ['$event'])
  private onModalClose(event: CustomEvent) {
    this.pullDrawer.item = this.activePreviewItem = null;
  }
}