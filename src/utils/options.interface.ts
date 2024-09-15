import { JsonObject } from "@angular-devkit/core";

export type CustomBuilderSchema<T> = JsonObject &
  T & {
    webpack?: string;
  };
