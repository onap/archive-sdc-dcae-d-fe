import {
  Component,
  Inject,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';
// import { Copy } from "../model";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
// import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';
import { NgForm } from '@angular/forms';
import * as Papa from 'papaparse';
import { metricData } from './metric.data';
import { Store } from '../../store/store';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit, AfterViewInit {
  @Input() action;
  @ViewChild('from') fromInstance;
  @ViewChild('target') targetInstance;
  @ViewChild('actionFrm') actionFrm: NgForm;
  highlight = 'black';
  hoveredIndex;
  fileToUpload: File = null;
  fileName = '';
  metrics = metricData;
  changeStyle($event) {
    this.highlight = $event.type === 'mouseover' ? 'highlight' : 'black';
  }
  ngOnInit(): void {}
  constructor(public store: Store, private toastr: ToastrService) {}

  ngAfterViewInit(): void {
    console.log(this.action.id);
    if (this.action.from !== undefined && this.action.from !== '') {
      console.log('Action %o', this.action);
      this.fromInstance.updateMode(this.action.from);
    }
    if (this.action.target !== undefined && this.action.target !== '') {
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

  removeSearchField(index) {
    this.action.search.enrich.fields.splice(index, 1);
  }

  addSearchFeild() {
    this.action.search.enrich.fields.push({ value: '' });
  }

  searchRadioChange(radioType) {
    console.log(radioType);
    this.action.search.radio = radioType;
    console.log(this.action.search);
  }

  metricChange(metric) {
    console.log('metric change:', metric);
  }

  changeCheckbox() {
    console.log(this.action.id);
    return (this.action.map.haveDefault = !this.action.map.haveDefault);
  }
  addSearchUpdateRow() {
    this.action.search.updates.push({ key: '', value: '' });
  }
  removeSearchUpdatesRow(index) {
    this.action.search.updates.splice(index, 1);
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log('file to load:', this.fileToUpload);
    this.fileName = this.fileToUpload !== null ? this.fileToUpload.name : '';

    this.store.loader = true;
    Papa.parse(this.fileToUpload, {
      complete: result => {
        if (result.data) {
          const mapConvert = result.data
            .slice(0, 300)
            .filter(item => item[0] !== undefined && item[1] !== undefined)
            .map(item => {
              console.log(`item 0: ${item[0]} item 1: ${item[1]}`);
              return {
                key: item[0].trim(),
                value: item[1].trim()
              };
            });
          this.store.loader = false;
          this.action.map.values = mapConvert;
        }
      },
      error: (err, file) => {
        this.store.loader = false;
        console.log(`error: ${err}, in file ${file}`);
        this.toastr.error('', err);
      }
    });
  }
}
