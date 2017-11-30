import {Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef} from '@angular/core';
import {ProjectService} from '../../project/project.service';
import {Project} from '../../project/project';
import {ProjectNameListComponent} from './projectNameList/project-name-list.component';
import {Endpoint, EndpointService} from 'harbor-ui';
import {toPromise} from 'harbor-ui/src/utils';
import {FilterComponent} from './filter/filter.component';
import {Router} from '@angular/router';
/**
 * Created by pengf on 9/28/2017.
 */

/*const enum scheduleFilter {On push, Daily, Weekly}*/
/*const enum Weekly {Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday}*/
export interface NewReplicationRule  {
    name?: string;
    description?: string;
    projects?: number[];
    filter?: {[key: string]: string}[] ;
   /* repository?: string;
    tag?: string;*/
    endpointId?: number | string;
    endpointName?: string;
    endpointUrl?: string;
    username?: string;
    password?: string;
    useSameName?: boolean;
    /*schedule?: {[key: string]: string};*/
    scheduleType?: string;
    scheduleDay?: string;
    scheduleTime?: string;
    replicateUsers?: boolean;
    enable?: boolean;
    deleteRemote?: boolean;
}

@Component ({
    selector: 'repliction-rule',
    templateUrl: 'replication-rule.html',
    styleUrls: ['replication-rule.css']

})
export class ReplicationRuleComponent implements OnInit, OnDestroy {
    timerHandler: any;
    // projectNameList: string[] = [];
    projectList: Project[] = [];
    urlLists: Endpoint[] = [];
    selectedId: number[] = [];
    selectedNames: string[] = [];
    isRepoHide: boolean = false;
    isTagHide: boolean = true;
    isFilterHide: boolean = false;
    dailySchedule: boolean = true;
    weeklySchedule: boolean = true;
    filterNames: string[] = [];
    filterCount: number = 0;
    scheduleNames: string[] = ['On push', 'Daily', 'Weekly']
    weekly: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    filterSelect: string[] = ['Repository1', 'Tag1', 'Rep1', 'Yel'];
    newRule: NewReplicationRule = this.initReplicationRule;

    filterListData: {[key: string]: any}[] = [];

    @ViewChild(ProjectNameListComponent)
    projectNameCom: ProjectNameListComponent;

    @ViewChild(FilterComponent) filterComponent: FilterComponent;
    constructor(public projectService: ProjectService,
                private router: Router,
                public endpointService: EndpointService,
                public ref: ChangeDetectorRef) {
        this.getFilterLists();
    }

     selectedOPt(name: string) {
        return this.selectedNames.indexOf(name) > 0 ? true : false;
    }

    ngOnInit(): void {
        this.projectService.listProjects('', undefined)
            .subscribe(response => {
                this.projectList = response.json();
            }
        );
        toPromise<Endpoint[]>( this.endpointService.getEndpoints())
            .then(response => {
                this.urlLists = response;
            });
    }

    ngOnDestroy(): void {
        this.selectedNames = [] ;
        this.selectedId = [] ;
    }

    // create filter data via filter key words
    getFilterLists(): void {
        for (let i = 0; i < this.filterSelect.length; i++) {
            this.filterListData.push({'id': i, 'name': this.filterSelect[i], 'options': this.filterSelect.slice(), 'state': false});
        }
    }

    get initReplicationRule(): NewReplicationRule {
        return {
            name: '',
            description: '',
            projects: [],
            filter: [],
            endpointId: '',
            endpointName: '',
            endpointUrl: '',
            username: '',
            password: '',
            useSameName: true,
            scheduleType: 'On push',
            scheduleDay: 'Monday',
            scheduleTime: '08:00',
            replicateUsers: true,
            enable: true,
            deleteRemote: true,
        };
    }

    openProjectNameList(): void {
        this.projectNameCom.openModel();
    }

    CheckedProjectNameList($event: (string | number)[]): void {
        // {'name': data.name}, {'id': data.project_id}, {'checked': false}
        if ($event && $event.length) {
            this.selectedNames = [];
            this.selectedId = [];
            $event.forEach(data => {
                this.selectedNames.push(data[0]);
                this.selectedId.push(data[1]);
            });
        }
    }

