import { configure, addDecorator } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs/angular';

addDecorator(withKnobs);

const req = require.context('../src/stories', true, /.stories.ts$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
