import { QuoteRepository } from "../domain/repositories/quoteRepository.ts";
import { KV } from "../infrastructure/kv.ts";
import { QuoteRepositoryImpl } from "../infrastructure/repositories/quoteRepositoryImpl.ts";
import { AddQuoteDomainUseCase } from "../domain/useCases/addQuote.ts";
import { AddQuoteUseCase } from "../application/useCases/addQuote.ts";
import { TYPES } from "./tokens.ts";

import { Container } from "inversify";

const myContainer = new Container();
async function setupContainer() {
  const kvInstance = await KV.create(); // KV instanciation is asynchronous
  myContainer.bind<KV>(TYPES.KV).toConstantValue(kvInstance);
}

await setupContainer();

myContainer.bind<AddQuoteUseCase>(TYPES.AddQuoteUseCase).to(AddQuoteUseCase);
myContainer.bind<AddQuoteDomainUseCase>(TYPES.AddQuoteDomainUseCase).to(
  AddQuoteDomainUseCase,
);
myContainer.bind<QuoteRepository>(TYPES.QuoteRepository).to(
  QuoteRepositoryImpl,
);

export { myContainer };
