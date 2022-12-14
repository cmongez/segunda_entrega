const { promises: fs } = require('fs');

class ContenedorArchivo {
  constructor(ruta) {
    this.ruta = ruta;
  }
  //optimizar los metodos (por hacer)
  async save(objet) {
    let productLength = await this.getAll();
    if (productLength.length > 0) {
      try {
        let products = await this.getAll();
        let newLastItem = products[products.length - 1].id + 1;
        objet.id = newLastItem;
        objet.timestamp = Date.now();
        products.push(objet);
        await fs.writeFile(this.ruta, JSON.stringify(products));
        return objet.id;
      } catch (error) {
        throw new Error('Error al guardar en Save');
      }
    } else {
      objet.id = 1;
      objet.timestamp = Date.now();
      let newProduct = [];
      newProduct.push(objet);
      try {
        await fs.writeFile(this.ruta, JSON.stringify(newProduct));
        return objet.id;
      } catch (error) {
        throw new Error('Error al guardar en Save');
      }
    }
  }

  async getAll() {
    try {
      let products = await fs.readFile(this.ruta, 'utf-8');
      return JSON.parse(products);
    } catch (error) {
      return [];
    }
  }

  async getById(id) {
    const products = await this.getAll();
    let foundById = products.find((product) => product.id == id);
    return foundById;
  }

  async deleteById(id) {
    let products = await this.getAll();
    let productToDelete = products.findIndex((product) => product.id === id);
    products.splice(productToDelete, 1);
    await fs.writeFile(this.ruta, JSON.stringify(products));
  }

  async deleteAll() {
    await fs.unlink(this.ruta);
  }

  async actualizar(item, id) {
    const element = await this.getAll();
    let productToUpdate = element.findIndex((p) => p.id === id);
    element[productToUpdate] = item;

    await fs.writeFile(this.ruta, JSON.stringify(element));
  }
}

module.exports = ContenedorArchivo;
