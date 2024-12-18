import { injectable } from "inversify";
import { QuoteEntity } from "../entities/quotes.ts";

@injectable()
export class AddQuoteDomainUseCase {
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
