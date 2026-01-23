# Glossary & Domain Concepts

This glossary defines project-specific terminology, type definitions, domain entities, and business rules relevant to the backend system.

## Glossary & Domain Concepts

- **User**: Represents an authenticated person using the system.
- **Transaction**: A financial or business operation recorded in the system.
- **Attachment**: A file or document associated with a transaction or user.
- **DTO (Data Transfer Object)**: An object used to transfer data between layers.
- **Repository**: Abstraction for data persistence and retrieval.
- **Service**: Contains business logic and orchestrates domain operations.
- **Entity**: A core business object with identity and behavior.
- **Value Object**: An immutable object representing a descriptive aspect of the domain.
- **Guard**: Enforces authentication or authorization.
- **Module**: Encapsulates related controllers, services, and domain logic.

## Type Definitions

- [BaseMapper](../../src/core/interface/base_mapper.ts)
- [BaseModelPrimaryColumnUuid](../../src/core/interface/base_model.ts)
- [BaseModelIdGeneratedIncrement](../../src/core/interface/base_model.ts)
- [JwtSignPayload](../../src/core/interface/jwt.payload.ts)
- [JwtVerifyPayload](../../src/core/interface/jwt.payload.ts)
- [IUnitOfWork](../../src/core/interface/i_unit_of_work.ts)
- [UseCase](../../src/core/interface/use_case.ts)
- [IUserRepository](../../src/modules/users/adapters/i_user.repository.ts)
- [ITransactionRepository](../../src/modules/transactions/adapters/i_transaction.repository.ts)
- [ITransactionCategoryRepository](../../src/modules/transactions/adapters/i_transaction_category.repository.ts)
- [ITransactionLineDetailsRepository](../../src/modules/transactions/adapters/i_transaction_line_details.repository.ts)
- [IFileStorage](../../src/modules/file/adapters/i.file.storage.ts)
- [IAttachmentRepository](../../src/modules/attachments/adapters/i_attachment.repository.ts)

## Enumerations

- [TransactionPeriod](../../src/modules/transactions/adapters/i_transaction.repository.ts)
- [UserRole](../../src/modules/users/domain/entities/user.role.ts)
- [ExtractPeriod](../../src/modules/transactions/domain/usecase/i_extract_transaction_summary_use_case.ts)
- [TransactionType](../../src/modules/transactions/domain/types/transaction-type.ts)
- [TransactionCategoryType](../../src/modules/transactions/domain/entities/transaction_category_enum.ts)
- [AttachmentScope](../../src/modules/attachments/domain/types/attachment-scope.ts)

## Core Terms

- **Amount**: Represents a monetary value. See [amount.ts](../../src/core/value-objects/amount.ts).
- **AppException**: Base class for application errors. See [app_exception.ts](../../src/core/exceptions/app_exception.ts).
- **AuthGuard**: Enforces authentication for protected routes. See [auth.guard.ts](../../src/core/guard/auth.guard.ts).
- **ConfigurationService**: Loads and validates environment variables. See [configuration.service.ts](../../src/core/services/configuration.service.ts).
- **DTO**: Used for input validation and data transfer between layers.
- **Repository**: Used for data access abstraction.
- **Service**: Implements business logic.

## Acronyms & Abbreviations

- **DTO**: Data Transfer Object
- **JWT**: JSON Web Token
- **API**: Application Programming Interface
- **DB**: Database
- **VO**: Value Object
- **PR**: Pull Request

## Personas / Actors

- **End User**: Interacts with the system via UI or API to manage transactions and files.
- **Admin**: Manages users, oversees system health, and handles escalations.
- **Developer**: Maintains and extends the backend codebase.

## Domain Rules & Invariants

- Transactions must be associated with a valid user.
- Attachments are linked to either a transaction or user.
- All input data is validated via DTOs before processing.
- Authentication is required for all protected endpoints.

## Related Resources

- [Project Overview](./project-overview.md)