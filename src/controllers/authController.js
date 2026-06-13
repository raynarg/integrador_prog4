// ============================================================
//  src/controllers/authController.js
//  Capa de Controlador — HTTP handlers del módulo de Autenticación
//
//  Responsabilidades:
//    · Extraer nombre_usuario y contrasenia del body del request
//    · Delegar la verificación al servicio de auth
//    · Retornar 200 con el token si el login es exitoso
//    · Propagar errores al errorHandler global con next(error)
// ============================================================

import * as authService from '../services/authService.js';

// ─────────────────────────────────────────────────────────────
//  POST /api/v1/auth/login
// ─────────────────────────────────────────────────────────────
/**
 * Recibe credenciales, delega al servicio y retorna el JWT si son válidas.
 *
 * @param {Object} req                      - Express request
 * @param {Object} req.body                 - Body de la petición (validado por express-validator)
 * @param {string} req.body.nombre_usuario  - Nombre de usuario
 * @param {string} req.body.contrasenia     - Contraseña en texto plano
 * @param {Object} res                      - Express response
 * @param {Function} next                   - Propaga errores al errorHandler global
 * @returns {200} { success: true, token: string, usuario: object }
 */
export async function cambiarContrasenia(req, res, next) {
    try {
        const { contrasenia_actual, contrasenia_nueva } = req.body;
        await authService.cambiarContrasenia(req.user.id, contrasenia_actual, contrasenia_nueva);
        res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        // Extraer las credenciales del body (ya validadas por express-validator en las rutas)
        const { nombre_usuario, contrasenia } = req.body;

        // Delegar al servicio: verifica contraseña, genera y retorna el JWT
        const resultado = await authService.login(nombre_usuario, contrasenia);

        // Si llegamos aquí, las credenciales son válidas → responder con el token
        res.status(200).json({ success: true, ...resultado });
    } catch (error) {
        // El servicio lanza errores con statusCode (401 si credenciales inválidas)
        // El errorHandler global los captura y retorna la respuesta correcta
        next(error);
    }
}
