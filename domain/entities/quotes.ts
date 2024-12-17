import crypto from "node:crypto";

const SECRET = "blaisepascal";

export interface QuoteDTO {
  id?: string;
  content: string;
  author?: string | null;
  source?: string | null;
  tags: Array<string> | null;
}

export class QuoteEntity {
  _id: string | undefined;
  _content: string;
  _author: string | null;
  _source: string | null;
  _tags: Array<string> | null;

  constructor(quote: QuoteDTO) {
    if (!quote.content || quote.content.trim() === "") {
      throw new Error("Quote content cannot be empty.");
    }
    this._id = quote.id;
    this._content = quote.content;
    this._author = quote.author || null;
    this._source = quote.source || null;
    this._tags = quote.tags || null;
  }

  getIdentifier(): QuoteEntity["_id"] {
    return this._id;
  }

  getAuthor(): QuoteEntity["_author"] {
    return this._author;
  }

  getSource(): QuoteEntity["_source"] {
    return this._source;
  }

  getContent(): QuoteEntity["_content"] {
    return this._content;
  }
  getTags(): QuoteEntity["_tags"] {
    return this._tags;
  }

  static generateUniqueQuoteId(
    q: QuoteEntity,
  ): string {
    const combinedString = `${q.getAuthor()}${q.getTags()}${q.getContent()}`;

    const hash = crypto.createHmac("sha256", SECRET).update(combinedString)
      .digest("hex");

    return hash;
  }
}
