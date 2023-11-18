const { verifyImageURL } = require('verify-image-url');
const request = require('supertest');
const app = require('../index'); // assuming your app is exported from app.js


test('Verificar se foto existe', async () => {
    const img1 =await verifyImageURL("sdasd")
    const img2 = await verifyImageURL("https://res.cloudinary.com/dr2x19yhh/image/upload/v1681211694/foto-padrao.jpg.jpg")
    expect(img1.isImage).toBe(false)
    expect(img2.isImage).toBe(true)

})

describe('PUT /api/usuarios', () => {
    it('Tenta atualizar o user com uma foto inválida', async () => {
      const nusuario = 1; // replace with a valid user ID
      const fotoURL = 'https://example.com/example.jpg'; // replace with a valid photo URL
      const isImage = verifyImageURL(fotoURL).isImage;
      const requestBody = {
        Foto: fotoURL,
      };
      const response = await request(app)
        .put(`/api/usuarios/${nusuario}`)
        .send(requestBody);
      if (isImage) {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Usuário atualizado com sucesso!');
      } else {
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      }
    });
  });