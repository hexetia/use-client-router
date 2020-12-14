import router, { makePublicRouterInstance, useRouter } from 'next/router';
import { match } from 'path-to-regexp';
import replaceString from "replace-string";

import type { Router, NextRouter } from 'next/router';
import type { MatchResult } from 'path-to-regexp';
import type { ParsedUrlQuery } from 'querystring';

/**
 * Current Next.js router on client have a strange behaviour
 * the router.query is an empty object on first render
 * others routers like react-router have the query|params always available
 *
 * Wrap Next.js router with resolved pathname and query
 */
function fixClientRouter(): NextRouter {
	if (typeof window !== 'undefined') {
		const windowPathname = window.location.pathname;

		const routerPathname = router.pathname;
		const firstRoutePart = replaceString(routerPathname, '[', ':');
		const readyToPathToRegExpProcess = replaceString(firstRoutePart, ']', '');

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
	// use next original router here to listen route changes
	// without this, the route will change and the component that uses this hook
	// won't receive the updated pathname and query
	useRouter();

	return fixClientRouter();
};
