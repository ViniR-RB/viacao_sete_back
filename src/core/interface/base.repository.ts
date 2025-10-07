import AppException from "@/core/exceptions/app_exception";
import AsyncResult from "@/core/types/async_result";

export default abstract class BaseRepository<E, M> {
  abstract create(entity:E): M
  abstract save(entity:E): AsyncResult<AppException,E>
}