import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Skeleton } from "antd";
import MainLayout from "./layouts/MainLayout";
import ProductListPage from "./pages/ProductListPage";

// Route-level code splitting: the details page is only loaded when a user
// actually navigates to /products/:id, keeping the initial bundle smaller.
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));

function App() {
  return (
    <MainLayout>
      <Suspense fallback={<Skeleton active paragraph={{ rows: 8 }} />}>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}

export default App;
