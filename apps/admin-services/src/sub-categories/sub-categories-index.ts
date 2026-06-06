import { defaultHook, OpenAPIHono } from "@workspace/open-api"
import {
  createSubCategoryRoute,
  deleteSubCategoryRoute,
  getSubCategoriesRoute,
  getSubCategoryRoute,
  updateSubCategoryRoute,
} from "./sub-categories-route"
import {
  createSubCategoryHandler,
  deleteSubCategoryHandler,
  getSubCategoriesHandler,
  getSubCategoryHandler,
  updateSubCategoryHandler,
} from "./sub-categories-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(createSubCategoryRoute, createSubCategoryHandler)
  .openapi(updateSubCategoryRoute, updateSubCategoryHandler)
  .openapi(getSubCategoriesRoute, getSubCategoriesHandler)
  .openapi(getSubCategoryRoute, getSubCategoryHandler)
  .openapi(deleteSubCategoryRoute, deleteSubCategoryHandler)

export default app
