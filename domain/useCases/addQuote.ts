import { QuoteEntity } from "../entities/quotes.ts";
import { QuoteRepository } from "../repositories/quoteRepository.ts";

export class AddQuoteDomainUseCase {
  private quoteRepository: QuoteRepository;

  constructor(quoteRepository: QuoteRepository) {
    this.quoteRepository = quoteRepository;
  }

  isValidQuote(
    quote: QuoteEntity,
    existingQuotes: QuoteEntity[] | null,
  ): void {
    if (!existingQuotes) {
      return;
    }
    const isDuplicate = existingQuotes.some((existingQuote) =>
      existingQuote._content === quote._content
    );

    if (isDuplicate) {
      throw new Error("This quote already exists.");
    }
  }
}
