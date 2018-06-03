import { storiesOf } from '@storybook/angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DiagramComponent } from '../app/diagram/diagram.component';
import { array } from '@storybook/addon-knobs/angular';

storiesOf('Diagram', module).add('simple', () => ({
  component: DiagramComponent,
  moduleMetadata: {
    imports: [],
    schemas: [NO_ERRORS_SCHEMA],
    declarations: [],
    providers: []
  },
  props: {
    list: array('list', [
      {
        name1: 'node1dsvsdsvd',
        name2: 'node2',
        p1: 'Stream_publish_0',
        p2: 'capability'
      },
      {
        name1: 'node33',
        name2: 'node2555',
        p1: 'requirement2',
        p2: 'capability11'
      },
      {
        name1: 'namber4',
        name2: 'namber3',
        p1: 'requirement3',
        p2: 'capability4'
      }
    ])
  }
}));
