
import {FilterComponent} from "./filter/filter.component";
import {ProjectNameListComponent} from "./projectNameList/project-name-list.component";
import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {ReplicationRuleComponent} from "./replication-rule.component";

/**
 * Created by pengf on 10/10/2017.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [
        FilterComponent,
        ReplicationRuleComponent,
        ProjectNameListComponent
    ],
    exports: [
        FilterComponent,
        ReplicationRuleComponent,
        ProjectNameListComponent
    ],
    providers: []
})
export class RepolicationRuleModule { }