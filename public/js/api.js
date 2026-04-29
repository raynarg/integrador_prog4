// Esqueleto de API wrapper para frontend.
// Usa `API.useMock = true` para cargar `public/data/mock-cursos.json`.

window.API = window.API || {
  useMock: true,

  async getAll() {
    if (this.useMock) {
      const res = await fetch('./data/mock-cursos.json');
      if (!res.ok) throw new Error(`HTTP ${res.status} fetching mock data`);
      return res.json();
    }
    return fetch('/api/cursos').then(r => r.json());
  },

  async getById(id) {
    if (this.useMock) {
      const all = await this.getAll();
      return all.find(c => c.id_curso === Number(id)) || null;
    }
    return fetch(`/api/cursos/${id}`).then(r => r.json());
  },

  // Los métodos siguientes son stubs para implementar cuando tengas backend.
  async create(obj) { return Promise.resolve(null); },
  async update(id, obj) { return Promise.resolve(null); },
  async remove(id) { return Promise.resolve(null); }
};
