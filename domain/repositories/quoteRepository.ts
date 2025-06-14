import { QuoteDTO, QuoteEntity } from "../entities/quotes.ts";

export interface QuoteRepository {
  addQuote(quote: QuoteEntity): Promise<QuoteEntity["_id"]>;
  getQuote(id: QuoteEntity["_id"]): Promise<QuoteDTO | null>;
  getAllQuotes(): Promise<QuoteDTO[] | null>;
}
