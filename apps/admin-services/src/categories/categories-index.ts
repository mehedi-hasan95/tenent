import { defaultHook, OpenAPIHono } from "@workspace/open-api"
import {
  createCategoryRoute,
  deleteCategoryRoute,
  getCategoriesRoute,
  getCategoryRoute,
  updateCategoryRoute,
} from "./categories-route"
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategoriesHandler,
  getCategoryHandler,
  updateCategoryHandler,
} from "./categories-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(createCategoryRoute, createCategoryHandler)
  .openapi(updateCategoryRoute, updateCategoryHandler)
  .openapi(getCategoriesRoute, getCategoriesHandler)
  .openapi(getCategoryRoute, getCategoryHandler)
  .openapi(deleteCategoryRoute, deleteCategoryHandler)

export default app
