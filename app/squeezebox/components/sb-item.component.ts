import {Component, ContentChild, Input, Inject, forwardRef} from '@angular/core';
import {SBItemBody} from './sb-item-body.component';
import {SqueezeBox} from './squeezebox.component';

@Component({
    exportAs: 'sbItem',
    selector: 'sb-item',
    template: `
        <div class="sb-item" [ngClass]="{'is-collapsed': collapsed}">
            <ng-content></ng-content>
        </div>
    `
})
export class SBItem {

    private squeezebox:SqueezeBox;

    @Input() public collapsed: boolean = true;
    
    @ContentChild(SBItemBody) body: SBItemBody;

    constructor(@Inject(forwardRef(() => SqueezeBox)) squeezebox: SqueezeBox) {
        this.squeezebox = squeezebox;
    }

    ngAfterViewInit() {
        this.body.toggle(this.collapsed);
    }
    toggle(collapsed: boolean) {
        this.squeezebox.didItemToggled(this);
        this.applyToggle(collapsed);
    }
    
    applyToggle(collapsed: boolean) {
        this.collapsed = collapsed;
        this.body.toggle(collapsed);
    }

}
