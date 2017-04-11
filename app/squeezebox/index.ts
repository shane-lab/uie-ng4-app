import {NgModule, Type} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SqueezeBox} from './components/squeezebox.component';
import {SBItem} from './components/sb-item.component';
import {SBItemHead} from './components/sb-item-head.component';
import {SBItemBody} from './components/sb-item-body.component';

export const SQUEEZEBOX_COMPONENTS = [SqueezeBox, SBItem, SBItemHead, SBItemBody];

@NgModule({
    imports: [CommonModule],
    declarations: [SQUEEZEBOX_COMPONENTS],
    exports: [SQUEEZEBOX_COMPONENTS]
})
export class SqueezeBoxModule {}

export * from './components/sb-item.component';
export * from './components/sb-item-head.component';
export * from './components/sb-item-body.component';
export * from './components/squeezebox.component';
