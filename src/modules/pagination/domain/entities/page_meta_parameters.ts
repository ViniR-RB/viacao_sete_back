import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';

export default interface PageMetaParameters {
  pageOptions: PageOptionsEntity;
  itemCount: number;
}
