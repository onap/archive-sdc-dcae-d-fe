import { TestBed, async } from '@angular/core/testing';
import { TreeModel, TreeComponent, ITreeOptions } from 'angular-tree-component';
import { validation, getBranchRequierds } from './target.util';

const _nodes = [
  {
    id: 1,
    name: 'North America',
    requiredChildren: ['United States'],
    children: [
      {
        id: 11,
        name: 'United States',
        requiredChildren: ['New York', 'Florida'],
        children: [
          { id: 111, name: 'New York' },
          { id: 112, name: 'California' },
          { id: 113, name: 'Florida' }
        ]
      },
      { id: 12, name: 'Canada' }
    ]
  },
  {
    name: 'South America',
    children: [{ name: 'Argentina', children: [] }, { name: 'Brazil' }]
  },
  {
    name: 'Europe',
    children: [
      { name: 'England' },
      { name: 'Germany' },
      { name: 'France' },
      { name: 'Italy' },
      { name: 'Spain' }
    ]
  }
];

const tree = new TreeModel();

describe('treeTest', () => {
  beforeAll(() => {
    tree.setData({
      nodes: _nodes,
      options: null,
      events: null
    });
  });

  it('should return node branch requireds', () => {
    // console.log('root', tree.getFirstRoot().data.name);
    // console.log(tree.getNodeBy((node) => node.data.name === 'California').data.uuid);
    // console.log(tree.getNodeBy((node) => node.data.name === 'California').id);
    // console.log(tree.getNodeById(1));
    const selectedNode = tree.getNodeBy(
      node => node.data.name === 'California'
    );
    const result = getBranchRequierds(selectedNode, []);
    const expected = [['New York', 'Florida'], ['United States']];

    expect(result.length).toBeGreaterThan(1);
    expect(result).toEqual(expected);
  });

  it('should return empty array - success state', () => {
    const userSelect = ['Florida', 'New York', 'United States'];
    const selectedNode = tree.getNodeBy(node => node.data.name === 'New York');
    const result = validation(selectedNode, userSelect);

    expect(result.length).toEqual(0);
    expect(result).toEqual([]);
  });

  it('should return validation array - missing required filed', () => {
    const userSelect = ['New York'];
    const selectedNode = tree.getNodeBy(node => node.data.name === 'New York');
    const result = validation(selectedNode, userSelect);
    const expected = ['Florida', 'United States'];

    expect(result).toEqual(expected);
  });
});
