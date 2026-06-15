import { Router } from 'express';
import { validate } from '../middlewares/validateBody.js';
import { validarId, validarEstudiante } from '../middlewares/validators.js';
import * as ctrl from '../controllers/estudiantesController.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Estudiante:
 *       type: object
 *       properties:
 *         id_estudiante:
 *           type: integer
 *           description: ID autogenerado del estudiante
 *         documento:
 *           type: string
 *           description: Documento de identidad (mín 7, máx 20 caracteres)
 *         nombres:
 *           type: string
 *           description: Nombres del estudiante (máx 100 caracteres)
 *         apellido:
 *           type: string
 *           description: Apellido del estudiante (máx 100 caracteres)
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico (máx 150 caracteres)
 *         fecha_nacimiento:
 *           type: string
 *           format: date
 *           description: Fecha de nacimiento (YYYY-MM-DD)
 *         activo:
 *           type: integer
 *           description: Estado del estudiante (1 activo, 0 inactivo)
 *         id_usuario_modificacion:
 *           type: integer
 *           description: ID del usuario que realizó la última modificación
 *         fecha_hora_modificacion:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la última modificación
 *       example:
 *         id_estudiante: 1
 *         documento: "38123456"
 *         nombres: "Ana"
 *         apellido: "Gomez"
 *         email: "ana.gomez@gmail.com"
 *         fecha_nacimiento: "1998-05-15"
 *         activo: 1
 *         id_usuario_modificacion: 1
 *         fecha_hora_modificacion: "2026-06-15T01:10:00.000Z"
 * 
 *     EstudianteInput:
 *       type: object
 *       required:
 *         - documento
 *         - nombres
 *         - apellido
 *         - email
 *         - fecha_nacimiento
 *       properties:
 *         documento:
 *           type: string
 *           description: Documento de identidad (mín 7, máx 20 caracteres)
 *         nombres:
 *           type: string
 *           description: Nombres del estudiante (máx 100 caracteres)
 *         apellido:
 *           type: string
 *           description: Apellido del estudiante (máx 100 caracteres)
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico (máx 150 caracteres)
 *         fecha_nacimiento:
 *           type: string
 *           format: date
 *           description: Fecha de nacimiento (YYYY-MM-DD)
 *       example:
 *         documento: "38123456"
 *         nombres: "Ana"
 *         apellido: "Gomez"
 *         email: "ana.gomez@gmail.com"
 *         fecha_nacimiento: "1998-05-15"
 */

/**
 * @swagger
 * tags:
 *   name: Estudiantes
 *   description: Gestión de estudiantes
 */

/**
 * @swagger
 * /api/v1/estudiantes:
 *   get:
 *     summary: Obtener lista de estudiantes con paginación y filtros
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de registros por página (máx 100)
 *       - in: query
 *         name: documento
 *         schema:
 *           type: string
 *         description: Filtrar por documento (coincidencia exacta)
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Filtrar por nombre o apellido (coincidencia parcial)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email (coincidencia parcial)
 *       - in: query
 *         name: activo
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         description: Filtrar por estado de actividad (1 activo, 0 inactivo)
 *     responses:
 *       200:
 *         description: Lista de estudiantes
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
 *                     $ref: '#/components/schemas/Estudiante'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 1
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     hasNext:
 *                       type: boolean
 *                       example: false
 *                     hasPrev:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: No autorizado
 */
router.get('/', ctrl.getEstudiantes);

/**
 * @swagger
 * /api/v1/estudiantes/{id}:
 *   get:
 *     summary: Obtener un estudiante por ID
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estudiante
 *     responses:
 *       200:
 *         description: Estudiante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Estudiante'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Estudiante no encontrado
 */
router.get('/:id', validarId, validate, ctrl.getEstudianteById);

/**
 * @swagger
 * /api/v1/estudiantes:
 *   post:
 *     summary: Crear un estudiante
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EstudianteInput'
 *     responses:
 *       201:
 *         description: Estudiante creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Estudiante'
 *       400:
 *         description: Datos de entrada inválidos o documento duplicado
 *       401:
 *         description: No autorizado
 */
router.post('/', validarEstudiante, validate, ctrl.createEstudiante);

/**
 * @swagger
 * /api/v1/estudiantes/{id}:
 *   put:
 *     summary: Actualizar un estudiante
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estudiante a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EstudianteInput'
 *     responses:
 *       200:
 *         description: Estudiante actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Estudiante'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Estudiante no encontrado o inactivo
 */
router.put('/:id', validarId, validarEstudiante, validate, ctrl.updateEstudiante);

/**
 * @swagger
 * /api/v1/estudiantes/{id}:
 *   delete:
 *     summary: Dar de baja un estudiante (borrado lógico)
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estudiante a dar de baja
 *     responses:
 *       200:
 *         description: Estudiante dado de baja
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
 *                   example: "Estudiante 1 dado de baja."
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Estudiante no encontrado
 */
router.delete('/:id', validarId, validate, ctrl.deleteEstudiante);

export default router;
