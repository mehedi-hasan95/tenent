import { defaultHook, OpenAPIHono } from "@workspace/open-api"
import {
  createCategoryRoute,
  deleteCategoryRoute,
  deleteManyCategoryRoute,
  deleteTrashedCategoryRoute,
  getCategoriesRoute,
  getCategoryRoute,
  restoreCategoryRoute,
  trashCategoryRoute,
  updateCategoryRoute,
} from "./categories-route"
import {
  createCategoryHandler,
  deleteCategoryHandler,
  deleteManyCategoryHandler,
  deleteTrashedCategoryHandler,
  getCategoriesHandler,
  getCategoryHandler,
  restoreCategoryHandler,
  trashCategoryHandler,
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
  .openapi(trashCategoryRoute, trashCategoryHandler)
  .openapi(restoreCategoryRoute, restoreCategoryHandler)
  .openapi(deleteCategoryRoute, deleteCategoryHandler)
  .openapi(deleteManyCategoryRoute, deleteManyCategoryHandler)
  .openapi(deleteTrashedCategoryRoute, deleteTrashedCategoryHandler)

export default app
