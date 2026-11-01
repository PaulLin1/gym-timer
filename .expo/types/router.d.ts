/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/controls`; params?: Router.UnknownInputParams; } | { pathname: `/screen`; params?: Router.UnknownInputParams; } | { pathname: `/timer`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/controls`; params?: Router.UnknownOutputParams; } | { pathname: `/screen`; params?: Router.UnknownOutputParams; } | { pathname: `/timer`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/controls${`?${string}` | `#${string}` | ''}` | `/screen${`?${string}` | `#${string}` | ''}` | `/timer${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString | Router.ExternalPathString | `/controls` | `/screen` | `/timer` | `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
