export const TOKENS = {
  QUOTE_REPOSITORY: "QuoteRepository",
  ADD_QUOTE_DOMAIN_USE_CASE: "AddQuoteDomainUseCase",
  KV: "KV",
  ADD_QUOTE_USE_CASE: "AddQuoteUseCase",
};

const TYPES = {
  QuoteRepository: Symbol.for("QuoteRepository"),
  AddQuoteDomainUseCase: Symbol.for("AddQuoteDomainUseCase"),
  AddQuoteUseCase: Symbol.for("AddQuoteUseCase"),
  KV: Symbol.for("KV"),
};

export { TYPES };
