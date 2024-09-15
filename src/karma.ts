import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from "@angular-devkit/architect";
import { JsonObject } from "@angular-devkit/core";
import {
  executeKarmaBuilder,
  KarmaBuilderOptions,
} from "@angular-devkit/build-angular";
import { Configuration } from "webpack";
import * as fs from "fs";
import * as path from "path";
import { cwd } from "process";
import util from "util";
import { Observable } from "rxjs";
import {
  extractWebpackConfiguration,
  getCustomWebpackConfiguration,
} from "./utils/extract-config";
import { CustomBuilderSchema } from "./utils/options.interface";

type Schema = CustomBuilderSchema<KarmaBuilderOptions>;

export function customKarmaBuilder(
  options: Schema,
  context: BuilderContext
): Observable<BuilderOutput> {
  context.logger.info("\nCustom builder is running...");

  let configCallback: (
    configuration: Configuration,
    context: BuilderContext
  ) => Configuration;

  configCallback = getCustomWebpackConfiguration<Schema>(options, context);

  return executeKarmaBuilder(options, context, {
    webpackConfiguration: (config: Configuration) =>
      extractWebpackConfiguration<Schema>(
        config,
        context,
        options,
        configCallback
      ),
  });
}

export default createBuilder<Schema>(customKarmaBuilder);
