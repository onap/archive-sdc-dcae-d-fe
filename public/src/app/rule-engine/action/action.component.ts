import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
// import { Copy } from "../model";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  @Input() action;
  @ViewChild('from') fromInstance;
  @ViewChild('target') targetInstance;
  @ViewChild('actionFrm') actionFrm: NgForm;
  highlight = 'black';
  hoveredIndex;
  changeStyle($event) {
    this.highlight = $event.type === 'mouseover' ? 'highlight' : 'black';
  }
  ngOnInit(): void {
    console.log(this.action.id);
    if (this.action.from !== '') {
      console.log('Action %o', this.action);
      this.fromInstance.updateMode(this.action.from);
    }
    if (this.action.target !== '') {
      this.targetInstance.updateMode(this.action);
    }
  }

  updateFrom(data) {
    this.action.from = data;
  }
  updateTarget(data) {
    this.action.selectedNode = data;
  }
  /* map functionality */
  addMapRow() {
    this.action.map.values.push({ key: '', value: '' });
  }
  removeMapRow(index) {
    this.action.map.values.splice(index, 1);
  }

  changeCheckbox() {
    console.log(this.action.id);
    return (this.action.map.haveDefault = !this.action.map.haveDefault);
  }
}
