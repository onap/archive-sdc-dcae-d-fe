import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Store } from '../store/store';
import { RuleEngineApiService } from '../rule-engine/api/rule-engine-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-import-rules',
  templateUrl: './import-rules.component.html',
  styleUrls: ['./import-rules.component.scss']
})
export class ImportRulesComponent {
  fileToUpload: File = null;
  fileName = '';
  mappingTarget: string;
  tabName: string;
  isGroup = false;
  @Output() refrashRuleList = new EventEmitter();
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    public _ruleApi: RuleEngineApiService,
    private toastr: ToastrService,
    public store: Store
  ) {
    this._ruleApi.tabIndex
      // .filter(index => {   if (index >= 0) {     const tabName =
      // this.store.cdump.nodes[index].name;     console.log('tab name:', tabName); if
      // (tabName.toLowerCase().includes('map')) {       return index;     }   } })
      .subscribe(index => {
        if (index >= 0) {
          this.tabName = this.store.cdump.nodes[index].name;
          console.log('tab name:', this.tabName);
          if (
            this.tabName.toLowerCase().includes('map') ||
            this.tabName.toLowerCase().includes('highlandpark') ||
            this.tabName.toLowerCase().includes('hp')
          ) {
            this.store.advancedSetting = this.store.tabsProperties[
              index
            ].filter(item => {
              if (
                !(
                  item.hasOwnProperty('constraints') &&
                  item.value !== undefined &&
                  !item.value.includes('get_input')
                )
              ) {
                return item;
              }
            });
            this.mappingTarget = this.store.advancedSetting[0].name;

            this._ruleApi.setParams({
              userId: this.store.sdcParmas.userId,
              nodeName: this.store.tabParmasForRule[0].name,
              nodeId: this.store.tabParmasForRule[0].nid,
              vfcmtUuid: this.store.mcUuid,
              fieldName: this.mappingTarget,
              flowType: this.store.cdump.flowType
            });

            this._ruleApi
              .generateMappingRulesFileName(
                this.store.tabParmasForRule[0].name,
                this.store.tabParmasForRule[0].nid,
                this.store.mcUuid
              )
              .subscribe(response => {
                console.log(
                  'generateMappingRulesFileName response: ',
                  response
                );
                this.store.advancedSetting.forEach(element => {
                  if (response.includes(element.name)) {
                    element.isExist = true;
                  } else {
                    element.isExist = false;
                  }
                });
              });
            console.log('advancedSetting', this.store.advancedSetting);
          }
        }
      });
  }

  onChangeMapping(configurationKey) {
    console.log('changing propertiy key:', configurationKey);
    this._ruleApi.setFieldName(configurationKey);
    this.refrashRuleList.next();
  }

  private notifyError(error: any) {
    this.store.loader = false;
    console.log(error.notes);
    this.store.ErrorContent = Object.values(error.requestError);
    this.store.displayErrorDialog = true;
  }

  handleFileInput(files: FileList) {
    const reader = new FileReader();
    if (files && files.length > 0) {
      this.store.loader = true;
      this.fileToUpload = files.item(0);
      console.log('file to load:', this.fileToUpload);
      this.fileName = this.fileToUpload !== null ? this.fileToUpload.name : '';
      reader.readAsText(this.fileToUpload, 'UTF-8');
      reader.onload = () => {
        console.log(reader.result);
        this._ruleApi
          .getLatestMcUuid({
            contextType: this.store.sdcParmas.contextType,
            serviceUuid: this.store.sdcParmas.uuid,
            vfiName: this.store.vfiName,
            vfcmtUuid: this.store.mcUuid
          })
          .subscribe(
            res => {
              this.store.mcUuid = res.uuid;
              if (
                this.tabName.toLowerCase().includes('highlandpark') ||
                this.tabName.toLowerCase().includes('hp')
              ) {
                this.isGroup = true;
              }
              this._ruleApi
                .importRules(reader.result, res.uuid, this.isGroup)
                .subscribe(
                  response => {
                    console.log('success import', response);
                    this.toastr.success('', 'success import');
                    this.store.expandImports[this.store.tabIndex] = false;
                    this.clearFile();
                    this.store.loader = false;
                    this._ruleApi.callUpdateTabIndex(this.store.tabIndex);
                  },
                  error => {
                    this.notifyError(error);
                    this.clearFile();
                  }
                );
            },
            error => {
              this.notifyError(error);
              this.clearFile();
            }
          );
      };
    } else {
      this.clearFile();
    }
  }

  clearFile() {
    this.fileInput.nativeElement.value = '';
    this.fileName = '';
  }
}
