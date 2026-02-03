import { Amount } from '@/core/value-objects/amount';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import TransactionLineDetailsEntity from '@/modules/transactions/domain/entities/transaction_line_details.entity';
import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';
import TransactionDomainException from '@/modules/transactions/exceptions/transaction_domain.exception';
import {
  LINE_DETAILS_ALL_COMPONENTS,
  LINE_DETAILS_ONLY_AMOUNT_GO,
  LINE_DETAILS_ZERO_TOTAL,
  VALID_LINE_DETAILS,
  VALID_TRANSACTION_WITH_LINE_DETAILS,
  VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
} from '@test/constants/transactions/transaction.constants';

describe('TransactionEntity - Calculate Amount', () => {
  describe('Erro: Ambos amount e transactionLineDetails nulos', () => {
    it('deve lançar exceção quando amount e transactionLineDetails são nulos', () => {
      const invalidProps = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        amountInCents: null,
        transactionLineDetails: null,
      };

      expect(() => {
        TransactionEntity.create(invalidProps);
      }).toThrow(TransactionDomainException);

      expect(() => {
        TransactionEntity.create(invalidProps);
      }).toThrow('Either amount or transaction line details must be provided');
    });
  });

  describe('Erro: User ID é obrigatório', () => {
    it('deve lançar exceção quando userId é undefined', () => {
      const invalidProps = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        userId: undefined,
      };

      expect(() => {
        TransactionEntity.create(invalidProps as any);
      }).toThrow(TransactionDomainException);

      expect(() => {
        TransactionEntity.create(invalidProps as any);
      }).toThrow('User ID is required');
    });
  });

  describe('Erro: Category ID é obrigatório', () => {
    it('deve lançar exceção quando categoryId é vazio', () => {
      const invalidProps = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        categoryId: '',
      };

      expect(() => {
        TransactionEntity.create(invalidProps);
      }).toThrow(TransactionDomainException);

      expect(() => {
        TransactionEntity.create(invalidProps);
      }).toThrow('Category ID is required');
    });
  });

  describe('Erro: Description deve ter mínimo 3 caracteres', () => {
    it('deve lançar exceção quando description tem menos de 3 caracteres', () => {
      const invalidProps = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        description: 'AB',
      };

      expect(() => {
        TransactionEntity.create(invalidProps);
      }).toThrow(TransactionDomainException);

      expect(() => {
        TransactionEntity.create(invalidProps);
      }).toThrow('Description is required');
    });

    it('deve lançar exceção quando description é apenas espaços em branco', () => {
      const invalidProps = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        description: '   ',
      };

      expect(() => {
        TransactionEntity.create(invalidProps);
      }).toThrow(TransactionDomainException);

      expect(() => {
        TransactionEntity.create(invalidProps);
      }).toThrow('Description is required');
    });
  });

  describe('Erro: Type deve ser válido', () => {
    it('deve lançar exceção quando type é inválido', () => {
      const invalidProps = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        type: 'INVALID_TYPE' as any,
      };

      expect(() => {
        TransactionEntity.create(invalidProps);
      }).toThrow(TransactionDomainException);

      expect(() => {
        TransactionEntity.create(invalidProps);
      }).toThrow('Invalid transaction type');
    });
  });

  describe('Erro: Amount deve ser maior que zero', () => {
    it('deve lançar exceção quando amount é zero', () => {
      const invalidProps = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        amountInCents: 0,
      };

      expect(() => {
        TransactionEntity.create(invalidProps);
      }).toThrow(TransactionDomainException);

      expect(() => {
        TransactionEntity.create(invalidProps);
      }).toThrow('Amount must be greater than zero');
    });

    it('deve lançar exceção quando amount é negativo', () => {
      const invalidProps = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        amountInCents: -5000,
      };

      expect(() => {
        TransactionEntity.create(invalidProps);
      }).toThrow(TransactionDomainException);

      expect(() => {
        TransactionEntity.create(invalidProps);
      }).toThrow('Amount must be greater than zero');
    });

    it('deve lançar exceção quando transactionLineDetails tem total zero', () => {
      const invalidProps = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        amountInCents: null,
        transactionLineDetails: LINE_DETAILS_ZERO_TOTAL,
      };

      expect(() => {
        TransactionEntity.create(invalidProps);
      }).toThrow(TransactionDomainException);

      expect(() => {
        TransactionEntity.create(invalidProps);
      }).toThrow('Amount must be greater than zero');
    });
  });

  describe('Sucesso: Ambos amount e transactionLineDetails fornecidos', () => {
    it('deve setar o amount sendo o valor de transaction line details', () => {
      const propsBothAmountAnd = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        amountInCents: 10000,
        transactionLineDetails: VALID_LINE_DETAILS,
      };

      expect(() => {
        TransactionEntity.create(propsBothAmountAnd);
      }).not.toThrow();

      const transaction = TransactionEntity.create(propsBothAmountAnd);

      expect(transaction.amount.inCents).toBe(8000);
      expect(transaction.amount.getValue).toBe(80);
      expect(transaction.transactionLineDetails).toBeDefined();
      expect(transaction.transactionLineDetails?.id).toBe(
        VALID_LINE_DETAILS.id,
      );
    });
  });

  describe('Sucesso: Criar transação com amount em cents', () => {
    it('deve criar transação com amountInCents e calcular corretamente', () => {
      const props = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        amountInCents: 15500,
        description: 'Transação com amount simples',
      };

      const transaction = TransactionEntity.create(props);

      expect(transaction).toBeDefined();
      expect(transaction.id).toBeDefined();
      expect(transaction.amount.inCents).toBe(15500);
      expect(transaction.amount.getValue).toBe(155);
      expect(transaction.userId).toBe(1);
      expect(transaction.categoryId).toBe('cat-123');
      expect(transaction.transactionLineDetails).toBeNull();
    });

    it('deve usar amount correto do sistema de cents', () => {
      const props = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        userId: 2,
        categoryId: 'cat-456',
        description: 'Transação com centavos',
        paymentMethodId: 'pm-456',
        amountInCents: 99,
        type: TransactionType.INCOME,
      };

      const transaction = TransactionEntity.create(props);

      expect(transaction.amount.inCents).toBe(99);
      expect(transaction.amount.getValue).toBe(0.99);
    });
  });

  describe('Sucesso: Criar transação com TransactionLineDetails', () => {
    it('deve criar transação com transactionLineDetails e calcular amount automaticamente', () => {
      const props = {
        ...VALID_TRANSACTION_WITH_LINE_DETAILS,
        description: 'Transação com detalhes de linha',
      };

      const transaction = TransactionEntity.create(props);

      expect(transaction).toBeDefined();
      expect(transaction.id).toBeDefined();
      expect(transaction.amount.inCents).toBe(8000);
      expect(transaction.amount.getValue).toBe(80);
      expect(transaction.transactionLineDetails).toBeDefined();
      expect(transaction.transactionLineDetails?.id).toBe(
        VALID_LINE_DETAILS.id,
      );
      expect(transaction.userId).toBe(2);
      expect(transaction.categoryId).toBe('cat-456');
    });

    it('deve calcular amount apenas com amountGo', () => {
      const props = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        userId: 4,
        categoryId: 'cat-111',
        description: 'Apenas ida',
        paymentMethodId: 'pm-111',
        amountInCents: null,
        transactionLineDetails: LINE_DETAILS_ONLY_AMOUNT_GO,
        type: TransactionType.EXPENSE,
      };

      const transaction = TransactionEntity.create(props);

      expect(transaction.amount.inCents).toBe(10000);
      expect(transaction.amount.getValue).toBe(100);
    });

    it('deve calcular amount com todos os componentes', () => {
      const props = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        userId: 5,
        categoryId: 'cat-222',
        description: 'Ida, volta e troco',
        paymentMethodId: 'pm-222',
        amountInCents: null,
        transactionLineDetails: LINE_DETAILS_ALL_COMPONENTS,
        type: TransactionType.INCOME,
      };

      const transaction = TransactionEntity.create(props);

      expect(transaction.amount.inCents).toBe(17500);
      expect(transaction.amount.getValue).toBe(175);
    });
  });

  describe('Sucesso: Serialização (toObject)', () => {
    it('deve serializar transação com amount simples corretamente', () => {
      const props = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        amountInCents: 5000,
        description: 'Transação simples',
      };

      const transaction = TransactionEntity.create(props);

      const serialized = transaction.toObject();

      expect(serialized.amount).toBe(50);
      expect(serialized.userId).toBe(1);
      expect(serialized.transactionLineDetails).toBeNull();
    });

    it('deve serializar transação com transactionLineDetails corretamente', () => {
      const transactionId = 'tx-123';
      const lineDetails = TransactionLineDetailsEntity.create({
        transactionId: transactionId,
        amountGo: Amount.fromCents(3000),
        amountReturn: Amount.fromCents(1000),
        driveChange: Amount.fromCents(500),
      });

      const props = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        id: transactionId,
        userId: 2,
        categoryId: 'cat-456',
        description: 'Com detalhes',
        paymentMethodId: 'pm-456',
        amountInCents: null,
        transactionLineDetails: lineDetails,
      };

      const transaction = TransactionEntity.create(props);

      const serialized = transaction.toObject();

      expect(serialized.amount).toBe(45);
      expect(serialized.transactionLineDetails).toBeDefined();
      expect(serialized.transactionLineDetails?.amountGo).toBe(30);
      expect(serialized.transactionLineDetails?.amountReturn).toBe(10);
      expect(serialized.transactionLineDetails?.driveChange).toBe(5);
    });
  });

  describe('Sucesso: Propriedades obrigatórias geradas', () => {
    it('deve gerar id quando não fornecido', () => {
      const props = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        description: 'Com ID gerado',
      };

      const transaction = TransactionEntity.create(props);

      expect(transaction.id).toBeDefined();
      expect(typeof transaction.id).toBe('string');
      expect(transaction.id.length).toBeGreaterThan(0);
    });

    it('deve gerar createdAt quando não fornecido', () => {
      const props = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        description: 'Com createdAt gerado',
      };

      const beforeCreation = new Date();

      const transaction = TransactionEntity.create(props);

      const afterCreation = new Date();

      expect(transaction.createdAt).toBeDefined();
      expect(transaction.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(transaction.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });

    it('deve gerar attachmentsIds como array vazio', () => {
      const props = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        description: 'Com attachments vazios',
      };

      const transaction = TransactionEntity.create(props);

      expect(transaction.attachmentsIds).toBeDefined();
      expect(Array.isArray(transaction.attachmentsIds)).toBe(true);
      expect(transaction.attachmentsIds.length).toBe(0);
    });

    it('deve definir paymentMethodId como fornecido', () => {
      const propsWithPayment = {
        ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        description: 'Com payment',
      };

      const transactionWithPayment = TransactionEntity.create(propsWithPayment);

      expect(transactionWithPayment.paymentMethodId).toBe('pm-123');
    });
  });

  describe('Update - Atualizar propriedades da transação', () => {
    describe('Sucesso: Atualizar apenas description', () => {
      it('deve atualizar description corretamente', () => {
        const props = {
          ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
          description: 'Descrição original',
        };

        const transaction = TransactionEntity.create(props);
        const novaDescricao = 'Descrição atualizada com sucesso';

        transaction.update({ description: novaDescricao });

        expect(transaction.description).toBe(novaDescricao);
        expect(transaction.amount.inCents).toBe(10000);
      });
    });

    describe('Sucesso: Atualizar apenas type', () => {
      it('deve atualizar type corretamente', () => {
        const props = {
          ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
          type: TransactionType.INCOME,
        };

        const transaction = TransactionEntity.create(props);

        transaction.update({ type: TransactionType.EXPENSE });

        expect(transaction.type).toBe(TransactionType.EXPENSE);
        expect(transaction.amount.inCents).toBe(10000);
      });
    });

    describe('Sucesso: Atualizar apenas amountInCents', () => {
      it('deve atualizar amount corretamente', () => {
        const props = {
          ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
          amountInCents: 10000,
        };

        const transaction = TransactionEntity.create(props);

        transaction.update({ amountInCents: 25000 });

        expect(transaction.amount.inCents).toBe(25000);
        expect(transaction.amount.getValue).toBe(250);
        expect(transaction.transactionLineDetails).toBeNull();
      });
    });

    describe('Sucesso: Atualizar apenas categoryId', () => {
      it('deve atualizar categoryId corretamente', () => {
        const props = {
          ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
          categoryId: 'cat-123',
        };

        const transaction = TransactionEntity.create(props);

        transaction.update({ categoryId: 'cat-novo' });

        expect(transaction.categoryId).toBe('cat-novo');
        expect(transaction.amount.inCents).toBe(10000);
      });
    });

    describe('Sucesso: Atualizar apenas paymentMethodId', () => {
      it('deve atualizar paymentMethodId corretamente', () => {
        const props = {
          ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
          paymentMethodId: 'pm-123',
        };

        const transaction = TransactionEntity.create(props);

        transaction.update({ paymentMethodId: 'pm-novo' });

        expect(transaction.paymentMethodId).toBe('pm-novo');
        expect(transaction.amount.inCents).toBe(10000);
      });
    });

    describe('Sucesso: Atualizar apenas transactionLineDetails', () => {
      it('deve atualizar transactionLineDetails e recalcular amount', () => {
        const props = {
          ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
          amountInCents: 10000,
          transactionLineDetails: null,
        };

        const transaction = TransactionEntity.create(props);
        const novoLineDetails = LINE_DETAILS_ALL_COMPONENTS;

        transaction.update({ transactionLineDetails: novoLineDetails });

        expect(transaction.transactionLineDetails).toBeDefined();
        expect(transaction.transactionLineDetails?.id).toBe(novoLineDetails.id);
        expect(transaction.amount.inCents).toBe(17500); // 10000 + 5000 + 2500
        expect(transaction.amount.getValue).toBe(175);
      });
    });

    describe('Sucesso: Atualizar múltiplos campos', () => {
      it('deve atualizar description, type e amountInCents simultaneamente', () => {
        const props = {
          ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
          description: 'Original',
          type: TransactionType.INCOME,
          amountInCents: 10000,
        };

        const transaction = TransactionEntity.create(props);

        transaction.update({
          description: 'Atualizado',
          type: TransactionType.EXPENSE,
          amountInCents: 30000,
        });

        expect(transaction.description).toBe('Atualizado');
        expect(transaction.type).toBe(TransactionType.EXPENSE);
        expect(transaction.amount.inCents).toBe(30000);
      });

      it('deve atualizar description, type e transactionLineDetails', () => {
        const props = {
          ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
          description: 'Original',
          amountInCents: 10000,
        };

        const transaction = TransactionEntity.create(props);
        const novoLineDetails = LINE_DETAILS_ONLY_AMOUNT_GO;

        transaction.update({
          description: 'Com linha de detalhe',
          type: TransactionType.EXPENSE,
          transactionLineDetails: novoLineDetails,
        });

        expect(transaction.description).toBe('Com linha de detalhe');
        expect(transaction.type).toBe(TransactionType.EXPENSE);
        expect(transaction.amount.inCents).toBe(10000);
        expect(transaction.transactionLineDetails).toBeDefined();
      });
    });

    describe('Sucesso: Recálculo automático de amount', () => {
      it('deve usar lineDetails para calcular amount quando ambos são alterados', () => {
        const props = {
          ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
          amountInCents: 5000,
          transactionLineDetails: null,
        };

        const transaction = TransactionEntity.create(props);

        transaction.update({
          amountInCents: 999999,
          transactionLineDetails: VALID_LINE_DETAILS,
        });

     
        expect(transaction.amount.inCents).toBe(8000);
        expect(transaction.amount.getValue).toBe(80);
      });

      it('deve atualizar timestamp updatedAt ao fazer update', () => {
        const props = {
          ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        };

        const transaction = TransactionEntity.create(props);
        const updatedAtAntes = transaction.updatedAt;

        // Aguardar um pouco para garantir que a data seja diferente
        setTimeout(() => {
          transaction.update({ description: 'Nova descrição' });
          expect(transaction.updatedAt.getTime()).toBeGreaterThan(
            updatedAtAntes.getTime(),
          );
        }, 10);
      });
    });

    describe('Erro: Validação no update', () => {
      it('deve lançar exceção quando description fica vazia', () => {
        const props = {
          ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        };

        const transaction = TransactionEntity.create(props);

        expect(() => {
          transaction.update({ description: 'AB' });
        }).toThrow(TransactionDomainException);

        expect(() => {
          transaction.update({ description: 'AB' });
        }).toThrow('Description is required');
      });

      it('deve lançar exceção quando type é inválido', () => {
        const props = {
          ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        };

        const transaction = TransactionEntity.create(props);

        expect(() => {
          transaction.update({ type: 'INVALID_TYPE' as any });
        }).toThrow(TransactionDomainException);

        expect(() => {
          transaction.update({ type: 'INVALID_TYPE' as any });
        }).toThrow('Invalid transaction type');
      });

      it('deve lançar exceção quando amount calculado fica zero', () => {
        const props = {
          ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
          amountInCents: 10000,
        };

        const transaction = TransactionEntity.create(props);

        expect(() => {
          transaction.update({ amountInCents: 0 });
        }).toThrow(TransactionDomainException);

        expect(() => {
          transaction.update({ amountInCents: 0 });
        }).toThrow('Amount must be greater than zero');
      });

      it('deve lançar exceção quando lineDetails tem total zero', () => {
        const props = {
          ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
          amountInCents: 10000,
        };

        const transaction = TransactionEntity.create(props);

        expect(() => {
          transaction.update({
            transactionLineDetails: LINE_DETAILS_ZERO_TOTAL,
          });
        }).toThrow(TransactionDomainException);

        expect(() => {
          transaction.update({
            transactionLineDetails: LINE_DETAILS_ZERO_TOTAL,
          });
        }).toThrow('Amount must be greater than zero');
      });
    });

    describe('Sucesso: Update não altera propriedades imutáveis', () => {
      it('não deve alterar id após update', () => {
        const props = {
          ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
          id: 'tx-imutavel',
        };

        const transaction = TransactionEntity.create(props);
        const idOriginal = transaction.id;

        transaction.update({ description: 'Nova descrição' });

        expect(transaction.id).toBe(idOriginal);
      });

      it('não deve alterar userId após update', () => {
        const props = {
          ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
          userId: 99,
        };

        const transaction = TransactionEntity.create(props);
        const userIdOriginal = transaction.userId;

        transaction.update({ description: 'Nova descrição' });

        expect(transaction.userId).toBe(userIdOriginal);
      });

      it('não deve alterar createdAt após update', () => {
        const props = {
          ...VALID_TRANSACTION_WITHOUT_LINE_DETAILS,
        };

        const transaction = TransactionEntity.create(props);
        const createdAtOriginal = transaction.createdAt;

        transaction.update({ description: 'Nova descrição' });

        expect(transaction.createdAt).toBe(createdAtOriginal);
      });
    });
  });
});
