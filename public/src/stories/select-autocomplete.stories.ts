import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { boolean, text, array } from '@storybook/addon-knobs/angular';
import { NgSelectModule } from '@ng-select/ng-select';

storiesOf('select-autocomplete', module).add('select', () => ({
  template: `
    <ng-select [items]="cities"
                bindLabel="name"
                bindValue="id"
                placeholder="Select city"
                [(ngModel)]="selectedCityId">
        </ng-select>
    `,
  props: {
    cities: array('cities', [
      { id: 1, name: 'Vilnius' },
      { id: 2, name: 'Kaunas' },
      { id: 3, name: 'Pabradė' }
    ])
  },
  moduleMetadata: {
    imports: [NgSelectModule]
  }
}));
