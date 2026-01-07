import TransactionCategoryEntity from '@/modules/transactions/domain/entities/transaction-category.entity';
import TransactionCategoryType from '@/modules/transactions/domain/entities/transaction_category_enum';
import TransactionCategoryDomainException from '@/modules/transactions/exceptions/transaction_category_domain.exception';
import {
  VALID_AGENCY_TRANSACTION_CATEGORY_PROPS,
  VALID_COMMON_TRANSACTION_CATEGORY_PROPS,
  VALID_LINE_TRANSACTION_CATEGORY_PROPS,
  VALID_MULTI_TYPE_TRANSACTION_CATEGORY_PROPS,
  VALID_USER_TRANSACTION_CATEGORY_PROPS,
} from 'test/constants/transactions/transaction_category.constants';

describe('TransactionCategoryEntity', () => {
  describe('create', () => {
    it('should create a common category successfully', () => {
      // Arrange
      const props = VALID_COMMON_TRANSACTION_CATEGORY_PROPS;

      // Act
      const entity = TransactionCategoryEntity.create(props);

      // Assert
      expect(entity).toBeInstanceOf(TransactionCategoryEntity);
      expect(entity.id).toBeDefined();
      expect(entity.name).toBe('Alimentação');
      expect(entity.description).toBe('Despesas com alimentação');
      expect(entity.types).toEqual([TransactionCategoryType.COMMON]);
      expect(entity.userId).toBeNull();
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.updatedAt).toBeInstanceOf(Date);
    });

    it('should create an agency category successfully', () => {
      // Arrange
      const props = VALID_AGENCY_TRANSACTION_CATEGORY_PROPS;

      // Act
      const entity = TransactionCategoryEntity.create(props);

      // Assert
      expect(entity).toBeInstanceOf(TransactionCategoryEntity);
      expect(entity.name).toBe('Manutenção Agência Centro');
      expect(entity.types).toEqual([TransactionCategoryType.AGENCY]);
      expect(entity.id).toBeDefined();
    });

    it('should create a line category successfully', () => {
      // Arrange
      const props = VALID_LINE_TRANSACTION_CATEGORY_PROPS;

      // Act
      const entity = TransactionCategoryEntity.create(props);

      // Assert
      expect(entity).toBeInstanceOf(TransactionCategoryEntity);
      expect(entity.name).toBe('Combustível Linha 101');
      expect(entity.types).toEqual([TransactionCategoryType.LINE]);
      expect(entity.id).toBeDefined();
    });

    it('should create a multi-type category successfully', () => {
      // Arrange
      const props = VALID_MULTI_TYPE_TRANSACTION_CATEGORY_PROPS;

      // Act
      const entity = TransactionCategoryEntity.create(props);

      // Assert
      expect(entity).toBeInstanceOf(TransactionCategoryEntity);
      expect(entity.name).toBe('Seguro');
      expect(entity.types).toContain(TransactionCategoryType.AGENCY);
      expect(entity.types).toContain(TransactionCategoryType.LINE);
      expect(entity.types).toHaveLength(2);
    });

    it('should create a category with specific userId', () => {
      // Arrange
      const props = VALID_USER_TRANSACTION_CATEGORY_PROPS;

      // Act
      const entity = TransactionCategoryEntity.create(props);

      // Assert
      expect(entity).toBeInstanceOf(TransactionCategoryEntity);
      expect(entity.userId).toBe(123);
      expect(entity.name).toBe('Categoria do Usuário');
      expect(entity.description).toBeNull();
    });

    it('should generate UUID when id is not provided', () => {
      // Arrange
      const props = VALID_COMMON_TRANSACTION_CATEGORY_PROPS;

      // Act
      const entity = TransactionCategoryEntity.create(props);

      // Assert
      expect(entity.id).toBeDefined();
      expect(typeof entity.id).toBe('string');
      expect(entity.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('should use provided id when specified', () => {
      // Arrange
      const customId = '550e8400-e29b-41d4-a716-446655440000';
      const props = {
        ...VALID_COMMON_TRANSACTION_CATEGORY_PROPS,
        id: customId,
      };

      // Act
      const entity = TransactionCategoryEntity.create(props);

      // Assert
      expect(entity.id).toBe(customId);
    });
  });

  describe('validation errors', () => {
    it('should throw error when name is shorter than 3 characters', () => {
      // Arrange
      const invalidProps = {
        ...VALID_COMMON_TRANSACTION_CATEGORY_PROPS,
        name: 'AB',
      };

      // Act & Assert
      expect(() => {
        TransactionCategoryEntity.validate(invalidProps);
      }).toThrow(TransactionCategoryDomainException);
      expect(() => {
        TransactionCategoryEntity.validate(invalidProps);
      }).toThrow('Name must be at least 3 characters long');
    });

    it('should throw error when description is shorter than 3 characters', () => {
      // Arrange
      const invalidProps = {
        ...VALID_COMMON_TRANSACTION_CATEGORY_PROPS,
        description: 'AB',
      };

      // Act & Assert
      expect(() => {
        TransactionCategoryEntity.validate(invalidProps);
      }).toThrow(TransactionCategoryDomainException);
      expect(() => {
        TransactionCategoryEntity.validate(invalidProps);
      }).toThrow('Description must be at least 3 characters long');
    });

    it('should throw error when types array is empty', () => {
      // Arrange
      const invalidProps = {
        ...VALID_COMMON_TRANSACTION_CATEGORY_PROPS,
        types: [],
      };

      // Act & Assert
      expect(() => {
        TransactionCategoryEntity.validate(invalidProps);
      }).toThrow(TransactionCategoryDomainException);
      expect(() => {
        TransactionCategoryEntity.validate(invalidProps);
      }).toThrow('At least one category type must be specified');
    });

    it('should throw error when types is not provided', () => {
      // Arrange
      const invalidProps = {
        ...VALID_COMMON_TRANSACTION_CATEGORY_PROPS,
        types: undefined,
      };

      // Act & Assert
      expect(() => {
        TransactionCategoryEntity.validate(invalidProps);
      }).toThrow(TransactionCategoryDomainException);
      expect(() => {
        TransactionCategoryEntity.validate(invalidProps);
      }).toThrow('At least one category type must be specified');
    });

    it('should throw error when invalid type is provided', () => {
      // Arrange
      const invalidProps = {
        ...VALID_COMMON_TRANSACTION_CATEGORY_PROPS,
        types: ['INVALID_TYPE' as any],
      };

      // Act & Assert
      expect(() => {
        TransactionCategoryEntity.validate(invalidProps);
      }).toThrow(TransactionCategoryDomainException);
      expect(() => {
        TransactionCategoryEntity.validate(invalidProps);
      }).toThrow('At least one category type must be specified');
    });

    it('should throw error when mixing valid and invalid types', () => {
      // Arrange
      const invalidProps = {
        ...VALID_COMMON_TRANSACTION_CATEGORY_PROPS,
        types: [TransactionCategoryType.COMMON, 'INVALID_TYPE' as any],
      };

      // Act & Assert
      expect(() => {
        TransactionCategoryEntity.validate(invalidProps);
      }).toThrow(TransactionCategoryDomainException);
    });

    it('should throw error when COMMON type is combined with AGENCY type', () => {
      // Arrange
      const invalidProps = {
        ...VALID_COMMON_TRANSACTION_CATEGORY_PROPS,
        types: [TransactionCategoryType.COMMON, TransactionCategoryType.AGENCY],
      };

      // Act & Assert
      expect(() => {
        TransactionCategoryEntity.validate(invalidProps);
      }).toThrow(TransactionCategoryDomainException);
      expect(() => {
        TransactionCategoryEntity.validate(invalidProps);
      }).toThrow(
        'Transaction category the type Common cannot be combined with other types',
      );
    });

    it('should throw error when COMMON type is combined with LINE type', () => {
      // Arrange
      const invalidProps = {
        ...VALID_COMMON_TRANSACTION_CATEGORY_PROPS,
        types: [TransactionCategoryType.COMMON, TransactionCategoryType.LINE],
      };

      // Act & Assert
      expect(() => {
        TransactionCategoryEntity.validate(invalidProps);
      }).toThrow(TransactionCategoryDomainException);
      expect(() => {
        TransactionCategoryEntity.validate(invalidProps);
      }).toThrow(
        'Transaction category the type Common cannot be combined with other types',
      );
    });

    it('should throw error when COMMON type is combined with multiple other types', () => {
      // Arrange
      const invalidProps = {
        ...VALID_COMMON_TRANSACTION_CATEGORY_PROPS,
        types: [
          TransactionCategoryType.COMMON,
          TransactionCategoryType.AGENCY,
          TransactionCategoryType.LINE,
        ],
      };

      // Act & Assert
      expect(() => {
        TransactionCategoryEntity.validate(invalidProps);
      }).toThrow(TransactionCategoryDomainException);
      expect(() => {
        TransactionCategoryEntity.validate(invalidProps);
      }).toThrow(
        'Transaction category the type Common cannot be combined with other types',
      );
    });

    it('should allow multiple non-COMMON types without COMMON', () => {
      // Arrange
      const validProps = {
        ...VALID_MULTI_TYPE_TRANSACTION_CATEGORY_PROPS,
        types: [TransactionCategoryType.AGENCY, TransactionCategoryType.LINE],
      };

      // Act & Assert
      expect(() => {
        TransactionCategoryEntity.validate(validProps);
      }).not.toThrow();
    });

    it('should allow empty name when not validating', () => {
      // Arrange
      const props = {
        ...VALID_COMMON_TRANSACTION_CATEGORY_PROPS,
        name: '',
      };

      // Act & Assert
      // Should not throw because validate is not called
      expect(() => {
        TransactionCategoryEntity.create(props);
      }).not.toThrow();
    });

    it('should allow empty description when not validating', () => {
      // Arrange
      const props = {
        ...VALID_COMMON_TRANSACTION_CATEGORY_PROPS,
        description: '',
      };

      // Act & Assert
      // Should not throw because validate is not called
      expect(() => {
        TransactionCategoryEntity.create(props);
      }).not.toThrow();
    });
  });

  describe('fromData', () => {
    it('should create entity from existing data', () => {
      // Arrange
      const now = new Date();
      const data = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        userId: null,
        name: 'Alimentação',
        description: 'Despesas com alimentação',
        types: [TransactionCategoryType.COMMON],
        createdAt: now,
        updatedAt: now,
      };

      // Act
      const entity = TransactionCategoryEntity.fromData(data);

      // Assert
      expect(entity.id).toBe(data.id);
      expect(entity.name).toBe(data.name);
      expect(entity.description).toBe(data.description);
      expect(entity.types).toEqual(data.types);
      expect(entity.createdAt).toBe(now);
      expect(entity.updatedAt).toBe(now);
    });
  });

  describe('toObject', () => {
    it('should convert entity to object with all fields', () => {
      // Arrange
      const props = VALID_COMMON_TRANSACTION_CATEGORY_PROPS;
      const entity = TransactionCategoryEntity.create(props);

      // Act
      const obj = entity.toObject();

      // Assert
      expect(obj).toHaveProperty('id');
      expect(obj).toHaveProperty('userId');
      expect(obj).toHaveProperty('name');
      expect(obj).toHaveProperty('description');
      expect(obj).toHaveProperty('types');
      expect(obj).toHaveProperty('createdAt');
      expect(obj).toHaveProperty('updatedAt');
      expect(obj.name).toBe('Alimentação');
      expect(obj.types).toEqual([TransactionCategoryType.COMMON]);
    });

    it('should maintain data integrity when converting to object', () => {
      // Arrange
      const props = VALID_MULTI_TYPE_TRANSACTION_CATEGORY_PROPS;
      const entity = TransactionCategoryEntity.create(props);

      // Act
      const obj = entity.toObject();

      // Assert
      expect(obj.types).toHaveLength(2);
      expect(obj.name).toBe('Seguro');
    });
  });

  describe('getters', () => {
    it('should return all values through getters', () => {
      // Arrange
      const props = VALID_USER_TRANSACTION_CATEGORY_PROPS;
      const entity = TransactionCategoryEntity.create(props);

      // Act & Assert
      expect(entity.id).toBeDefined();
      expect(entity.userId).toBe(123);
      expect(entity.name).toBe('Categoria do Usuário');
      expect(entity.description).toBeNull();
      expect(entity.types).toEqual([TransactionCategoryType.COMMON]);
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.updatedAt).toBeInstanceOf(Date);
    });
  });
});
