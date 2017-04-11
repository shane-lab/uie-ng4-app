import {Component, Input} from "@angular/core";
import {DataService} from "../services/DataService";
import {MdtRows} from "./mdt-rows.component";
// import {MdIconRegistry} from "@angular2-material/icon";
import {MdtColumns} from "./mdt-columns.component";
import {ITableHeader} from "../interfaces/ITableHeader";
import {MdtHeader} from "./mdt-header.component";
import {IPagination} from "../interfaces/IPagination";
import {MdtFooter} from "./mdt-footer.component";
import {ITableFooter} from "../interfaces/ITableFooter";
import {ArrayPaginationService} from "../services/ArrayPaginationService";
import {SortService} from "../services/SortService";
export {AlignRule} from '../enums/AlignRule';

@Component({
    selector: 'mdt-table',
    templateUrl: 'app/table/views/mdt-table.html',
    providers: [DataService, ArrayPaginationService, /*MdIconRegistry,*/ SortService]
})
export class MdtTable{
    @Input('columns') columns: any;
    @Input('rows') rows: any;
    @Input('table-header') tableHeader: ITableHeader;
    @Input('pagination') pagination: IPagination;
    @Input('sortable-columns') sortableColumns: boolean;

    tableFooter: ITableFooter;

    constructor(protected dataService: DataService,
                protected arrayPaginationService: ArrayPaginationService,
                protected sortService: SortService){

    }

    ngOnInit(){
        this.dataService.addColumns(this.columns);
        this.dataService.addRows(this.rows);

        this.sortService.setSortingEnabled(this.sortableColumns);

        this.tableFooter = {
            pagination: this.pagination || <IPagination>{}
        };
    }
}