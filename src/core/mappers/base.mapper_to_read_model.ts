export default abstract class BaseMapperToReadModel<R,M> {
 abstract  toReadModel(model: M): R
}