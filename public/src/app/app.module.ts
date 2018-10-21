import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MobxAngularModule } from 'mobx-angular';

import {
  TabViewModule,
  DialogModule,
  TooltipModule,
  RadioButtonModule
} from 'primeng/primeng';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PapaParseModule } from 'ngx-papaparse';
// import {SdcUiComponentsModule} from 'sdc-ui/lib/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { GeneralComponent } from './general/general.component';
import { MainComponent } from './main/main.component';
import { RuleFrameComponent } from './rule-frame/rule-frame.component';

import { HostService } from './host/host.service';
import { RestApiService } from './api/rest-api.service';
import { FeatherIconsPipe } from './api/feather-pipe';
import { Store } from './store/store';
import { LoaderComponent } from './loader/loader.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

// rule engine
import { TreeModule } from 'angular-tree-component';
import { TargetComponent } from './rule-engine/target/target.component';
import { VersionTypeSelectComponent } from './rule-engine/version-type-select/version-type-select.component';
import { FromComponent } from './rule-engine/from/from.component';
import { ActionComponent } from './rule-engine/action/action.component';
import { ActionListComponent } from './rule-engine/action-list/action-list.component';
import { ConditionComponent } from './rule-engine/condition/condition.component';
import { RuleEngineApiService } from './rule-engine/api/rule-engine-api.service';
import { ConfirmPopupComponent } from './rule-engine/confirm-popup/confirm-popup.component';
import { SlidePanelComponent } from './rule-engine/slide-panel/slide-panel.component';
import { RuleListComponent } from './rule-engine/rule-list/rule-list.component';
import { BarIconsComponent } from './bar-icons/bar-icons.component';
import { DiagramComponent } from './diagram/diagram.component';
import { SdcNotifyDialogComponent } from './sdc-notify-dialog/sdc-notify-dialog.component';
import { RevertDialogComponent } from './revert-dialog/revert-dialog.component';
import { ImportRulesComponent } from './import-rules/import-rules.component';

const appInitializerFn = () => {
  return () => {
    console.log('app initializing');
  };
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GeneralComponent,
    MainComponent,
    RuleFrameComponent,
    LoaderComponent,
    FeatherIconsPipe,
    ErrorDialogComponent,
    TargetComponent,
    VersionTypeSelectComponent,
    FromComponent,
    ActionComponent,
    ActionListComponent,
    ConditionComponent,
    ConfirmPopupComponent,
    SlidePanelComponent,
    RuleListComponent,
    BarIconsComponent,
    DiagramComponent,
    SdcNotifyDialogComponent,
    RevertDialogComponent,
    ImportRulesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    MobxAngularModule,
    TabViewModule,
    DialogModule,
    RadioButtonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TreeModule,
    NgSelectModule,
    TooltipModule,
    PapaParseModule,
    ToastrModule.forRoot({ enableHtml: true }),
    NgxDatatableModule
  ],
  entryComponents: [ConfirmPopupComponent],
  providers: [
    HostService,
    RestApiService,
    RuleEngineApiService,
    Store,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: []
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
