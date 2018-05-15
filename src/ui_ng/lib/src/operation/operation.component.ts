import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {OperationService} from "./operation.service";
import {Subscription} from "rxjs/Subscription";
import {OperateInfo, OperationState} from "./operate";
import {SlideInOutAnimation} from "../_animations/slide-in-out.animation";


@Component({
  selector: 'hbr-operation-model',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.css'],
  animations: [SlideInOutAnimation],
})
export class OperationComponent implements OnInit, OnDestroy {
  batchInfoSubscription: Subscription;
  resultLists: OperateInfo[] = [];
  animationState = "out";

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    // storage to localStorage
    let timp = new Date().getTime();
    localStorage.setItem('operaion', JSON.stringify({timp: timp,  data: this.resultLists}));
  }

  constructor(
    private operationService: OperationService) {

    this.batchInfoSubscription = operationService.operationInfo$.subscribe(data => {
      // this.resultLists = data;
      this.openSlide();
      if (data) {
        if (this.resultLists.length >= 50) {
          this.resultLists.splice(49, this.resultLists.length - 49);
        }
        this.resultLists.unshift(data);
      }
    });
  }

  public get runningLists(): OperateInfo[] {
    let runningList: OperateInfo[] = [];
    this.resultLists.forEach(data => {
      if (data.state === 'progressing') {
        runningList.push(data);
      }
    });
    return runningList;
  }

  public get failLists(): OperateInfo[] {
    let failedList: OperateInfo[] = [];
    this.resultLists.forEach(data => {
      if (data.state === 'failure') {
        failedList.push(data);
      }
    });
    return failedList;
  }

  ngOnInit() {
    let requestCookie = localStorage.getItem('operaion');
    if (requestCookie) {
      let operInfors: any = JSON.parse(requestCookie);
      if (operInfors) {
        if ((new Date().getTime() - operInfors.timp) > 1000 * 60 * 60 * 24) {
          localStorage.removeItem('operaion');
        }else {
          if (operInfors.data) {
            operInfors.data.forEach(operInfo => {
              if (operInfo.state === OperationState.progressing) {
                operInfo.state = OperationState.interrupt;
                operInfo.data.errorInf = 'operation been interrupted';
              }
            });
            this.resultLists = operInfors.data;
          }
        }
      }

    }
  }
  ngOnDestroy(): void {
    if (this.batchInfoSubscription) {
      this.batchInfoSubscription.unsubscribe();
    }
  }

  toggleTitle(errorSpan: any) {
    errorSpan.style.display = (errorSpan.style.display === 'none') ? 'block' : 'none';
  }

  slideOut(): void {
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
    console.log(this.animationState);
  }

  openSlide(): void {
    this.animationState = 'in';
  }


  TabEvent(): void {
    let timp: any;
    this.resultLists.forEach(data => {
       timp = new Date().getTime() - +data.timeStamp;
       data.timeDiff = this.calculateTime(timp);
    });
  }

  calculateTime(timp: number) {
    let dist = Math.floor(timp / 1000 / 60);  // change to minute;
    if (dist > 0 && dist < 60) {
      return Math.floor(dist) + ' minutes ago';
    }else if (dist > 60 && Math.floor(dist / 60) < 24) {
      return Math.floor(dist / 60) + ' hour ago';
    } else if (Math.floor(dist / 60) > 24)  {
      return Math.floor(dist / 60 / 24) + ' day ago';
    } else {
      return 'less 1 minute';
    }

  }
}
