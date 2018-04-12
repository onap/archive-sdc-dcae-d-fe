import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralComponent, groupingData } from './general.component';
import { sortBy } from 'lodash';

const data = [
  {
    name: 'avi',
    version: '2.0'
  },
  {
    name: 'stone',
    version: '0.9'
  },
  {
    name: 'avi',
    version: '2.1'
  },
  {
    name: 'vosk',
    version: '0.1'
  },
  {
    name: 'liav',
    version: '0.5'
  }
];
const sortedMatchVfcmtList = ['avi', 'liav', 'stone', 'vosk'];
const sortedVersionInGroup = [
  {
    name: 'avi',
    version: '2.1'
  },
  {
    name: 'avi',
    version: '2.0'
  }
];

describe('GeneralComponent', () => {
  it('should sort vfcmt by A to Z', () => {
    const sorted = groupingData(data);
    const vfcmtList = sortBy(Object.keys(sorted), name => name);
    expect(vfcmtList).toEqual(sortedMatchVfcmtList);
  });

  it('should group vfcmt by name', () => {
    const sorted = groupingData(data);
    expect(Object.keys(sorted)).toEqual(['avi', 'stone', 'vosk', 'liav']);
  });

  it('should version array be sorted in group', () => {
    const sorted = groupingData(data);
    expect(Object.values(sorted)[0]).toEqual(sortedVersionInGroup);
  });
});
