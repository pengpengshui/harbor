/**
 * Created by pengf on 9/28/2017.
 */

import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from "@angular/core";
import {Project} from "../../../project/project";
@Component ({
    selector: 'select-project-name',
    templateUrl: 'project-name-list.html'
})

export class ProjectNameListComponent implements  OnChanges, OnInit {
    ismodelOpen: boolean = false;
    projectNameList: (any)[]  = [];

    @Input() projectList: Project[];
    @Output() checkedNameList = new EventEmitter<(string | number)[]>();

    constructor() { }

    public get isValid (): boolean {
        return this.projectNameList.find(data => data[2].toString() === 'true');
    }

    ngOnChanges(): void {
        if (this.projectList.length) {
            this.projectList.forEach(data => {
                // {'name': data.name}, {'id': data.project_id}, {'checked': false}
                this.projectNameList.push([ data.name, data.project_id, false]);
            });
        }
    }
    ngOnInit(): void {

    }

    submitCheckedName(): void {
       let projectNameChecked: any = this.projectNameList.filter(data => data[2].toString() === 'true');
       this.checkedNameList.emit(projectNameChecked);
       this.ismodelOpen = false;
        //console.log('最终选择的projectName：', projectNameChecked);
    }

    openModel(): void {
        this.ismodelOpen = true;
    }

    clearCheckedData(): void {
        this.projectNameList.forEach(data => {
            // {'name': data.name}, {'id': data.project_id}, {'checked': false}
            data[2] = false;
        });
    }

    closeModel(): void {
        this.clearCheckedData();
        this.ismodelOpen = false;
    }
    // circulateData()
}
