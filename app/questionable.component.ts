import { Component, Input, ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

@Component({
    selector: 'questionable-dialog',
    template: `
        <h2>What is {{title || 'this'}}?</h2>
        <p>{{answer}}<p>
        <button md-raised-button color="accent" (click)="dialogRef.close()">I understand!</button>
    `
})
export class QuestionableDialogComponent {

    public title: string;

    public answer: string;

    constructor(public dialogRef: MdDialogRef<any>) { }
}

@Component({
    selector: 'questionable',
    template: `
        <span class="question" [style.color]="color" (click)="open()" [title]="answer">[?]</span>
    `,
    styles: [`
        .question {
            font-weight: 100;
            font-size: 12px;
            cursor: help;
        }
    `]
})
export class QuestionableComponent {

    private dialogRef: MdDialogRef<any>;

    @Input()
    public answer: string;

    @Input()
    public title: string;

    @Input()
    public color: string = '#aaa';

    constructor(public dialog: MdDialog, public viewContainerRef: ViewContainerRef) { }

    private open() {
        let config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;

        this.dialogRef = this.dialog.open(QuestionableDialogComponent, config);
        this.dialogRef.componentInstance.title = this.title;
        this.dialogRef.componentInstance.answer = this.answer;
        this.dialogRef.afterClosed()
            .subscribe(result => {
                this.dialogRef = null;
            });
    }
}