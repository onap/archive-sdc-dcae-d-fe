import * as Papa from 'papaparse';

describe('parse CSV to JSON', () => {
  it('should have only 2 attribute key and value', () => {
    const stringAsCSV = 'liav,GL';
    Papa.parse(stringAsCSV, {
      complete: result => {
        if (result.data) {
          const parser = result.data
            .slice(0, 300)
            .filter(item => item[0] !== undefined && item[1] !== undefined)
            .map(item => {
              return {
                key: item[0].trim(),
                value: item[1].trim()
              };
            });
          expect(parser).toEqual([
            {
              key: 'liav',
              value: 'GL'
            }
          ]);
        }
      }
    });
  });

  it('should have 2 attribute ignore 1', () => {
    const stringAsCSV = 'liav,GL,DCAE';
    Papa.parse(stringAsCSV, {
      complete: result => {
        if (result.data) {
          const parser = result.data
            .slice(0, 300)
            .filter(item => item[0] !== undefined && item[1] !== undefined)
            .map(item => {
              return {
                key: item[0].trim(),
                value: item[1].trim()
              };
            });
          expect(parser).toEqual([
            {
              key: 'liav',
              value: 'GL'
            }
          ]);
        }
      }
    });
  });

  it('should have 4 attribute', () => {
    const stringAsCSV = `liav,GL
                          Vosk,Dev`;

    Papa.parse(stringAsCSV, {
      complete: result => {
        if (result.data) {
          const parser = result.data
            .slice(0, 300)
            .filter(item => item[0] !== undefined && item[1] !== undefined)
            .map(item => {
              return {
                key: item[0].trim(),
                value: item[1].trim()
              };
            });
          expect(parser).toEqual([
            {
              key: 'liav',
              value: 'GL'
            },
            {
              key: 'Vosk',
              value: 'Dev'
            }
          ]);
        }
      }
    });
  });
});
