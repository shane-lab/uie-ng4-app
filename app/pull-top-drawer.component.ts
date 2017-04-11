import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';

import { IContentItem, ContentType, ECService } from './ec.service';

import { emitEvent } from './windowevent';

export const PULLDRAWER_EVENTS = {
    startPull: "pullstartevent",
    stopPull: "pullstopevent",
    itemClick: "pullitemclickevent"
};

@Component({
    selector: 'pull-top-drawer',
    providers: [ECService],
    templateUrl: 'app/pull-top-drawer.component.html',
    styleUrls: ['app/pull-top-drawer.component.css'/*, 'assets/bootstrap/css/bootstrap.css', 'assets/bootstrap/css/style.css'*/]
})
export class PullTopDrawerComponent {

    engines = [{
        name: 'Google',
        enabled: true
    }, {
        name: 'Flickr',
        enabled: false
    }, {
        name: 'Pixabay',
        enabled: false
    }, {
        name: 'GettyImages',
        enabled: false
    }];

    googleLanguages = [
        { name: 'None' },
        { name: 'Dutch [NL]' },
        { name: 'English [EN]' },
        { name: 'German [DE]' },
        { name: 'French [FR]' }
    ];
    
    googleColorTypes = [
        { name: 'All' },
        { name: 'Color' },
        { name: 'Mono' },
        { name: 'Grey' }
    ];

    googleSizeFormats = [
        { name: 'All' },
        { name: 'Icon' },
        { name: 'Small' },
        { name: 'Medium' },
        { name: 'Large' },
        { name: 'XLarge' },
        { name: 'XXLarge' },
        { name: 'Huge' }
    ];

    googleColors = [
        { name: 'All' },
        { name: 'Black' },
        { name: 'Blue' },
        { name: 'Brown' },
        { name: 'Grey' },
        { name: 'Green' },
        { name: 'Pink' },
        { name: 'Purple' },
        { name: 'Teal' },
        { name: 'Yellow' },
        { name: 'White' }
    ];
    
    flickrOrientations = [
        { name: 'All' },
        { name: 'Landscape' },
        { name: 'Portrait' }
    ];

    pixabayOrientations = [
        { name: 'All' },
        { name: 'Landscape' },
        { name: 'Portrait' }
    ];

    gettyImagesOrientations = [
        { name: 'All' },
        { name: 'Landscape' },
        { name: 'Portrait' }
    ];

    @ViewChild("banner")
    private banner: ElementRef;

    private searchResults: IContentItem[];
    private searchResultsCache: IContentItem[][] = [];

    private cacheIndex: number;

    private items: IContentItem[];

    public item: IContentItem;

    private open: boolean = true;

    private searching: boolean = false;

    private inAnim: boolean = false;

    private mouseDown: boolean = false;

    private maxHeight: number = window.innerHeight * .6;

    private minHeight: number = 180;

    private height: number = window.innerHeight * .6;

    private startY: number = 0;
    private lastY: number = 0;

    private target: HTMLElement;

    public myFilter = { type: ContentType.WEB };

    constructor(private ecService: ECService) {
        this.updateHeight();
    }

    public isOpen(): boolean {
        return this.open;
    }

    public isPulling(): boolean {
        return this.mouseDown;
    }

    private hasEngines(): boolean {
        return this.engines.filter(engine => engine.enabled).length >= 1;
    }

    private hasCachedSearchResults(): boolean {
        return this.searchResultsCache && this.searchResultsCache.length > 0;
    }

    private submit(): void {
        this.searching = true;
        let prevResult = this.searchResults;
        this.searchResults = [];

        // this.ecService.getWebsites('')
        this.ecService.getByRoute(ECService.ROUTES.ALL, '')
            .then(items => {
                this.searching = false;

                if (prevResult && prevResult.length > 0) {
                    this.searchResultsCache.push(prevResult);
                }
                this.searchResults = items;
            })
            .catch(err => {
                this.searching = false;

                console.error(err);
            });
    }

    private prevSubmit(): void {
        this.searchResults = this.searchResultsCache.pop() || [];
    }

    private setSelectedItem(item: IContentItem): void {
        this.item = item;
        emitEvent(PULLDRAWER_EVENTS.itemClick);
    }

    private startDrag(event: MouseEvent | any): void {
        if (this.inAnim) {
            return;
        }

        let trusted = this.mouseDown = event.isTrusted;
        if (trusted) {
            event.preventDefault();

            this.target = <HTMLElement>event.target;

            if (event instanceof MouseEvent) {
                this.startY = event.clientY;
            } else {
                if (typeof TouchEvent !== 'undefined' && event instanceof TouchEvent) {
                    this.startY = event.touches[0].clientY;
                }
            }
        }
    }

    @HostListener('window:mousemove', ['$event'])
    private onMouseMove(event: MouseEvent): void {
        this.dragHandler(event.clientY);
    }

    @HostListener('window:touchmove', ['$event'])
    private onTouchMove(event: any): void {
        if (typeof TouchEvent !== 'undefined' && event instanceof TouchEvent) {
            this.dragHandler(event.touches[0].clientY);
        }
    }

    private dragHandler(clientY: number) {
        if (this.mouseDown && this.target) {
            let height = clientY - this.target.clientHeight - this.banner.nativeElement.clientHeight; // + top banner height

            if (height <= this.maxHeight) {
                this.height = height;
                this.lastY = clientY;
            }
        }
    }

    @HostListener('window:mouseup', ['$event'])
    private onMouseUp(event: MouseEvent): void {
        this.stopDragHandler();
    }

    @HostListener('window:touchend', ['$event'])
    private onTouchEnd(event: any): void {
        this.stopDragHandler()
    }

    @HostListener('window:resize', ['$event'])
    private onWindowResize(event: Event): void {
        this.updateHeight();
    }

    private updateHeight(): void {
        this.maxHeight = window.innerHeight * .6;
        this.height = this.open ? this.maxHeight : this.minHeight;
    }

    private animate(): void {
        let diff = this.maxHeight - this.height;

        this.inAnim = true;

        let fragment = 0.125 * this.maxHeight;
        if (this.open) {
            if (diff > fragment) { // up
                this.open = false;
                let interval = setInterval(() => {
                    if (this.height <= this.minHeight) {
                        clearInterval(interval);
                        this.inAnim = false;
                    } else {
                        this.height -= 5;
                    }
                }, 7.5);
            } else { // down
                let interval = setInterval(() => {
                    if (this.height >= this.maxHeight) {
                        this.height = this.maxHeight;
                        clearInterval(interval);
                        this.inAnim = false;
                    } else {
                        this.height += 5;
                    }
                }, 15);
            }
        } else { // TODO: fix down animation, always goes down
            // if (diff > fragment) { // down
            this.open = true;
            let interval = setInterval(() => {
                if (this.height >= this.maxHeight) {
                    this.height = this.maxHeight;
                    clearInterval(interval);
                    this.inAnim = false;
                } else {
                    this.height += 5;
                }
            }, 7.5)
            // } else {
            //     let interval = setInterval(() => {
            //         if (this.height <= this.minHeight) {
            //             clearInterval(interval);
            //             this.inAnim = false;
            //         } else {
            //             this.height -= 5;
            //         }
            //     }, 15);
            // }
        }
    }

    private stopDragHandler(): void {
        if (this.mouseDown) {
            this.animate();
        }
        if (this.target) {
            this.target = null;
        }

        this.mouseDown = false;
    }
}

