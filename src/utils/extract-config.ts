import { BuilderContext } from "@angular-devkit/architect";
import { Configuration } from "webpack";
import util from "util";
import path from "path";
import { cwd } from "process";
import fs from "fs";
import { CustomBuilderSchema } from "./options.interface";

export const getCustomWebpackConfiguration = <T>(
  options: CustomBuilderSchema<T>,
  context: BuilderContext
) => {
  if (options.webpack) {
    const webpackPath = path.resolve(context.workspaceRoot, options.webpack);

    if (fs.existsSync(webpackPath)) {
      try {
        context.logger.info(
          `\nLoaded custom Webpack configuration from: ${webpackPath}`
        );
        return require(webpackPath);
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
};

export const extractWebpackConfiguration = <T>(
  config: Configuration,
  context: BuilderContext,
  options: CustomBuilderSchema<T>,
  webpackCallback: (
    config: Configuration,
    context: BuilderContext
  ) => Configuration | undefined
) => {
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
    context.logger.info(`\nWrite original config snapshot`);
    fs.writeFileSync(
      fileConfigOriginalPath,
      `module.exports = ${webpackConfigString(config)};`
    );

    const finalConfig = webpackCallback(config, context);

    context.logger.info(`\nWrite merged config snapshot callback`);
    fs.writeFileSync(
      fileConfigMergedPath,
      `module.exports = ${webpackConfigString(
        finalConfig ? finalConfig : config
      )};`
    );

    if (finalConfig) {
      context.logger.warn(`\nYou already use your own config`);
      return finalConfig;
    }
  }

  return config;
};
