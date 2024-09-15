## `@angular-buildx/webpack`

`@angular-buildx/webpack` is a custom Angular CLI builder that allows you to use custom Webpack configurations for the build, development server, and Karma tests. This package extends the default Angular CLI builders for added flexibility in your project setups.

#### Installation

To install the package, use npm or yarn:

```bash
npm install --save-dev @angular-buildx/webpack
# or
yarn add --dev @angular-buildx/webpack
# or
pnpm add -D @angular-buildx/webpack
```

#### Usage

To use this custom builder in your Angular project, you need to update the `angular.json` file to point to the custom builders for different targets (browser, dev-server, karma).

##### 1. **Browser Target**

For custom builds with Webpack, you can configure the browser build using the `@angular-buildx/webpack:browser` builder. You can specify a custom Webpack config file via the `webpack` option.

Example `angular.json` configuration:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-buildx/webpack:browser",
          "options": {
            "outputPath": "dist/my-app",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.css"],
            "scripts": [],
            "webpack": "./webpack.config.json"
          }
        }
      }
    }
  }
}
```

##### 2. **Dev Server Target**

For development servers with custom Webpack configurations, you can use the `@angular-buildx/webpack:dev-server` builder.

Example `angular.json` configuration:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "serve": {
          "builder": "@angular-buildx/webpack:dev-server",
          "options": {
            "browserTarget": "my-app:build",
            "webpack": "./webpack.config.json"
          }
        }
      }
    }
  }
}
```

##### 3. **Karma Target**

For running Karma tests with custom Webpack configurations, you can configure the test builder to use the `@angular-buildx/webpack:karma` builder.

Example `angular.json` configuration:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "test": {
          "builder": "@angular-buildx/webpack:karma",
          "options": {
            "main": "src/test.ts",
            "karmaConfig": "./karma.conf.js",
            "tsConfig": "tsconfig.spec.json",
            "webpack": "./webpack.config.json"
          }
        }
      }
    }
  }
}
```

#### Webpack Configuration

In each of the configurations above, you can specify the path to a custom Webpack configuration file using the `webpack` option. Here's an example `webpack.config.json` file:

```js
/**
 * @param {import('webpack').Configuration} config - The Webpack configuration object.
 * @param {import('@angular-devkit/architect').BuilderContext} context - The Angular builder context.
 */
module.exports = function (config, context) {
  // Modify the Webpack config as needed
  config.module.rules.push({
    test: /\.svg$/,
    use: "svg-url-loader",
  });

  // Optional for return except you change the config pointer variable with new custom your own webpack config
  return config;
};
```

#### Contribution and Support

For issues or feature requests, please file an issue on the [GitHub repository](https://github.com/bdxygy/angular-buildx-webpack).

#### License

This package is licensed under the MIT License.
