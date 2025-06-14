import { inject, injectable } from "inversify";
import { TYPES } from "../../dependancyInjection/tokens.ts";
import { QuoteEntity } from "../../domain/entities/quotes.ts";
import type { QuoteRepository } from "../../domain/repositories/quoteRepository.ts";
import { ReadQuoteDomainUseCase } from "../../domain/useCases/readQuote.ts";
import { logger } from "../../infrastructure/utils/logger.ts";

type TempInput = {
  tags: QuoteEntity["_tags"];
  content: QuoteEntity["_content"];
  author: QuoteEntity["_author"];
  source: QuoteEntity["_source"];
};
interface ReadQuoteUseCaseInput {
  identifier: string;
}

interface ReadQuoteUseCaseOutput {
  quote: QuoteEntity;
}

@injectable()
export class ReadQuoteUseCase {
  private _quoteRepository: QuoteRepository;
  private _readQuoteDomainUseCase: ReadQuoteDomainUseCase;

  constructor(
    @inject(TYPES.QuoteRepository) quoteRepository: QuoteRepository,
    @inject(TYPES.ReadQuoteDomainUseCase) readQuoteDomainUseCase:
      ReadQuoteDomainUseCase,
  ) {
    this._quoteRepository = quoteRepository;
    this._readQuoteDomainUseCase = readQuoteDomainUseCase;
  }

  async execute(input: ReadQuoteUseCaseInput): Promise<ReadQuoteUseCaseOutput> {
    const foundQuote = await this._quoteRepository.getQuote(input.identifier);
    let foundQuoteEntity: null | QuoteEntity = null;
    if (!foundQuote) {
      throw new Error(
        `Quote with identifier ${input.identifier} was not found 😔`,
      );
    }

    foundQuoteEntity = new QuoteEntity(foundQuote);
    logger.debug({
      quote: foundQuoteEntity,
      content: foundQuoteEntity.getContent(),
      _readQuoteDomainUseCase: this._readQuoteDomainUseCase,
    });

    if (!this._readQuoteDomainUseCase.isValidQuote(foundQuoteEntity)) {
      throw new Error("Found quote is not valid 😔");
    }

    // Return the identifier of the added quote
    return { quote: foundQuoteEntity };
  }
}
