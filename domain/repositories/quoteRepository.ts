import { QuoteEntity } from "../entities/quotes.ts";

export interface QuoteRepository {
  addQuote(quote: QuoteEntity): Promise<QuoteEntity["_id"]>;
  getQuote(id: QuoteEntity["_id"]): Promise<QuoteEntity | null>;
  getAllQuotes(): Promise<QuoteEntity[] | null>;
}
