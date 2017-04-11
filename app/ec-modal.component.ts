import { Component, ViewChild, HostListener, Input, SimpleChanges } from '@angular/core';

import { IContentItem, ContentType } from './ec.service';

import { emitEvent } from './windowevent';

interface IDimensions {
    width: number;
    height: number;
}

export const MODAL_EVENTS = {
    close: "modalcloseevent"
};

@Component({
    selector: 'ec-modal',
    templateUrl: './app/ec-modal.component.html',
    styleUrls: ['./app/ec-modal.component.css'],
    // host: {
    //     '(document:click)': 'onCloseClick()'
    // },
})
export class ECModalComponent {

    @Input('item')
    public item: IContentItem;

    private width: number = 0;

    private height: number = 0;

    ngOnChanges(changes: SimpleChanges) {
        if (changes && changes['item']) {
            let item = changes.item.currentValue;

            let dimensions = ECModalComponent.getDimensionsFromType(item.type);

            this.width = dimensions.width;
            this.height = dimensions.height;
        }
    }

    private onCloseClick(): void {
        this.item = null;

        emitEvent(MODAL_EVENTS.close);
    }

    @HostListener('window:resize', ['$event'])
    private onWindowResize() {
        if (this.item) {
            let dimensions = ECModalComponent.getDimensionsFromType(this.item.type);

            this.width = dimensions.width;
            this.height = dimensions.height;
        }
    }

    public static getDimensionsFromType(type: ContentType): IDimensions {
        let dimensions = null;

        switch (type) {
            case ContentType.WEB: {
                dimensions = { width: innerWidth * .8, height: innerHeight * .8 };
                break;
            }
            case ContentType.VIDEO: {
                dimensions = { width: 640, height: 320 };
                break;
            }
            case ContentType.IMAGE: {
                // temp, should be calculated from the actual viewport of the image
                dimensions = { width: innerWidth * .8, height: innerHeight * .8 };
            }

            default: break;;
        }

        return dimensions;
    }
}