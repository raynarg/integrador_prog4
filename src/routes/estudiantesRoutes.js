import { Router } from 'express';
import { validate } from '../middlewares/validateBody.js';
import { validarId, validarEstudiante } from '../middlewares/validators.js';
import * as ctrl from '../controllers/estudiantesController.js';

const router = Router();

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
 *     summary: Obtener lista de estudiantes
 *     tags: [Estudiantes]
 *     responses:
 *       200:
 *         description: Lista de estudiantes
 */
router.get('/', ctrl.getEstudiantes);

/**
 * @swagger
 * /api/v1/estudiantes/{id}:
 *   get:
 *     summary: Obtener un estudiante por ID
 *     tags: [Estudiantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estudiante encontrado
 */
router.get('/:id', validarId, validate, ctrl.getEstudianteById);

/**
 * @swagger
 * /api/v1/estudiantes:
 *   post:
 *     summary: Crear un estudiante
 *     tags: [Estudiantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *               apellido:
 *                 type: string
 *               documento:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Estudiante creado
 */
router.post('/', validarEstudiante, validate, ctrl.createEstudiante);

/**
 * @swagger
 * /api/v1/estudiantes/{id}:
 *   put:
 *     summary: Actualizar un estudiante
 *     tags: [Estudiantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *               apellido:
 *                 type: string
 *               documento:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estudiante actualizado
 */
router.put('/:id', validarId, validarEstudiante, validate, ctrl.updateEstudiante);

/**
 * @swagger
 * /api/v1/estudiantes/{id}:
 *   delete:
 *     summary: Dar de baja un estudiante (borrado lógico)
 *     tags: [Estudiantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estudiante dado de baja
 */
router.delete('/:id', validarId, validate, ctrl.deleteEstudiante);

export default router;
