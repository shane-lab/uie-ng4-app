import { Pipe, PipeTransform, Injectable } from '@angular/core';

import { IContentItem, ContentType } from './ec.service';

@Pipe({
    name: 'contentitemfilter',
    // pure: false
})
@Injectable()
export class ContentItemFilterPipe implements PipeTransform {
    transform(items: IContentItem[], field: number): any[] {
        return items ? items.filter(item => <number> item.type === field) : [];
    }
}