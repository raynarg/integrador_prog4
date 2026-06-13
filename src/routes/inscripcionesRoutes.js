import { Router } from 'express';
import { validate } from '../middlewares/validateBody.js';
import { validarId, validarInscripcion } from '../middlewares/validators.js';
import {
    getInscripciones,
    getInscripcionById,
    createInscripcion,
    deleteInscripcion
} from '../controllers/inscripcionesController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Inscripciones
 *   description: Gestión de inscripciones a cursos
 */

/**
 * @swagger
 * /api/v1/inscripciones:
 *   get:
 *     summary: Obtener lista de inscripciones
 *     tags: [Inscripciones]
 *     responses:
 *       200:
 *         description: Lista de inscripciones
 */
router.get('/', getInscripciones);

/**
 * @swagger
 * /api/v1/inscripciones/{id}:
 *   get:
 *     summary: Obtener una inscripción por ID
 *     tags: [Inscripciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inscripción encontrada
 */
router.get('/:id', validarId, validate, getInscripcionById);

/**
 * @swagger
 * /api/v1/inscripciones:
 *   post:
 *     summary: Crear una inscripción
 *     tags: [Inscripciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_estudiante:
 *                 type: integer
 *               id_curso:
 *                 type: integer
 *               fecha_inscripcion:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Inscripción creada
 */
router.post('/', validarInscripcion, validate, createInscripcion);

/**
 * @swagger
 * /api/v1/inscripciones/{id}:
 *   delete:
 *     summary: Dar de baja una inscripción (borrado lógico)
 *     tags: [Inscripciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inscripción dada de baja
 */
router.delete('/:id', validarId, validate, deleteInscripcion);

export default router;
