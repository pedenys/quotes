export const TOKENS = {
  QUOTE_REPOSITORY: "QuoteRepository",
  ADD_QUOTE_DOMAIN_USE_CASE: "AddQuoteDomainUseCase",
  KV: "KV",
  ADD_QUOTE_USE_CASE: "AddQuoteUseCase",
  LIST_QUOTES_USE_CASE: "ListQuotesUseCase",
};

const TYPES = {
  QuoteRepository: Symbol.for("QuoteRepository"),
  AddQuoteDomainUseCase: Symbol.for("AddQuoteDomainUseCase"),
  AddQuoteUseCase: Symbol.for("AddQuoteUseCase"),
  ListQuotesDomainUseCase: Symbol.for("ListQuotesDomainUseCase"),
  ListQuotesUseCase: Symbol.for("ListQuotesUseCase"),
  KV: Symbol.for("KV"),
};

export { TYPES };
