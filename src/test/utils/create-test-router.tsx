import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  type AnyRouter,
} from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteChrome";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { Route as LoginRoute } from "@/routes/login";

const LoginPage = LoginRoute.options.component;

if (!LoginPage) {
  throw new Error("Login route component is not defined.");
}

function HomeTestPage() {
  return (
    <div data-testid="home-page">
      <SiteHeader />
      <main>
        <h1>Catálogo Rousse Shopping</h1>
      </main>
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <I18nProvider>
      <Outlet />
    </I18nProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeTestPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const routeTree = rootRoute.addChildren([indexRoute, loginRoute]);

export type TestRouter = AnyRouter;

export function createTestRouter(initialPath: "/" | "/login" = "/"): TestRouter {
  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });
}

export function getCurrentPath(router: TestRouter): string {
  return router.state.location.pathname;
}

type RenderTestAppOptions = {
  initialPath?: "/" | "/login";
};

export async function renderTestApp({ initialPath = "/" }: RenderTestAppOptions = {}) {
  const router = createTestRouter(initialPath);
  await router.load();

  const { render } = await import("@testing-library/react");

  const view = render(<RouterProvider router={router} />);

  return { router, ...view };
}
