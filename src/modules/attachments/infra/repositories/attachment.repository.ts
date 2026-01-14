import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import Unit, { unit } from '@/core/types/unit';
import IAttachmentRepository, {
  AttachmentQueryOptions,
} from '@/modules/attachments/adapters/i_attachment.repository';
import AttachmentEntity from '@/modules/attachments/domain/entities/attachment.entity';
import AttachmentRepositoryException from '@/modules/attachments/exceptions/attachment_repository.exception';
import AttachmentMapper from '@/modules/attachments/infra/mapper/attachment.mapper';
import AttachmentModel from '@/modules/attachments/infra/models/attachment.model';
import {
  EntityManager,
  EntityNotFoundError,
  FindOneOptions,
  Repository,
} from 'typeorm';

export default class AttachmentRepository implements IAttachmentRepository {
  private readonly repository: Repository<AttachmentModel>;

  constructor(repoOrManager: Repository<AttachmentModel> | EntityManager) {
    if (repoOrManager instanceof Repository) {
      this.repository = repoOrManager;
    } else {
      this.repository = repoOrManager.getRepository(AttachmentModel);
    }
  }

  create(entity: AttachmentEntity): AttachmentModel {
    return this.repository.create(AttachmentMapper.toModel(entity));
  }

  async save(
    attachment: AttachmentEntity,
  ): AsyncResult<AppException, AttachmentEntity> {
    try {
      const model = this.create(attachment);
      const savedModel = await this.repository.save(model);
      return right(AttachmentMapper.toEntity(savedModel));
    } catch (error) {
      return left(
        new AttachmentRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async findOne(
    query: AttachmentQueryOptions,
  ): AsyncResult<AppException, AttachmentEntity> {
    try {
      const options: FindOneOptions<AttachmentModel> = {
        select: query.selectFields,
        relations: query.relations,
      };
      const model = await this.repository.findOneOrFail(options);

      return right(AttachmentMapper.toEntity(model));
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return left(AttachmentRepositoryException.notFound());
      }
      return left(
        new AttachmentRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async findByEntityId(
    entityId: string,
  ): AsyncResult<AppException, AttachmentEntity[]> {
    try {
      const models = await this.repository.find({
        where: { entityId },
      });

      const entities = models.map(model => AttachmentMapper.toEntity(model));
      return right(entities);
    } catch (error) {
      return left(
        new AttachmentRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async delete(id: string): AsyncResult<AppException, Unit> {
    try {
      await this.repository.delete(id);
      return right(unit);
    } catch (error) {
      return left(
        new AttachmentRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }
}
