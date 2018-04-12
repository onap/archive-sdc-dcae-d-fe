import { storiesOf } from '@storybook/angular';
import { TreeModule } from 'angular-tree-component';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TargetComponent } from '../app/rule-engine/target/target.component';

storiesOf('Target', module).add('target component', () => ({
  component: TargetComponent,
  moduleMetadata: {
    imports: [
      TreeModule,
      MatButtonModule,
      MatIconModule,
      BrowserAnimationsModule
    ]
  },
  props: {
    nodes: [
      {
        name: 'commonEventHeader',
        children: [
          {
            name: 'domain',
            children: null,
            isRequired: true,
            requiredChildren: null,
            id: 'event.commonEventHeader.domain'
          },
          {
            name: 'eventId',
            children: null,
            isRequired: true,
            requiredChildren: null,
            id: 'event.commonEventHeader.eventId'
          }
        ]
      }
    ]
  }
}));
