import ICreateAttachmentUseCase from '@/modules/attachments/domain/usecase/i_create_attachment_use_case';
import IFindAttachmentsByEntityIdUseCase from '@/modules/attachments/domain/usecase/i_find_attachments_by_entity_id_use_case';
import CreateAttachmentDto from '@/modules/attachments/dto/create_attachment.dto';
import {
  CREATE_ATTACHMENT_SERVICE,
  FIND_ATTACHMENTS_BY_ENTITY_ID_SERVICE,
} from '@/modules/attachments/symbols';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Attachments')
@Controller('api/attachments')
export default class AttachmentsController {
  constructor(
    @Inject(CREATE_ATTACHMENT_SERVICE)
    private readonly createAttachmentService: ICreateAttachmentUseCase,
    @Inject(FIND_ATTACHMENTS_BY_ENTITY_ID_SERVICE)
    private readonly findAttachmentsByEntityIdService: IFindAttachmentsByEntityIdUseCase,
  ) {}

  @Get('/entity/:entityId')
  @ApiOperation({
    summary: 'Get attachments by entity ID',
    description: 'Retrieve all attachments associated with a specific entity',
  })
  @ApiParam({
    name: 'entityId',
    type: 'string',
    format: 'uuid',
    description: 'The ID of the entity to get attachments for',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiResponse({
    status: 200,
    description: 'Attachments retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        attachments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
              },
              name: {
                type: 'string',
              },
              fileUrl: {
                type: 'string',
              },
              scope: {
                type: 'string',
              },
              entityId: {
                type: 'string',
                format: 'uuid',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid entity ID',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findByEntityId(@Param('entityId') entityId: string) {
    const result = await this.findAttachmentsByEntityIdService.execute({
      entityId,
    });
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Create attachment',
    description:
      'Upload a file and create an attachment associated with an entity',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'name', 'scope', 'entityId'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
        name: {
          type: 'string',
          description: 'Name of the attachment',
          example: 'receipt.pdf',
        },
        scope: {
          type: 'string',
          enum: ['TRANSACTION'],
          description: 'Scope of the attachment',
          example: 'TRANSACTION',
        },
        entityId: {
          type: 'string',
          format: 'uuid',
          description: 'ID of the entity associated with this attachment',
          example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Attachment created successfully',
    schema: {
      type: 'object',
      properties: {
        attachmentId: {
          type: 'string',
          format: 'uuid',
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateAttachmentDto,
  ) {
    const result = await this.createAttachmentService.execute({
      file: {
        buffer: file.buffer,
        mimetype: file.mimetype,
        originalName: file.originalname,
        encoding: file.encoding,
        size: file.size,
      },
      name: dto.name,
      scope: dto.scope,
      entityId: dto.entityId,
    });
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value;
  }
}
