import { inject, injectable } from "inversify";
import { QuoteDTO, QuoteEntity } from "../../domain/entities/quotes.ts";
import { QuoteRepository } from "../../domain/repositories/quoteRepository.ts";
import { KV } from "../kv.ts";
import { TYPES } from "../../dependancyInjection/tokens.ts";
import { fromQuoteEntityToQuoteDto } from "../../application/mappers/quotes/toDto.ts";

@injectable()
export class QuoteRepositoryImpl implements QuoteRepository {
  private kv: KV;

  constructor(@inject(TYPES.KV) kv: KV) {
    this.kv = kv;
  }

  async addQuote(quote: QuoteEntity): Promise<QuoteEntity["_id"]> {
    const uniqueId = QuoteEntity.generateUniqueQuoteId(quote);
    const data = fromQuoteEntityToQuoteDto(quote);
    const identifier = await this.kv.post({
      identifier: uniqueId,
      value: { ...data, id: uniqueId },
      key: "quotes",
    });

    return identifier;
  }

  async getQuote(id: string): Promise<QuoteDTO | null> {
    const quoteDto =
      (await this.kv.get<QuoteDTO>({ key: "quotes", identifier: id })).value;
    if (quoteDto) {
      return quoteDto;
    }
    return null;
  }

  async getAllQuotes(): Promise<QuoteDTO[] | null> {
    const allQuotes = (await this.kv.iterator<QuoteDTO>("quotes"))?.map((q) =>
      q.value
    );

    if (allQuotes) {
      return allQuotes;
    }

    return null;
  }
}
