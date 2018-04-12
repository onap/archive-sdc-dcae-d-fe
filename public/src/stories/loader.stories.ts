import { storiesOf } from '@storybook/angular';
import { LoaderComponent } from '../app/loader/loader.component';

storiesOf('Loader', module).add('simple loader', () => ({
  component: LoaderComponent
}));
