import productData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  async getAll() {
    await delay(300);
    return [...productData];
  },

  async getById(id) {
    await delay(200);
    const product = productData.find(p => p.Id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  async create(product) {
    await delay(400);
    const maxId = Math.max(...productData.map(p => p.Id));
    const newProduct = {
      ...product,
      Id: maxId + 1
    };
    productData.push(newProduct);
    return { ...newProduct };
  },

  async update(id, updates) {
    await delay(350);
    const index = productData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    productData[index] = { ...productData[index], ...updates };
    return { ...productData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = productData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    const deleted = productData.splice(index, 1)[0];
    return { ...deleted };
  }
};