import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

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

import { Dashboard } from "./pages/dashboard";
import { ProfileAnalyticsPage } from "./pages/ProfileAnalyticsPage";
import ProfileUpload from "./pages/ProfileUpload";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Aqui o Layout é o wrapper comum para as rotas */}
        <Route element={<Layout><Outlet /></Layout>}>
          {/* rota raiz redireciona para dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Profiles */}
          <Route path="/profiles" element={<ProfileAnalyticsPage />} />

          {/* Upload data */}
          <Route path="/uploadData" element={<ProfileUpload />} />

          {/* Batteries */}
{/*           <Route path="/batteries">
            <Route index element={<BatteryList />} />
            <Route path="create" element={<BatteryCreate />} />
            <Route path="edit/:id" element={<BatteryEdit />} />
            <Route path="show/:id" element={<BatteryShow />} />
          </Route> */}

          {/* Products */}
          <Route path="/products">
            <Route index element={<ProductList />} />
            <Route path="create" element={<ProductCreate />} />
            <Route path="edit/:id" element={<ProductEdit />} />
            <Route path="show/:id" element={<ProductShow />} />
          </Route>

          {/* Categories */}
          <Route path="/categories">
            <Route index element={<CategoryList />} />
            <Route path="create" element={<CategoryCreate />} />
            <Route path="edit/:id" element={<CategoryEdit />} />
            <Route path="show/:id" element={<CategoryShow />} />
          </Route>

          {/* Rota coringa para erro */}
          {/* <Route path="*" element={<ErrorComponent />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
