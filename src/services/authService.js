// ============================================================
//  src/services/authService.js
//  Capa de Servicio — Lógica de negocio de autenticación
//
//  Responsabilidades:
//    · Verificar que el usuario exista en la BD
//    · Comparar la contraseña ingresada con el hash almacenado
//    · Generar y retornar el token JWT si las credenciales son válidas
//    · Lanzar errores HTTP-aware (con statusCode) para que el errorHandler
//      los capture y responda con el código correcto
// ============================================================

import bcrypt from 'bcryptjs';  // para comparar contraseña plana vs hash almacenado
import jwt from 'jsonwebtoken'; // para firmar el token JWT
import * as usuariosRepository from '../repositories/usuariosRepository.js';

// ─────────────────────────────────────────────────────────────
//  login — verifica credenciales y retorna el token JWT
// ─────────────────────────────────────────────────────────────
/**
 * Valida usuario y contraseña. Si son correctos, devuelve un JWT.
 *
 * @param {string} nombre_usuario - Nombre de usuario ingresado en el formulario
 * @param {string} contrasenia    - Contraseña en texto plano ingresada en el formulario
 * @returns {Promise<{ token: string, usuario: object }>}
 * @throws {Error} 401 si el usuario no existe o la contraseña es incorrecta
 */
export async function login(nombre_usuario, contrasenia) {
    // 1. Buscar el usuario en la BD por su nombre de usuario
    const usuario = await usuariosRepository.findByUsername(nombre_usuario);

    // Usamos el mismo mensaje tanto si el usuario no existe como si la contraseña
    // es incorrecta, para no revelar cuál de los dos falló (seguridad)
    if (!usuario) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401; // Unauthorized
        throw error;
    }

    // 2. Comparar la contraseña ingresada con el hash guardado en la BD
    //    bcrypt.compare hace la comparación de forma segura (tiempo constante)
    const passwordValida = await bcrypt.compare(contrasenia, usuario.contrasenia);

    if (!passwordValida) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401; // mismo mensaje, sin revelar qué falló
        throw error;
    }

    // 3. Construir el payload que irá dentro del token JWT
    //    No incluir datos sensibles (contraseña, etc.)
    const payload = {
        id: usuario.id_usuario,       // identificador del usuario (usado como id_usuario_modificacion)
        nombre: usuario.nombre,        // para mostrar en la UI
        apellido: usuario.apellido,    // para mostrar en la UI
        nombre_usuario: usuario.nombre_usuario // para mostrar en la UI
    };

    // 4. Firmar el token con la clave secreta del .env
    //    expiresIn: el token expira en 8 horas (una jornada laboral)
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    // 5. Retornar el token y los datos del usuario (sin contraseña)
    return { token, usuario: payload };
}
