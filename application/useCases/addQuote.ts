import { QuoteEntity } from "../../domain/entities/quotes.ts";
import { QuoteRepository } from "../../domain/repositories/quoteRepository.ts";
import { AddQuoteDomainUseCase } from "../../domain/useCases/addQuote.ts";

interface AddQuoteUseCaseInput {
  quote: QuoteEntity;
}

interface AddQuoteUseCaseOutput {
  id: QuoteEntity["_id"];
}

export class AddQuoteUseCase {
  private quoteRepository: QuoteRepository;
  private addQuoteDomainUseCase: AddQuoteDomainUseCase;

  constructor(quoteRepository: QuoteRepository) {
    this.quoteRepository = quoteRepository;
    this.addQuoteDomainUseCase = new AddQuoteDomainUseCase(quoteRepository);
  }

  async execute(input: AddQuoteUseCaseInput): Promise<AddQuoteUseCaseOutput> {
    // Create the QuoteEntity (validation occurs here)
    const newQuote = input.quote;

    // Fetch existing quotes from the repository
    const existingQuotes = await this.quoteRepository.getAllQuotes();

    // Validate the quote using the domain use case
    this.addQuoteDomainUseCase.isValidQuote(newQuote, existingQuotes);

    // Persist the quote using the repository
    await this.quoteRepository.addQuote(newQuote);

    // Return the identifier of the added quote
    return { id: newQuote._id };
  }
}
