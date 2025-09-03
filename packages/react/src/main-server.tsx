import { renderToString } from "react-dom/server";
import { App } from "./App";

export const render = async (url: string, query: Record<string, string>) => {
  console.log(url, query);

  const html = renderToString(<App />);

  return { html };
};
