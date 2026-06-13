// ============================================================
//  src/routes/authRoutes.js
//  Capa de Rutas — Endpoints del módulo de Autenticación
//
//  Responsabilidades:
//    · Declarar las rutas de autenticación
//    · Definir reglas de validación del body con express-validator
//    · Aplicar el middleware validate() para rechazar requests inválidos
//
//  Esta ruta NO usa authMiddleware porque es pública:
//  el usuario aún no tiene token cuando hace login.
// ============================================================

import { Router } from 'express';
import { body } from 'express-validator'; // para definir reglas de validación
import { validate } from '../middlewares/validateBody.js'; // corta el pipeline si hay errores
import * as ctrl from '../controllers/authController.js';

const router = Router();

// Reglas de validación para el body del login
const validarLogin = [
    body('nombre_usuario')
        .trim()                      // quitar espacios al inicio y al final
        .notEmpty()                  // no puede estar vacío
        .withMessage('El nombre de usuario es requerido'),

    body('contrasenia')
        .notEmpty()                  // no puede estar vacío
        .withMessage('La contraseña es requerida')
];

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre_usuario, contrasenia]
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 example: admin
 *               contrasenia:
 *                 type: string
 *                 example: "miContrasenia123"
 *     responses:
 *       200:
 *         description: Login exitoso — retorna el token JWT
 *       401:
 *         description: Credenciales inválidas
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post('/login', validarLogin, validate, ctrl.login); // POST /api/v1/auth/login

export default router;
