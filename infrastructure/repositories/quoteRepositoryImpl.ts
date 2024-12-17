import { QuoteDTO, QuoteEntity } from "../../domain/entities/quotes.ts";
import { QuoteRepository } from "../../domain/repositories/quoteRepository.ts";
import { KV } from "../kv.ts";

class QuoteRepositoryImpl implements QuoteRepository {
  private kv: KV;

  constructor(kv: KV) {
    this.kv = kv;
  }

  async addQuote(quote: QuoteEntity): Promise<QuoteEntity["_id"]> {
    const uniqueId = QuoteEntity.generateUniqueQuoteId(quote);
    const identifier = await this.kv.post({
      identifier: uniqueId,
      value: quote,
      key: "quotes",
    });

    return identifier;
  }

  async getQuote(id: string): Promise<QuoteEntity | null> {
    const quoteDto =
      (await this.kv.get<QuoteDTO>({ key: "quotes", identifier: id })).value;
    if (quoteDto) {
      return new QuoteEntity(quoteDto);
    }
    return null;
  }

  async getAllQuotes(): Promise<QuoteEntity[] | null> {
    const allQuotes = (await this.kv.iterator<QuoteDTO>("quotes"))?.map((q) =>
      q.value
    );

    if (allQuotes) {
      return allQuotes.map((q) => new QuoteEntity(q));
    }
    return null;
  }
}

export const quoteRepository = new QuoteRepositoryImpl(new KV());
