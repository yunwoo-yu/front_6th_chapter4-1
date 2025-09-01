export const render = async (url, query) => {
  console.log({ url, query });
  return {
    html: "<div>안녕하세요</div>",
    head: "<title>안녕하세요</title>",
  };
};