    // get more project  name
    selectEndpoint($event: any, selectedPro: any): void {
        if ($event && $event.target && $event.target['value']) {
/*            this.selectedNames = [] ;
            this.selectedId = [] ;*/
            let value: string = $event.target['value'];
            let id = +$event.target['selectedOptions'].item(0).id;
            if (value === 'more') {
                // this.projectNameCom.clearCheckedData();
                this.projectNameCom.openModel();
            }else {
                if (this.selectedNames.indexOf(value) < 0) {
                    this.selectedNames.push(value);
                    this.selectedId.push(id);
                    selectedPro.selectedOptions[0].className = 'optionMore';
                }else {
                    this.selectedNames.splice(this.selectedNames.indexOf(value), 1);
                    this.selectedId.splice(this.selectedNames.indexOf('' + id), 1);
                    selectedPro.selectedOptions[0].className = '';
                }
            }
        }
    }

    // first add, should show repo fitler
    addNewFilter(): void {
        this.filterCount += 1;
        let selectedFilter = this.filterListData.find(data => data.state === false);
        selectedFilter.state = true;
        selectedFilter.name = selectedFilter.options[0];

        if (this.filterCount >= this.filterListData.length) {
            this.isFilterHide = true;
        }

        // when add a new filter,the filterListData should change the options
        this.filterListData.filter(data => {
            if (selectedFilter.id !== data.id) {
                data.options.splice(data.options.indexOf(selectedFilter.options[0]), 1);
            }
        });
        console.log('fistdata:', this.filterListData);
        // this.forceRefreshView(500);
    }


    trackByFn(index: number, filters: {[key: string]: any}) {
        return filters.state;
    }

    filterInput(name: string, value: string): void {
        this.newRule.filter.push({[name]: value});
    }

    // delete a filter
    deleteFilter($event: any): void {
        if ($event.toString() !== 'undefined') {
            let delfilter = this.filterListData.find(data => data.id === +$event);
            delfilter.state = false;
            if (this.filterCount === 0 || this.filterCount === this.filterSelect.length) {
                this.isFilterHide = false;
            }
            this.filterCount -= 1;

            let optionVal = delfilter.name;
            this.filterListData.filter(data => {
                if (data.options.indexOf(optionVal) === -1) {
                    data.options.push(optionVal);
                }
            });
        }
        // this.forceRefreshView(500);
    }

    // get filter input data collection
    getNewFilter($event: {[key: string]: any}) {
        console.log('get new filer data collection:', $event);
    }

    closeFilterRepo(): void {
        /*if (this.newRule.filter.length && this.newRule.filter[repository]) {

        }*/
        this.isRepoHide = true;
    }



    // Replication Schedule select exchange
    selectSchedule($event: any): void {
        if ($event && $event.target && $event.target['value']) {
            switch ($event.target['value']) {
                case this.scheduleNames[1]:
                    this.dailySchedule = false;
                    this.weeklySchedule = true;
                    break;
                case this.scheduleNames[2]:
                    this.dailySchedule = false;
                    this.weeklySchedule = false;
                    break;
                default:
                    this.dailySchedule = true;
                    this.weeklySchedule = true;
                }
        }

    }

    onSubmit(): void {
        this.newRule.projects = this.selectedId;
        console.log(this.selectedId);
        console.log(this.newRule);
    }

    onCancel(): void {
        this.newRule = this.initReplicationRule;
    }

    backReplication(): void {
        this.router.navigate(['/harbor/replications']);
    }

    // Forcely refresh the view
    forceRefreshView(duration: number): void {
        // Reset timer
        if (this.timerHandler) {
            clearInterval(this.timerHandler);
        }
        this.timerHandler = setInterval(() => this.ref.markForCheck(), 100);
        setTimeout(() => {
            if (this.timerHandler) {
                clearInterval(this.timerHandler);
                this.timerHandler = null;
            }
        }, duration);
    }
}
