class KV {
  private kv: Deno.Kv | null;

  constructor() {
    this.kv = null;
  }

  async init(): Promise<void> {
    this.kv = await Deno.openKv();
  }

  async get<T>(
    { key, identifier }: { key: string; identifier: string },
  ): Promise<Deno.KvEntryMaybe<T>> {
    if (!this.kv) {
      throw new Error("KV instance not initialized");
    }
    return await this.kv.get([key, identifier]);
  }

  async post<T>(
    { key, value, identifier }: {
      key: string;
      value: T;
      identifier: string;
    },
  ): Promise<string> {
    if (!this.kv) {
      throw new Error("KV instance not initialized");
    }
    const result = await this.kv.atomic().set([key, identifier], value)
      .commit();
    if (identifier && result.ok) {
      return identifier;
    }
    throw new Error("Something went wrong");
  }

  async iterator<T>(
    prefix: string,
  ): Promise<Deno.KvEntry<T>[]> {
    if (!this.kv) {
      throw new Error("KV instance not initialized");
    }

    const kv = await Deno.openKv();
    const iter = kv.list<T>({ prefix: [prefix] });
    const result = [];
    for await (const res of iter) result.push(res);
    return result;
  }
}

export { KV };
