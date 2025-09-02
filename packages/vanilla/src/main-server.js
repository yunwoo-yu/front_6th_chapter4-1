import { HomePage, NotFoundPage, ProductDetailPage } from "./pages";
import { router } from "./router";
import { getProducts, getCategories, getProduct } from "./api/productApi.js";

router.addRoute("/", HomePage);
router.addRoute("/product/:id/", ProductDetailPage);
router.addRoute(".*", NotFoundPage);

// 페이지별 데이터 prefetch 함수들
const prefetchHomePage = async (query) => {
  try {
    const [productsData, categories] = await Promise.all([getProducts(query), getCategories()]);

    return { productsData, categories };
  } catch (error) {
    console.error("Homepage prefetch error:", error);
    return { productsData: null, categories: null };
  }
};

const prefetchProductDetail = async (productId) => {
  try {
    const product = await getProduct(productId);
    return { product };
  } catch (error) {
    console.error("Product detail prefetch error:", error);
    return { product: null };
  }
};

export const render = async (url, query) => {
  router.start(url, query);

  const PageComponent = router.target;
  let data;

  // 현재 라우트에 따라 데이터 prefetch
  if (router.route?.path === "/") {
    data = await prefetchHomePage(router.query);
  } else if (router.route?.path === "/product/:id/") {
    const productId = router.route.params.id;
    data = await prefetchProductDetail(productId);
  }

  return {
    html: PageComponent(),
    head: "<title>안녕하세요</title>",
    data: JSON.stringify(data),
  };
};
