import {
  ErrorComponent,
  GitHubBanner,
  Refine,
  Authenticated,
} from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";

import {
  BrowserRouter,
  data,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router";
import "./App.css";
import { Layout } from "./components/layout";
import {
  ProductCreate,
  ProductEdit,
  ProductList,
  ProductShow,
} from "./pages/products";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
import {
  BatteryCreate,
  BatteryEdit,
  BatteryList,
  BatteryShow,
} from "./pages/batteries";

import {
  ArrowDownOnSquareIcon,
  HomeIcon,
  ShoppingCartIcon,
  TagIcon,
  ChartBarIcon,
  Battery100Icon,
  UserIcon,
  UserGroupIcon,
} from "@heroicons/react/20/solid";
import { Dashboard } from "./pages/dashboard";
import { ProfileAnalyticsPage } from "./pages/ProfileAnalyticsPage";
import ProfileUpload from "./pages/ProfileUpload";
import { dataProviderInstance } from "./dataProvider";
import { authProvider } from "./authProvider";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ChangePassword } from "./pages/auth/ChangePassword";
import {
  ProsumerCreate,
  ProsumerEdit,
  ProsumerList,
  ProsumerShow,
} from "./pages/prosumers";
import { CommunityManagerPage } from "./pages/communities/communityPage";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <Refine
          dataProvider={
            dataProviderInstance /* dataProvider("https://api.finefoods.refine.dev") */
          }
          routerProvider={routerBindings}
          authProvider={authProvider}
          resources={[
            {
              name: "dashboard",
              list: "/dashboard",
              meta: {
                icon: <HomeIcon className="h-4 w-4" />,
              },
            },
            {
              name: "communities",
              list: "/communities",
              create: "/communities/create",
              edit: "/communities/edit/:id",
              show: "/communities/show/:id",
              meta: {
                icon: <UserGroupIcon className="h-4 w-4" />,
                canDelete: true,
              },
            },
            /*             {
              name: "products",
              list: "/products",
              create: "/products/create",
              edit: "/products/edit/:id",
              show: "/products/show/:id",
              meta: {
                icon: <ShoppingCartIcon className="h-4 w-4" />,
                canDelete: true,
              },
            },
            {
              name: "categories",
              list: "/categories",
              create: "/categories/create",
              edit: "/categories/edit/:id",
              show: "/categories/show/:id",
              meta: {
                icon: <TagIcon className="h-4 w-4" />,
                canDelete: true,
              },
            }, */
            {
              name: "prosumers",
              list: "/prosumers",
              create: "/prosumers/create",
              edit: "/prosumers/edit/:id",
              show: "/prosumers/show/:id",
              meta: {
                icon: <UserIcon className="h-4 w-4" />,
                canDelete: true,
              },
            },
            {
              name: "analytics",
              list: "/profiles",
              meta: {
                icon: <ChartBarIcon className="h-4 w-4" />,
              },
            },
            /*             {
              name: "uploadData",
              list: "/uploadData",
              meta: {
                icon: <ArrowDownOnSquareIcon className="h-5 w-5 font-bold" />,
              },
            }, */

            {
              name: "batteries",
              list: "/batteries",
              create: "/batteries/create",
              edit: "/batteries/edit/:id",
              show: "/batteries/show/:id",
              meta: {
                icon: <Battery100Icon className="h-4 w-4" />,
                canDelete: true,
              },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/change-password" element={<ChangePassword />} />

            <Route
              element={
                <Authenticated key="authenticated-routes" fallback={<Login />}>
                  <Layout>
                    <Outlet />
                  </Layout>
                </Authenticated>
              }
            >
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="/profiles" element={<ProfileAnalyticsPage />} />
              <Route path="/uploadData" element={<ProfileUpload />} />
              <Route
                path="/communities"
                element={<CommunityManagerPage />}
              ></Route>
              <Route path="/batteries">
                <Route index element={<BatteryList />} />
                <Route path="create" element={<BatteryCreate />} />
                <Route path="edit/:id" element={<BatteryEdit />} />
                <Route path="show/:id" element={<BatteryShow />} />
              </Route>
              <Route path="/prosumers">
                <Route index element={<ProsumerList />} />
                <Route path="create" element={<ProsumerCreate />} />
                <Route path="edit/:id" element={<ProsumerEdit />} />
                <Route path="show/:id" element={<ProsumerShow />} />
              </Route>
              <Route path="/dashboard">
                <Route index element={<Dashboard />} />
              </Route>
              <Route path="/products">
                <Route index element={<ProductList />} />
                <Route path="create" element={<ProductCreate />} />
                <Route path="edit/:id" element={<ProductEdit />} />
                <Route path="show/:id" element={<ProductShow />} />
              </Route>
              <Route path="/categories">
                <Route index element={<CategoryList />} />
                <Route path="create" element={<CategoryCreate />} />
                <Route path="edit/:id" element={<CategoryEdit />} />
                <Route path="show/:id" element={<CategoryShow />} />
              </Route>
              <Route path="*" element={<ErrorComponent />} />
            </Route>
          </Routes>
          <RefineKbar />
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
