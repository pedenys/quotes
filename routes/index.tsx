import { Handlers } from "$fresh/server.ts";
import { Fragment } from "preact/jsx-runtime";

export const handler: Handlers = {
  async GET(_req, ctx) {
    return await ctx.render();
  },
};

export default function Home() {
  return (
    <Fragment>
      <head>
        <meta http-equiv="refresh" content="0; url=quotes/add" />
      </head>
      <div class="px-4 py-8 mx-auto bg-[#86efac]">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <img
            class="my-6"
            src="/logo.svg"
            width="128"
            height="128"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
        </div>
      </div>
    </Fragment>
  );
}
