import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/RX';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

export enum ContentType {
    WEB = 0,
    VIDEO = 1,
    IMAGE = 2
};

export interface IContentItem {
    source: string;
    type: ContentType;
};

@Injectable()
export class ECService {
    public static readonly URI: string = 'http://ec2.shanelab.nl/api.php';

    public static readonly ROUTES = {
        WEB: 'sites',
        IMAGES: 'images',
        VIDEOS: 'videos',
        ALL: 'all'
    };
    
    private status: string;

    constructor(private http: Http) { }

    public getStatus(): string {
        return this.status;
    }

    public getWebsites(query: string): Promise<IContentItem[]> {
        return this.requestQ(ECService.ROUTES.WEB, query);
    }

    public getImages(query: string): Promise<IContentItem[]> {
        return this.requestQ(ECService.ROUTES.IMAGES, query);
    }

    public getVideos(query: string): Promise<IContentItem[]> {
        return this.requestQ(ECService.ROUTES.VIDEOS, query);
    }

    public getByRoute(route: string, query: string): Promise<IContentItem[]> {
        return new Promise((resolve, reject) => {
            let keys = Object.keys(ECService.ROUTES);

            let value: string = null;
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];

                let tempValue = ECService.ROUTES[key];
                if (key.toLowerCase() === route.toLowerCase() ||
                    (tempValue && tempValue.toLowerCase() === route.toLowerCase())) {
                    value = tempValue;
                    break;
                }
            }

            if (value) {
                resolve(this.requestQ(value, query));
            } else {
                reject(new Error(`Request error: The given route ${route} does not exist`));
            }
        });
    }

    private requestQ(route: string, query: string): Promise<IContentItem[]> {
        let endpoint = `${ECService.URI}?route=${route}&query=${query}`;

        return new Promise((resolve, reject) => {
            this.http.get(endpoint)
                .map((res: Response) => res.json())
                .catch((error: any) => Observable.throw(error || error.json().error || 'Server error'))
                .subscribe(response => {
                    if (response !== undefined && response != null) {
                        if (response['success'] === true) {
                            let items: IContentItem[] = [];

                            let resultSet: any[] = response.items || [];

                            // block all non-reachable content
                            asyncLoop(resultSet.length, (loop: any) => {
                                let index = loop.iteration();
                                this.status = `${Math.ceil(((index + 1) / resultSet.length) * 100)} %`;
                                
                                let item = resultSet[index];

                                let source = item['source'];
                                if (source) {
                                    this.checkHttpStatus(source, (status: any) => {
                                        if (status === 0 || status === 200) {
                                            items.push(this.constructContentItem(item));
                                        }

                                        loop.next();
                                    });
                                }
                            }, () => {
                                resolve(items);
                                this.status = null;
                            });

                            // for (let i = 0; i < resultSet.length; i++) {
                            //     let item = resultSet[i];
                                
                            //     items.push(this.constructContentItem(item));
                            // }
                            // resolve(items);
                        } else {
                            reject(new Error(response.error || 'No items'));
                            this.status = null;
                        }
                    } else {
                        reject(new Error('Server error while resolving, possible outdated api result'));
                        this.status = null;
                    }
                }, error => {
                    reject(error || new Error('Server error, possible outdated api endpoint'));
                    this.status = null;
                });
        });
    }

    private constructContentItem(item: object): IContentItem {
        let typeId = item['typeId'];
        let type = ContentType[`${typeId}`];

        // console.log(item);

        let contentItem: IContentItem = null;
        if (type) {
            contentItem = {
                source: item['source'],
                type: typeId
            };

            switch(typeId) {
                case 0: {
                    contentItem['title'] = item['title'];
                    contentItem['description'] = item['description'];
                    break;
                }
                case 1: {
                    contentItem['thumbnail'] = item['thumbnail'];
                    break;
                }
                case 2: {
                    contentItem['author'] = item['author'];
                    contentItem['width'] = item['width'];
                    contentItem['height'] = item['height'];
                    break;
                }
                default: break;
            }
        }

        return contentItem;
    }

    private checkHttpStatus(uri: string, callback: Function) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                callback(request.status);
            }
        }
        request.open('HEAD', uri, true);
        request.send();
    }
}

function asyncLoop(iterations: number, call: Function, done: Function) {
    let index = 0;
    let finished = false;
    let loop = {
        next: () => {
            if (finished) {
                return;
            }

            if (index < iterations) {
                index++;
                call(loop);
            } else {
                finished = true;
                done();
            }
        },

        iteration: () => {
            return index - 1;
        },

        break: () => {
            finished = true;
            done();
        }
    };

    loop.next();

    return loop;
}