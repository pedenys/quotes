import { TYPES } from "../../dependancyInjection/tokens.ts";
import { QuoteEntity } from "../../domain/entities/quotes.ts";
import type { QuoteRepository } from "../../domain/repositories/quoteRepository.ts";
import { ListQuotesDomainUseCase } from "../../domain/useCases/listQuotes.ts";
import { inject, injectable } from "inversify";

type ListQuotesUseCaseInput = {
  filter?: unknown;
};

interface ListQuotesUseCaseOutput {
  quotes: Array<QuoteEntity>;
}

@injectable()
export class ListQuotesUseCase {
  private _quoteRepository: QuoteRepository;
  private _listQuotesDomainUseCase: ListQuotesDomainUseCase;

  constructor(
    @inject(TYPES.QuoteRepository) quoteRepository: QuoteRepository,
    @inject(TYPES.ListQuotesDomainUseCase) listQuotesDomainUseCase:
      ListQuotesDomainUseCase,
  ) {
    this._quoteRepository = quoteRepository;
    this._listQuotesDomainUseCase = listQuotesDomainUseCase;
  }

  async execute(
    _input?: ListQuotesUseCaseInput,
  ): Promise<ListQuotesUseCaseOutput> {
    // Fetch existing quotes from the repository
    const quotes = await this._quoteRepository.getAllQuotes();

    if (!quotes) {
      throw new Error("Could not find existing quotes 🥲");
    }

    const quotesEntities = quotes?.map((q) => new QuoteEntity(q));

    // Validate the quote using the domain use case
    this._listQuotesDomainUseCase.isValidList(
      quotesEntities || null,
    );

    // Return the list of quotes
    return { quotes: quotesEntities };
  }
}
