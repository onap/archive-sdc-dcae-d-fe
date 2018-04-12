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
      { source: 'node1dsvsdsvd', target: 'node2' },
      { source: 'node3', target: 'node4' },
      { source: 'node5', target: 'nodedsvsds6' },
      { source: 'node7', target: 'node8' }
    ])
  }
}));
