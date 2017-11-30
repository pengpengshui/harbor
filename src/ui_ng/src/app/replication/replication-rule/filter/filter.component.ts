/**
 * Created by pengf on 10/10/2017.
 */

import {Component, EventEmitter, Input, Output, OnChanges, SimpleChange, SimpleChanges} from "@angular/core";

@Component ({
    selector: 'repo-filter',
    templateUrl: 'filter.html',
})

export class FilterComponent implements  OnChanges {
    // imageFilters: string[] = ['Repository', 'Tag'];

    @Input() selectLists: {[key: string]: any}[];
    @Input() selectIndex: number;
  /*  @Input() filterNames: string[];*/
    @Output() deleteFilter = new EventEmitter<any>();
    @Output() newFilters = new EventEmitter<{[key: string]: any}[]>();

    newfilter: {[key: string]: any}[] = [];
    ngOnChanges(changes: SimpleChanges): void {
        for (let propName in changes) {
            let chng = changes[propName];
            let cur  = JSON.stringify(chng.currentValue);
            let prev = JSON.stringify(chng.previousValue);
         //console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
        }

        /*this.selectLists.forEach(data => {
            console.log(data.options);
        })*/
    }
    constructor() { }

    filterInput(name: string, value?: string): void {
        this.newfilter.forEach(data => {
            if (data && data[name]) {
                data[name] = value;
            }else {
                this.newfilter.push({[name]: value});
            }
        });
        this.newFilters.emit(this.newfilter);
    }

    selectChange($event: any) {
        if ($event && $event.target['value']) {
            let id: number = $event.target.id;
            let name: string = $event.target.name;
            let value: string = $event.target['value'];

            this.selectLists.forEach(data => {
                if (data.id === +id) {
                   data.name = $event.target.name = value;
                }else {
                    data.options.splice(data.options.indexOf(value), 1);
                }
                if (data.options.indexOf(name) === -1) {
                    data.options.push(name);
                }
            })
        }
        console.log(this.selectLists);
    }

    deleteFilterRepo(delIndex: number): void {
        console.log('delIndex', delIndex);
        this.deleteFilter.emit(delIndex);
    }
}