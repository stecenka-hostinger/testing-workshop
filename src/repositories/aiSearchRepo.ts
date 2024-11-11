export default {
  getAISearch({
    params,
  }: {
    params: { query: string; limit?: number };
  }): Promise<[{ data: { documents: [] } }, any]> {
    // mock API return
    return new Promise((res) => setTimeout(res, 1000));
  },
};
