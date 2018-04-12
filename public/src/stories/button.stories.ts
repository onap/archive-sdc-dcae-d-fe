import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs/angular';
import { MatButtonModule, MatIconModule } from '@angular/material';

storiesOf('Button', module)
  .add('Basic', () => ({
    template: `
    <div style="margin:2em;">
      <button mat-raised-button color="primary" (click)="onClick($event)">primary</button>
      <button mat-raised-button color="primary" [disabled]="disabled">disabled</button>
      <button mat-raised-button class="btn-secondry"> {{ btnText }} </button>
    </div>
    `,
    props: {
      disabled: boolean('disabled', true),
      btnText: text('btnText', 'secondry'),
      onClick: action('click')
    },
    moduleMetadata: {
      imports: [MatButtonModule]
    }
  }))
  .add('Round', () => ({
    template: `
    <button mat-mini-fab style="background-color:#009FDB">
      <mat-icon class="material-icons">add</mat-icon>
    </button>
  `,
    moduleMetadata: {
      imports: [MatButtonModule, MatIconModule]
    }
  }));
