/* eslint-disable */
// @ts-nocheck
// Generated-route compatibility tree for the tracked TanStack Start build.
// The Vite wrapper regenerates this file during supported local builds; keeping
// the tracked tree in sync also makes Vercel deployments use the current routes.

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AboutRouteImport } from './routes/about'
import { Route as AdminRouteImport } from './routes/admin'
import { Route as CartRouteImport } from './routes/cart'
import { Route as CheckoutRouteImport } from './routes/checkout'
import { Route as ContactRouteImport } from './routes/contact'
import { Route as FaqRouteImport } from './routes/faq'
import { Route as OrderConfirmedRouteImport } from './routes/order-confirmed'
import { Route as SearchRouteImport } from './routes/search'
import { Route as ShopRouteImport } from './routes/shop'
import { Route as AdminLoginRouteImport } from './routes/admin.login'
import { Route as AdminProductsRouteImport } from './routes/admin.products'
import { Route as AdminCategoriesRouteImport } from './routes/admin.categories'
import { Route as AdminInventoryRouteImport } from './routes/admin.inventory'
import { Route as AdminOrdersRouteImport } from './routes/admin.orders'
import { Route as AdminCustomersRouteImport } from './routes/admin.customers'
import { Route as AdminPaymentsRouteImport } from './routes/admin.payments'
import { Route as CategoryCategoryRouteImport } from './routes/category.$category'
import { Route as PoliciesPolicyRouteImport } from './routes/policies.$policy'
import { Route as ProductSlugRouteImport } from './routes/product.$slug'

const IndexRoute = IndexRouteImport.update({ id: '/', path: '/', getParentRoute: () => rootRouteImport } as any)
const AboutRoute = AboutRouteImport.update({ id: '/about', path: '/about', getParentRoute: () => rootRouteImport } as any)
const AdminRoute = AdminRouteImport.update({ id: '/admin', path: '/admin', getParentRoute: () => rootRouteImport } as any)
const CartRoute = CartRouteImport.update({ id: '/cart', path: '/cart', getParentRoute: () => rootRouteImport } as any)
const CheckoutRoute = CheckoutRouteImport.update({ id: '/checkout', path: '/checkout', getParentRoute: () => rootRouteImport } as any)
const ContactRoute = ContactRouteImport.update({ id: '/contact', path: '/contact', getParentRoute: () => rootRouteImport } as any)
const FaqRoute = FaqRouteImport.update({ id: '/faq', path: '/faq', getParentRoute: () => rootRouteImport } as any)
const OrderConfirmedRoute = OrderConfirmedRouteImport.update({ id: '/order-confirmed', path: '/order-confirmed', getParentRoute: () => rootRouteImport } as any)
const SearchRoute = SearchRouteImport.update({ id: '/search', path: '/search', getParentRoute: () => rootRouteImport } as any)
const ShopRoute = ShopRouteImport.update({ id: '/shop', path: '/shop', getParentRoute: () => rootRouteImport } as any)
const CategoryCategoryRoute = CategoryCategoryRouteImport.update({ id: '/category/$category', path: '/category/$category', getParentRoute: () => rootRouteImport } as any)
const PoliciesPolicyRoute = PoliciesPolicyRouteImport.update({ id: '/policies/$policy', path: '/policies/$policy', getParentRoute: () => rootRouteImport } as any)
const ProductSlugRoute = ProductSlugRouteImport.update({ id: '/product/$slug', path: '/product/$slug', getParentRoute: () => rootRouteImport } as any)

const AdminLoginRoute = AdminLoginRouteImport.update({ id: '/login', path: '/login', getParentRoute: () => AdminRoute } as any)
const AdminProductsRoute = AdminProductsRouteImport.update({ id: '/products', path: '/products', getParentRoute: () => AdminRoute } as any)
const AdminCategoriesRoute = AdminCategoriesRouteImport.update({ id: '/categories', path: '/categories', getParentRoute: () => AdminRoute } as any)
const AdminInventoryRoute = AdminInventoryRouteImport.update({ id: '/inventory', path: '/inventory', getParentRoute: () => AdminRoute } as any)
const AdminOrdersRoute = AdminOrdersRouteImport.update({ id: '/orders', path: '/orders', getParentRoute: () => AdminRoute } as any)
const AdminCustomersRoute = AdminCustomersRouteImport.update({ id: '/customers', path: '/customers', getParentRoute: () => AdminRoute } as any)
const AdminPaymentsRoute = AdminPaymentsRouteImport.update({ id: '/payments', path: '/payments', getParentRoute: () => AdminRoute } as any)

const AdminRouteWithChildren = AdminRoute._addFileChildren({
  AdminLoginRoute,
  AdminProductsRoute,
  AdminCategoriesRoute,
  AdminInventoryRoute,
  AdminOrdersRoute,
  AdminCustomersRoute,
  AdminPaymentsRoute,
})

const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  AdminRoute: AdminRouteWithChildren,
  CartRoute,
  CheckoutRoute,
  ContactRoute,
  FaqRoute,
  OrderConfirmedRoute,
  SearchRoute,
  ShopRoute,
  CategoryCategoryRoute,
  PoliciesPolicyRoute,
  ProductSlugRoute,
}

export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)

import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
    config: Awaited<ReturnType<typeof startInstance.getOptions>>
  }
}
