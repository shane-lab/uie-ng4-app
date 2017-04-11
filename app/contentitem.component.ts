import { Component, Input, ElementRef, OnInit } from '@angular/core';

import { IContentItem, ContentType } from './ec.service';

@Component({
    selector: 'contentitem',
    templateUrl: 'app/contentitem.component.html',
    styleUrls: ['app/contentitem.component.css']
})
export class ContentItemComponent {

    @Input() 
    public item: IContentItem;

    @Input()
    public full: boolean = true;

    @Input()
    public primary: string = '#222';

    @Input()
    public accent: string = '#3f51b5';

    private height = 0;

    constructor(private elementRef: ElementRef) { }

    ngAfterViewInit() {
        let elem = this.elementRef.nativeElement;

        let container: HTMLElement = null;
        switch(this.item.type) {
            case ContentType.WEB: {
                container = elem.querySelector("#web");
                break;
            }
            case ContentType.VIDEO: {
                container = elem.querySelector("#video");
                break;
            }
            case ContentType.IMAGE: {
                container = elem.querySelector("#image");
                break;
            }
        }

        if (container) {
            this.height = container.clientHeight;
        }
    }
}