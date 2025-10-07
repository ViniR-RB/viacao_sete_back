import PageMetaEntity from '@/modules/pagination/domain/entities/page_meta.entity';

export default class PageEntity<T> {
  constructor(
    private readonly data: T[],
    private meta: PageMetaEntity,
  ) {
    this.data = data;
    this.meta = meta;
  }

  get pageData() {
    return this.data;
  }

  toObject() {
    return {
      data: this.data.map(item => {
        if (
          item !== null &&
          typeof item === 'object' &&
          'toObject' in item &&
          typeof item.toObject === 'function'
        ) {
          return item.toObject();
        }
        return item;
      }),
      meta: this.meta,
    };
  }
}
