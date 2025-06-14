import { inject, injectable } from "inversify";
import { TYPES } from "../../dependancyInjection/tokens.ts";
import { QuoteEntity } from "../../domain/entities/quotes.ts";
import type { QuoteRepository } from "../../domain/repositories/quoteRepository.ts";
import { AddQuoteDomainUseCase } from "../../domain/useCases/addQuote.ts";

type TempInput = {
  tags: QuoteEntity["_tags"];
  content: QuoteEntity["_content"];
  author: QuoteEntity["_author"];
  source: QuoteEntity["_source"];
};
interface AddQuoteUseCaseInput {
  quote: TempInput;
}

interface AddQuoteUseCaseOutput {
  id: QuoteEntity["_id"];
}

@injectable()
export class AddQuoteUseCase {
  private _quoteRepository: QuoteRepository;
  private _addQuoteDomainUseCase: AddQuoteDomainUseCase;

  constructor(
    @inject(TYPES.QuoteRepository) quoteRepository: QuoteRepository,
    @inject(TYPES.AddQuoteDomainUseCase) addQuoteDomainUseCase:
      AddQuoteDomainUseCase,
  ) {
    this._quoteRepository = quoteRepository;
    this._addQuoteDomainUseCase = addQuoteDomainUseCase;
  }

  async execute(input: AddQuoteUseCaseInput): Promise<AddQuoteUseCaseOutput> {
    // Create the QuoteEntity (validation occurs here)
    const newQuote = new QuoteEntity(input.quote);

    // Fetch existing quotes from the repository
    const existingQuotesFound = await this._quoteRepository.getAllQuotes();

    if (!existingQuotesFound) {
      throw new Error("Could not found existing quotes 🥲");
    }

    const existingQuotesFoundEntity = existingQuotesFound?.map((q) =>
      new QuoteEntity(q)
    );

    // Validate the quote using the domain use case
    this._addQuoteDomainUseCase.isValidQuote(
      newQuote,
      existingQuotesFoundEntity,
    );

    // Persist the quote using the repository
    const identifier = await this._quoteRepository.addQuote(newQuote);

    // Return the identifier of the added quote
    return { id: identifier };
  }
}
