import { injectable } from "inversify";
import { QuoteEntity } from "../entities/quotes.ts";

@injectable()
export class ListQuotesDomainUseCase {
  isValidList(
    quotes: Array<QuoteEntity> | null,
  ): void {
    if (!quotes || !Array.isArray(quotes) || quotes.length === 0) {
      throw new Error("List of quotes is not valid");
    }
  }
}
