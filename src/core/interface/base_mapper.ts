export default interface BaseMapper<E, M> {
  toEntity(model: M): E;
  toModel(entity: E): Partial<M>;
}
