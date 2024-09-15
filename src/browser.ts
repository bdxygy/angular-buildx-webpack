import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from "@angular-devkit/architect";
import {
  BrowserBuilderOptions,
  executeBrowserBuilder,
} from "@angular-devkit/build-angular";
import { Configuration } from "webpack";
import { Observable } from "rxjs";
import {
  extractWebpackConfiguration,
  getCustomWebpackConfiguration,
} from "./utils/extract-config";
import { CustomBuilderSchema } from "./utils/options.interface";

type Schema = CustomBuilderSchema<BrowserBuilderOptions>;

export function customBrowserBuilder(
  options: Schema,
  context: BuilderContext
): Observable<BuilderOutput> {
  context.logger.info("\nCustom builder is running...");

  let configCallback: (
    configuration: Configuration,
    context: BuilderContext
  ) => Configuration;

  configCallback = getCustomWebpackConfiguration<Schema>(options, context);

  return executeBrowserBuilder(options, context, {
    webpackConfiguration: (config: Configuration) =>
      extractWebpackConfiguration<Schema>(
        config,
        context,
        options,
        configCallback
      ),
  });
}

export default createBuilder<Schema>(customBrowserBuilder);
