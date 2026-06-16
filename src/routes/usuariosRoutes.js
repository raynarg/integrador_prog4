// ============================================================
//  src/routes/usuariosRoutes.js
//  Rutas BREAD para la gestión de usuarios administrativos.
//  Acceso restringido a token JWT válido + usuario 'admin'.
// ============================================================

import { Router } from 'express';
import * as ctrl from '../controllers/usuariosController.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id_usuario:
 *           type: integer
 *           description: ID autogenerado del usuario
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         apellido:
 *           type: string
 *           description: Apellido del usuario
 *         nombre_usuario:
 *           type: string
 *           description: Nombre de usuario único
 *       example:
 *         id_usuario: 1
 *         nombre: "Admin"
 *         apellido: "Sistemas"
 *         nombre_usuario: "admin"
 * 
 *     UsuarioInput:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - nombre_usuario
 *         - contrasenia
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         apellido:
 *           type: string
 *           description: Apellido del usuario
 *         nombre_usuario:
 *           type: string
 *           description: Nombre de usuario único
 *         contrasenia:
 *           type: string
 *           description: Contraseña del usuario (mínimo 4 caracteres)
 *       example:
 *         nombre: "Juan"
 *         apellido: "Perez"
 *         nombre_usuario: "jperez"
 *         contrasenia: "perez123"
 * 
 *     UsuarioUpdate:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - nombre_usuario
 *       properties:
 *         nombre:
 *           type: string
 *         apellido:
 *           type: string
 *         nombre_usuario:
 *           type: string
 *       example:
 *         nombre: "Juan"
 *         apellido: "Perez Gomez"
 *         nombre_usuario: "jgomez"
 */

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Rutas de gestión de usuarios (solo administradores)
 */



/**
 * @swagger
 * /api/v1/usuarios:
 *   get:
 *     summary: Obtener la lista de usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido (requiere rol admin)
 */
router.get('/', ctrl.listar);

/**
 * @swagger
 * /api/v1/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario administrativo
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Campos inválidos o faltantes, o nombre de usuario ya en uso
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido (requiere rol admin)
 */
router.post('/', ctrl.crear);

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario existente
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioUpdate'
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Campos inválidos o nombre de usuario ya en uso
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido (requiere rol admin)
 *       404:
 *         description: Usuario no encontrado o inactivo
 */
router.put('/:id', ctrl.actualizar);

/**
 * @swagger
 * /api/v1/usuarios/{id}/password:
 *   put:
 *     summary: Restablecer la contraseña de un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [contrasenia_nueva]
 *             properties:
 *               contrasenia_nueva:
 *                 type: string
 *                 description: Nueva contraseña para el usuario (mínimo 4 caracteres)
 *                 example: "nuevaPassword123"
 *     responses:
 *       200:
 *         description: Contraseña restablecida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Contraseña actualizada correctamente"
 *       400:
 *         description: Contraseña nueva inválida o demasiado corta
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido (requiere rol admin)
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id/password', ctrl.resetPassword);

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *   delete:
 *     summary: Dar de baja un usuario (desactivar)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a dar de baja
 *     responses:
 *       200:
 *         description: Usuario dado de baja con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuario dado de baja correctamente"
 *       400:
 *         description: Intento de desactivarse a sí mismo
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido (requiere rol admin)
 *       404:
 *         description: Usuario no encontrado o ya desactivado
 */
router.delete('/:id', ctrl.desactivar);

export default router;
