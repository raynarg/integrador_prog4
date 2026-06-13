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
import { validate } from '../middlewares/validateBody.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validarLogin, validarCambioContrasenia } from '../middlewares/validators.js';
import * as ctrl from '../controllers/authController.js';

const router = Router();

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
router.post('/login', validarLogin, validate, ctrl.login);

router.put('/password', authMiddleware, validarCambioContrasenia, validate, ctrl.cambiarContrasenia);

export default router;
