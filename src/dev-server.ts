import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from "@angular-devkit/architect";
import { JsonObject } from "@angular-devkit/core";
import {
  executeDevServerBuilder,
  DevServerBuilderOptions,
} from "@angular-devkit/build-angular";
import { Configuration } from "webpack";
import * as fs from "fs";
import * as path from "path";
import { cwd } from "process";
import util from "util";
import { Observable } from "rxjs";

export type CustomBuilderSchema = JsonObject &
  DevServerBuilderOptions & {
    webpack?: string;
  };

export function customDevServerBuilder(
  options: CustomBuilderSchema,
  context: BuilderContext
): Observable<BuilderOutput> {
  context.logger.info("\nCustom builder is running...");

  let configCallback: (
    configuration: Configuration,
    context: BuilderContext
  ) => Configuration;

  if (options.webpack) {
    const webpackPath = path.resolve(context.workspaceRoot, options.webpack);

    if (fs.existsSync(webpackPath)) {
      try {
        configCallback = require(webpackPath);
        context.logger.info(
          `\nLoaded custom Webpack configuration from: ${webpackPath}`
        );
      } catch (error) {
        context.logger.error(
          `\nError loading custom Webpack config at: ${webpackPath}`
        );
        throw error;
      }
    } else {
      context.logger.error(
        `\nCustom Webpack config file does not exist at: ${webpackPath}`
      );
      throw Error(
        `\nCustom Webpack config file does not exist at: ${webpackPath}`
      );
    }
  }

  return executeDevServerBuilder(options, context, {
    webpackConfiguration: (config: Configuration) => {
      const snapshotDirectory = path.join(cwd(), ".webpack");

      const webpackConfigString = (newConfig: any) =>
        util.inspect(newConfig, {
          depth: Infinity,
          compact: false,
        });

      const fileConfigOriginalPath = path.join(
        snapshotDirectory,
        "webpack.original.snapshot"
      );

      const fileConfigMergedPath = path.join(
        snapshotDirectory,
        "webpack.merged.snapshot"
      );

      if (!fs.existsSync(snapshotDirectory)) {
        fs.mkdirSync(snapshotDirectory);
      }

      if (options.webpack) {
        context.logger.info(`\nWrite original config snapshot callback`);
        fs.writeFileSync(
          fileConfigOriginalPath,
          `module.exports = ${webpackConfigString(config)};`
        );

        const finalConfig = configCallback(config, context);

        context.logger.info(`\nWrite merged config snapshot callback`);
        fs.writeFileSync(
          fileConfigMergedPath,
          `module.exports = ${webpackConfigString(config)};`
        );

        if (finalConfig) return finalConfig;
      }

      return config;
    },
  });
}

export default createBuilder<CustomBuilderSchema>(customDevServerBuilder);
