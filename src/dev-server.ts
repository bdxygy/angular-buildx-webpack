import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from "@angular-devkit/architect";
import {
  executeDevServerBuilder,
  DevServerBuilderOptions,
} from "@angular-devkit/build-angular";
import { Configuration } from "webpack";
import { Observable } from "rxjs";
import {
  extractWebpackConfiguration,
  getCustomWebpackConfiguration,
} from "./utils/extract-config";
import { CustomBuilderSchema } from "./utils/options.interface";

type Schema = CustomBuilderSchema<DevServerBuilderOptions>;

export function customDevServerBuilder(
  options: Schema,
  context: BuilderContext
): Observable<BuilderOutput> {
  context.logger.info("\nCustom Dev Server is running...");

  let configCallback: (
    configuration: Configuration,
    context: BuilderContext
  ) => Configuration;

  configCallback = getCustomWebpackConfiguration<Schema>(options, context);

  return executeDevServerBuilder(options, context, {
    webpackConfiguration: (config: Configuration) =>
      extractWebpackConfiguration<Schema>(
        config,
        context,
        options,
        configCallback
      ),
  });
}

export default createBuilder<Schema>(customDevServerBuilder);
