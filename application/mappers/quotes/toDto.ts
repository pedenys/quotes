import { QuoteDTO, QuoteEntity } from "../../../domain/entities/quotes.ts";

export const fromQuoteEntityToQuoteDto = (
  quoteEntity: QuoteEntity,
): QuoteDTO => {
  return {
    content: quoteEntity.getContent(),
    tags: quoteEntity.getTags(),
    author: quoteEntity.getAuthor(),
    id: quoteEntity.getIdentifier(),
    source: quoteEntity.getSource(),
  };
};
