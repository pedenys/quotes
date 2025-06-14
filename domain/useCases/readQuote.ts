import { injectable } from "inversify";
import { QuoteEntity } from "../entities/quotes.ts";

@injectable()
export class ReadQuoteDomainUseCase {
  isValidQuote(
    quote: QuoteEntity,
  ): void | boolean {
    if (!quote.getContent()) {
      throw new Error("Quote has no content to be displayed 😔");
    }
    return true;
  }
}
