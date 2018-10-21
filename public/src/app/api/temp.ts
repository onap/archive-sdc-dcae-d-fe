// import { chain, groupBy } from 'lodash';
import { groupBy, prop, compose, values } from 'ramda';

const arr = [
  {
    groupId: 'map0',
    groupName: 'rony'
  },
  {
    groupId: 'enrich0',
    groupName: 'stone'
  },
  {
    groupId: 'map0',
    groupName: 'vosk'
  },
  {
    groupId: 'enrich1',
    groupName: 'liav'
  }
];

const fn = compose(values, groupBy(prop('groupId')))(arr);
const dis = fn.map(item => {
  return { groupId: item[0].groupId, rulesList: item };
});
console.log(fn);
console.log(dis);
// console.log(groupBy(prop('groupId'))(arr));
