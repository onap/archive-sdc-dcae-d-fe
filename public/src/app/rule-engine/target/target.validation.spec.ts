import { TreeModel } from 'angular-tree-component';
import { fuzzysearch, getBranchRequierds, validation } from './target.util';

export const _nodes = [
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
          {
            id: 111,
            name: 'New York'
          },
          {
            id: 112,
            name: 'California'
          },
          {
            id: 113,
            name: 'Florida'
          }
        ]
      },
      {
        id: 12,
        name: 'Canada'
      }
    ]
  },
  {
    name: 'South America',
    children: [
      {
        name: 'Argentina',
        children: []
      },
      {
        name: 'Brazil'
      }
    ]
  },
  {
    name: 'Europe',
    children: [
      {
        name: 'England'
      },
      {
        name: 'Germany'
      },
      {
        name: 'France'
      },
      {
        name: 'Italy'
      },
      {
        name: 'Spain'
      }
    ]
  }
];

export const tree = new TreeModel();

describe('treeTest', () => {
  beforeAll(() => {
    tree.setData({ nodes: _nodes, options: null, events: null });
  });

  it('should return node branch requireds toBeGreaterThan 1', () => {
    const selectedNode = tree.getNodeBy(
      node => node.data.name === 'California'
    );
    const result = getBranchRequierds(selectedNode, []);
    const expected = [['New York', 'Florida'], ['United States']];

    expect(result.length).toBeGreaterThan(1);
  });

  it('should return node branch requireds', () => {
    const selectedNode = tree.getNodeBy(
      node => node.data.name === 'California'
    );
    const result = getBranchRequierds(selectedNode, []);
    const expected = [['New York', 'Florida'], ['United States']];
    expect(result).toEqual(expected);
  });

  it('should return empty array - success state', () => {
    const userSelect = ['Florida', 'New York', 'United States'];
    const selectedNode = tree.getNodeBy(node => node.data.name === 'New York');
    const result = validation(selectedNode, userSelect);
    expect(result).toEqual([]);
  });
  it('should return empty array - success state lenght zero', () => {
    const userSelect = ['Florida', 'New York', 'United States'];
    const selectedNode = tree.getNodeBy(node => node.data.name === 'New York');
    const result = validation(selectedNode, userSelect);

    expect(result.length).toEqual(0);
  });

  it('should return validation array - missing required filed', () => {
    const userSelect = ['New York'];
    const selectedNode = tree.getNodeBy(node => node.data.name === 'New York');
    const result = validation(selectedNode, userSelect);
    const expected = ['Florida', 'United States'];

    expect(result).toEqual(expected);
  });

  it('fuzzysearch find match one char', () => {
    const search = fuzzysearch('1', '1');
    expect(search).toBe(true);
  });

  it('fuzzysearch find match string', () => {
    const search = fuzzysearch('liav', 'liavEzar');
    expect(search).toBe(true);
  });

  it('fuzzysearch not find match', () => {
    const search = fuzzysearch('1', '2');
    expect(search).toBe(false);
  });

  it('fuzzysearch not find match', () => {
    const search = fuzzysearch('liavEzar', 'liav');
    expect(search).toBe(false);
  });

  it('fuzzysearch not find match', () => {
    const search = fuzzysearch('var', 'r2f44');
    expect(search).toBe(false);
  });
});
