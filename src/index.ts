import router, { makePublicRouterInstance } from 'next/router';
import { match } from 'path-to-regexp';
import type { Router, NextRouter } from 'next/router';
import type { MatchResult } from 'path-to-regexp';
import type { ParsedUrlQuery } from 'querystring';

/**
 * Current nextjs router on client have a strange behaviour
 * the router.query is an empty object on first render
 * others routers have the query|params
 *
 * Make next router *query* and *pathname* available on first-render
 */
function fixClientRouter(): NextRouter {
	if (typeof window !== 'undefined') {
		const windowPathname = window.location.pathname;

		const routerPathname = router.pathname;
		const readyToPathToRegExpProcess = routerPathname.replaceAll('[', ':').replaceAll(']', '');

		return {
			...makePublicRouterInstance(router.router as Router),
			pathname: windowPathname,
			query: (match(readyToPathToRegExpProcess)(windowPathname) as MatchResult<ParsedUrlQuery>).params,
		};
	} else {
		// this empty fake router is for Next.js server throw the error about router usage on server-side
		return { query: {}, pathname: '', route: '', asPath: '', basePath: '' } as NextRouter;
	}
}

/**
 * Make next router *query* and *pathname* available on first-render
 */
export const useClientRouter = (): NextRouter => {
	return fixClientRouter();
};
