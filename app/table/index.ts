import {NgModule, Type} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MdtColumns} from './components/mdt-columns.component';
import {MdtFooter} from './components/mdt-footer.component';
import {MdtHeader} from './components/mdt-header.component';
import {MdtRows} from './components/mdt-rows.component';
import {MdtTable} from './components/mdt-table.component';

import {MdtCellAlign} from './directives/mdt-cell-align.directive';

export const TABLE_COMPONENTS = [MdtCellAlign, MdtColumns, MdtFooter, MdtHeader, MdtRows, MdtTable];

@NgModule({
    imports: [CommonModule],
    declarations: [TABLE_COMPONENTS],
    exports: [TABLE_COMPONENTS]
})
export class TableModule {}

export * from './directives/mdt-cell-align.directive';
export * from './components/mdt-columns.component';
export * from './components/mdt-footer.component';
export * from './components/mdt-header.component';
export * from './components/mdt-rows.component';
export * from './components/mdt-table.component';