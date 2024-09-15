Here’s an example of how you can structure the npm documentation for your package `@angular-buildx/webpack` that extends Angular CLI builders with custom Webpack configurations:

---

# @angular-buildx/webpack

A custom builder for Angular projects that allows you to extend the Angular CLI build process with custom Webpack configurations.

## Installation

To use this builder, install it as a dev dependency in your Angular project:

```bash
npm install --save-dev @angular-buildx/webpack
```

## Usage

You can configure the custom builder by specifying the paths to your custom Webpack configuration files. This builder supports extending the `browser`, `dev-server`, and `karma` configurations used by Angular CLI.

### Example `angular.json` Configuration

Below is an example of how to configure the custom builders in your `angular.json` file.

```json
{
  "projects": {
    "your-angular-project": {
      "architect": {
        "build": {
          "builder": "@angular-buildx/webpack:browser",
          "options": {
            "outputPath": "dist/your-angular-project",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "webpack": "webpack.config.js"
          }
        },
        "serve": {
          "builder": "@angular-buildx/webpack:dev-server",
          "options": {
            "browserTarget": "your-angular-project:build",
            "webpack": "webpack.dev.config.js"
          }
        },
        "test": {
          "builder": "@angular-buildx/webpack:karma",
          "options": {
            "main": "src/test.ts",
            "karmaConfig": "karma.conf.js",
            "tsConfig": "tsconfig.spec.json",
            "webpack": "webpack.test.config.js"
          }
        }
      }
    }
  }
}
```

### Custom Webpack Configuration

You can provide custom Webpack configurations for different build targets (e.g., build, serve, and test). Here is an example of a custom Webpack configuration file (`webpack.config.js`):

```javascript
/**
 * @param {import('webpack').Configuration} config - The Webpack configuration object.
 * @param {import('@angular-devkit/architect').BuilderContext} context - The Angular builder context.
 */
module.exports = function (config, context) {
  // Add or modify the Webpack configuration here
  config.module.rules.push({
    test: /\.scss$/,
    use: ["style-loader", "css-loader", "sass-loader"],
  });

  return config;
};
```

### Custom Webpack Configurations by Builder

- **Browser Builder (`@angular-buildx/webpack:browser`)**: Extend the Angular browser build with custom Webpack configurations.
- **Dev Server Builder (`@angular-buildx/webpack:dev-server`)**: Extend the Angular development server with custom Webpack configurations.
- **Karma Builder (`@angular-buildx/webpack:karma`)**: Extend Karma test runner with custom Webpack configurations.

### Schema

Each builder supports passing a `webpack` option to specify the path to the custom Webpack configuration file.

#### Browser Builder Schema (`browser-schema.json`)

```json
{
  "$schema": "http://json-schema.org/schema",
  "type": "object",
  "properties": {
    "webpack": {
      "type": "string",
      "description": "Path to the custom webpack config file."
    }
  }
}
```

#### Dev Server Builder Schema (`dev-server-schema.json`)

```json
{
  "$schema": "http://json-schema.org/schema",
  "type": "object",
  "properties": {
    "webpack": {
      "type": "string",
      "description": "Path to the custom webpack config file."
    }
  }
}
```

#### Karma Builder Schema (`karma-schema.json`)

```json
{
  "$schema": "http://json-schema.org/schema",
  "type": "object",
  "properties": {
    "webpack": {
      "type": "string",
      "description": "Path to the custom webpack config file."
    }
  }
}
```

### Automatic Folder Extraction for Custom Webpack Files

If you include a custom Webpack file in your build process, this package will automatically extract and create the following folder structure:

```
.webpack/
├── webpack.original.snapshot
├── webpack.merged.snapshot
```

- `webpack.original.snapshot`: Contains the original Webpack configuration before your custom changes.
- `webpack.merged.snapshot`: Contains the final Webpack configuration after merging your custom configuration.

## License

MIT License

---

This structure provides an overview of how to use the custom Angular builders, configure the package, and integrate custom Webpack settings into your Angular project.
