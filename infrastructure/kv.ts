import { injectable } from "inversify";
import { keys } from "./utils/environmentVariables.ts";

@injectable()
class KV {
  private _kv: Deno.Kv | null = null;
  private _access_token: string | undefined | null;
  constructor() {
    this._access_token = Deno.env.get("DENO_KV_ACCESS_TOKEN") || undefined;
  }

  static async create(): Promise<KV> {
    const instance = new KV();
    const accessToken = instance._access_token;
    const kvUrl = Deno.env.get("DENO_KV_URL");

    if (
      !accessToken && Deno.env.get(
          keys
            .RUNTIME_ENVIRONMENT,
        ) === "development"
    ) {
      throw new Error("Missing access token 💋");
    }

    // If KV URL is provided, use it; otherwise use default (local or remote based on env)
    instance._kv = kvUrl
      ? await Deno.openKv(kvUrl)
      : await Deno.openKv();

    return instance;
  }

  getInstance(): Deno.Kv {
    if (!this._kv) {
      throw new Error("KV instance not initialized");
    }
    return this._kv;
  }

  async get<T>(
    { key, identifier }: { key: string; identifier: string },
  ): Promise<Deno.KvEntryMaybe<T>> {
    if (!this._kv) {
      throw new Error("KV instance not initialized");
    }
    return await this._kv.get([key, identifier]);
  }

  async post<T>(
    { key, value, identifier }: {
      key: string;
      value: T;
      identifier: string;
    },
  ): Promise<string> {
    if (!this._kv) {
      throw new Error("KV instance not initialized");
    }
    const result = await this._kv.atomic().set([key, identifier], value)
      .commit();
    if (identifier && result.ok) {
      return identifier;
    }
    throw new Error("Something went wrong");
  }

  async iterator<T>(
    prefix: string,
  ): Promise<Deno.KvEntry<T>[]> {
    if (!this._kv) {
      throw new Error("KV instance not initialized");
    }

    const iter = this._kv.list<T>({ prefix: [prefix] });
    const result = [];
    for await (const res of iter) {
      result.push(res);
    }
    return result;
  }
}

export { KV };
