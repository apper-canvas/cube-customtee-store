import filterData from "@/services/mockData/filters.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const filterService = {
  async getFilters() {
    await delay(250);
    return { ...filterData };
  }
};