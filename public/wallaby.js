var wallabyWebpack = require('wallaby-webpack');
var path = require('path');

var compilerOptions = Object.assign(
  require('./tsconfig.json').compilerOptions,
  require('./src/tsconfig.spec.json').compilerOptions
);

compilerOptions.module = 'CommonJs';

module.exports = function(wallaby) {
  var webpackPostprocessor = wallabyWebpack({
    entryPatterns: ['src/wallabyTest.js', 'src/**/*spec.js'],

    module: {
      rules: [
        { test: /\.css$/, loader: ['raw-loader', 'css-loader'] },
        { test: /\.html$/, loader: 'raw-loader' },
        {
          test: /\.ts$/,
          loader: '@ngtools/webpack',
          include: /node_modules/,
          query: { tsConfigPath: 'tsconfig.json' }
        },
        {
          test: /\.js$/,
          loader: 'angular2-template-loader',
          exclude: /node_modules/
        },
        { test: /\.json$/, loader: 'json-loader' },
        { test: /\.styl$/, loaders: ['raw-loader', 'stylus-loader'] },
        { test: /\.less$/, loaders: ['raw-loader', 'less-loader'] },
        { test: /\.scss$|\.sass$/, loaders: ['raw-loader', 'sass-loader'] },
        { test: /\.(jpg|png)$/, loader: 'url-loader?limit=128000' }
      ]
    },

    resolve: {
      extensions: ['.js', '.ts'],
      modules: [
        path.join(wallaby.projectCacheDir, 'src/app'),
        path.join(wallaby.projectCacheDir, 'src'),
        'node_modules'
      ]
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      dns: 'empty'
    }
  });

  return {
    files: [
      'src/setupJest.ts',
      'src/**/*.ts',
      '!src/**/*.spec.ts',
      '!src/**/*.d.ts',
      'src/**/*.json'
    ],

    tests: ['src/**/*.spec.ts'],

    testFramework: 'jest',

    compilers: {
      '**/*.ts': wallaby.compilers.typeScript(compilerOptions)
    },

    env: {
      type: 'node',
      runner: 'node',
      kind: 'chrome'
    },

    setup: function(wallaby) {
      //Use the configured jest file for testing
      const jestConfig = {
        mapCoverage: true,
        globals: {
          __TS_CONFIG__: {
            target: 'es6',
            module: 'commonjs',
            moduleResolution: 'node'
          },
          'ts-jest': {
            tsConfigFile: 'src/tsconfig.spec.json'
          },
          __TRANSFORM_HTML__: true
        },
        testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|js)$',
        setupTestFrameworkScriptFile: '<rootDir>/src/setupJest.ts',
        transform: {
          '^.+\\.(ts|html)$':
            '<rootDir>/node_modules/jest-preset-angular/preprocessor.js'
        },
        transformIgnorePatterns: ['node_modules/(?!@ngrx)'],
        collectCoverageFrom: [
          'src/app/module/**/*.{ts}',
          '!src/app/*.{ts}',
          '!src/app/**/*.{js}',
          '!src/app/environment/*.{ts}',
          '!src/app/language/*.{ts}',
          '!src/app/**/*.module.{ts}',
          '!src/app/**/*.interface.{ts}',
          '!src/app/**/*.state.{ts}',
          '!src/app/**/*.entity.{ts}'
        ],
        moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
        testPathIgnorePatterns: ['/node_modules/', '/dist/', 'src/app/*.{js}'],
        testResultsProcessor: 'jest-sonar-reporter',
        moduleNameMapper: {
          'app/(.*)': '<rootDir>/src/app/$1',
          '@common/(.*)': '<rootDir>/src/app/common/$1'
        }
      };
      wallaby.testFramework.configure(jestConfig);
    },

    debug: true
  };
};
