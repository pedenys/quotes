export const TOKENS = {
  QUOTE_REPOSITORY: "QuoteRepository",
  ADD_QUOTE_DOMAIN_USE_CASE: "AddQuoteDomainUseCase",
  KV: "KV",
  ADD_QUOTE_USE_CASE: "AddQuoteUseCase",
  LIST_QUOTES_USE_CASE: "ListQuotesUseCase",
  LIST_QUOTES_DOMAIN_USE_CASE: "ListQuotesDomainUseCase",
  READ_QUOTE_USE_CASE: "ReadQuoteUseCase",
  READ_QUOTE_DOMAIN_USE_CASE: "ReadQuoteDomainUseCase",
};

const TYPES = {
  QuoteRepository: Symbol.for(TOKENS.QUOTE_REPOSITORY),
  AddQuoteDomainUseCase: Symbol.for(TOKENS.ADD_QUOTE_DOMAIN_USE_CASE),
  AddQuoteUseCase: Symbol.for(TOKENS.ADD_QUOTE_USE_CASE),
  ReadQuoteUseCase: Symbol.for(TOKENS.READ_QUOTE_USE_CASE),
  ReadQuoteDomainUseCase: Symbol.for(TOKENS.READ_QUOTE_DOMAIN_USE_CASE),
  ListQuotesDomainUseCase: Symbol.for(TOKENS.LIST_QUOTES_DOMAIN_USE_CASE),
  ListQuotesUseCase: Symbol.for(TOKENS.LIST_QUOTES_USE_CASE),
  KV: Symbol.for(TOKENS.KV),
};

export { TYPES };
