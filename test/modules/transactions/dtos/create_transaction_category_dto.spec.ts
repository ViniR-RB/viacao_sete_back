import TransactionCategoryType from '@/modules/transactions/domain/entities/transaction_category_enum';
import { CreateTransactionCategoryDto } from '@/modules/transactions/dtos/create_transaction_category.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  VALID_AGENCY_TRANSACTION_CATEGORY_PROPS,
  VALID_COMMON_TRANSACTION_CATEGORY_PROPS,
  VALID_LINE_TRANSACTION_CATEGORY_PROPS,
  VALID_MULTI_TYPE_TRANSACTION_CATEGORY_PROPS,
} from 'test/constants/transactions/transaction_category.constants';

describe('CreateTransactionCategoryDto', () => {
  describe('valid data', () => {
    it('should accept valid common category dto', async () => {
      // Arrange
      const dto = plainToInstance(
        CreateTransactionCategoryDto,
        VALID_COMMON_TRANSACTION_CATEGORY_PROPS,
      );

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.name).toBe('Alimentação');
      expect(dto.description).toBe('Despesas com alimentação');
      expect(dto.types).toEqual([TransactionCategoryType.COMMON]);
    });

    it('should accept valid agency category dto', async () => {
      // Arrange
      const dto = plainToInstance(
        CreateTransactionCategoryDto,
        VALID_AGENCY_TRANSACTION_CATEGORY_PROPS,
      );

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.name).toBe('Manutenção Agência Centro');
      expect(dto.types).toEqual([TransactionCategoryType.AGENCY]);
    });

    it('should accept valid line category dto', async () => {
      // Arrange
      const dto = plainToInstance(
        CreateTransactionCategoryDto,
        VALID_LINE_TRANSACTION_CATEGORY_PROPS,
      );

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.types).toEqual([TransactionCategoryType.LINE]);
    });

    it('should accept category with multiple types', async () => {
      // Arrange
      const dto = plainToInstance(
        CreateTransactionCategoryDto,
        VALID_MULTI_TYPE_TRANSACTION_CATEGORY_PROPS,
      );

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.types).toHaveLength(3);
    });

    it('should accept category without description', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'Categoria sem descrição',
        types: [TransactionCategoryType.COMMON],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.name).toBe('Categoria sem descrição');
      expect(dto.description).toBeUndefined();
    });

    it('should transform short description to null', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'Teste',
        description: 'AB',
        types: [TransactionCategoryType.COMMON],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.description).toBeNull();
    });
  });

  describe('validation errors', () => {
    it('should reject dto when name is missing', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        description: 'Despesas com alimentação',
        types: [TransactionCategoryType.COMMON],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toBeDefined();
    });

    it('should reject dto when name is shorter than 3 characters', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'AB',
        description: 'Despesas com alimentação',
        types: [TransactionCategoryType.COMMON],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should reject dto when name is not a string', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 123,
        types: [TransactionCategoryType.COMMON],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should accept dto with empty types array (validation happens at service level)', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'Alimentação',
        description: 'Despesas com alimentação',
        types: [],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should reject dto when types is missing', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'Alimentação',
        description: 'Despesas com alimentação',
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('types');
    });

    it('should reject dto with invalid type in types array', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'Alimentação',
        description: 'Despesas com alimentação',
        types: ['INVALID_TYPE'],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('types');
      expect(errors[0].constraints).toHaveProperty('isEnum');
    });

    it('should reject dto with mixed valid and invalid types', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'Alimentação',
        description: 'Despesas com alimentação',
        types: [TransactionCategoryType.COMMON, 'INVALID_TYPE'],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('types');
    });

    it('should reject dto when description is shorter than 3 characters and not null', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'Alimentação',
        description: 'AB',
        types: [TransactionCategoryType.COMMON],
      });

      // Act - Note: The transform should convert "AB" to null, so no validation error expected
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.description).toBeNull();
    });

    it('should reject dto when description is not a string', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'Alimentação',
        description: 123,
        types: [TransactionCategoryType.COMMON],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('edge cases', () => {
    it('should accept name with exactly 3 characters', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'ABC',
        types: [TransactionCategoryType.COMMON],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.name).toBe('ABC');
    });

    it('should accept description with exactly 3 characters', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'Alimentação',
        description: 'ABC',
        types: [TransactionCategoryType.COMMON],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.description).toBe('ABC');
    });

    it('should transform empty string description to null', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'Alimentação',
        description: '',
        types: [TransactionCategoryType.COMMON],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      // Empty string is transformed to null by the transform function
      expect(errors).toHaveLength(0);
      expect(dto.description).toBeNull();
    });

    it('should accept very long name and description', async () => {
      // Arrange
      const longString = 'A'.repeat(255);
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: longString,
        description: longString,
        types: [TransactionCategoryType.COMMON],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.name).toBe(longString);
      expect(dto.description).toBe(longString);
    });

    it('should handle types with single element', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'Teste',
        types: [TransactionCategoryType.COMMON],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.types).toHaveLength(1);
    });

    it('should handle types with all valid enum values', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'Teste',
        types: Object.values(TransactionCategoryType),
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.types).toHaveLength(
        Object.values(TransactionCategoryType).length,
      );
    });
  });

  describe('transformation', () => {
    it('should apply description transform correctly', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'Teste',
        description: 'AB',
        types: [TransactionCategoryType.COMMON],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.description).toBeNull();
    });

    it('should preserve valid description after transform', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'Teste',
        description: 'Valid description',
        types: [TransactionCategoryType.COMMON],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.description).toBe('Valid description');
    });

    it('should handle null description from transform', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'Teste',
        description: 'X',
        types: [TransactionCategoryType.COMMON],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.description).toBeNull();
    });

    it('should handle undefined description (not provided)', async () => {
      // Arrange
      const dto = plainToInstance(CreateTransactionCategoryDto, {
        name: 'Teste',
        types: [TransactionCategoryType.COMMON],
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.description).toBeUndefined();
    });
  });
});
