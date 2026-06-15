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
 * components:
 *   schemas:
 *     Inscripcion:
 *       type: object
 *       properties:
 *         id_inscripcion:
 *           type: integer
 *           description: ID autogenerado de la inscripción
 *         id_estudiante:
 *           type: integer
 *           description: ID del estudiante inscripto
 *         id_curso:
 *           type: integer
 *           description: ID del curso inscripto
 *         fecha_inscripcion:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la inscripción
 *         estudiante:
 *           type: object
 *           properties:
 *             apellido:
 *               type: string
 *             nombres:
 *               type: string
 *             documento:
 *               type: string
 *             email:
 *               type: string
 *         curso:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             cantidadHoras:
 *               type: integer
 *             fechaInicio:
 *               type: string
 *               format: date
 *       example:
 *         id_inscripcion: 1
 *         id_estudiante: 1
 *         id_curso: 1
 *         fecha_inscripcion: "2026-06-15T01:10:00Z"
 *         estudiante:
 *           apellido: "Gomez"
 *           nombres: "Ana"
 *           documento: "38123456"
 *           email: "ana.gomez@gmail.com"
 *         curso:
 *           nombre: "Programación Web con Node.js"
 *           cantidadHoras: 40
 *           fechaInicio: "2026-06-01"
 * 
 *     InscripcionInput:
 *       type: object
 *       required:
 *         - id_estudiante
 *         - id_curso
 *       properties:
 *         id_estudiante:
 *           type: integer
 *           description: ID del estudiante a inscribir
 *         id_curso:
 *           type: integer
 *           description: ID del curso en el cual inscribir
 *         fecha_inscripcion:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la inscripción (opcional, default es el momento actual)
 *       example:
 *         id_estudiante: 1
 *         id_curso: 2
 *         fecha_inscripcion: "2026-06-15T01:10:00Z"
 */

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
 *     summary: Obtener lista de inscripciones con paginación y filtros
 *     tags: [Inscripciones]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Filtrar por coincidencia en nombre/apellido de estudiante o nombre de curso
 *       - in: query
 *         name: curso
 *         schema:
 *           type: integer
 *         description: Filtrar inscripciones pertenecientes a un ID de curso específico
 *     responses:
 *       200:
 *         description: Lista de inscripciones
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
 *                     $ref: '#/components/schemas/Inscripcion'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: No autorizado
 */
router.get('/', getInscripciones);

/**
 * @swagger
 * /api/v1/inscripciones/{id}:
 *   get:
 *     summary: Obtener una inscripción por ID
 *     tags: [Inscripciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la inscripción
 *     responses:
 *       200:
 *         description: Inscripción encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Inscripcion'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Inscripción no encontrada
 */
router.get('/:id', validarId, validate, getInscripcionById);

/**
 * @swagger
 * /api/v1/inscripciones:
 *   post:
 *     summary: Crear una inscripción
 *     tags: [Inscripciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InscripcionInput'
 *     responses:
 *       201:
 *         description: Inscripción creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Inscripcion'
 *       400:
 *         description: Datos de entrada inválidos, cupo superado o ya inscripto
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Estudiante o curso no encontrado / inactivo
 */
router.post('/', validarInscripcion, validate, createInscripcion);

/**
 * @swagger
 * /api/v1/inscripciones/{id}:
 *   delete:
 *     summary: Dar de baja una inscripción (borrado lógico)
 *     tags: [Inscripciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la inscripción a dar de baja
 *     responses:
 *       200:
 *         description: Inscripción dada de baja
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
 *                   example: "Inscripción dada de baja exitosamente"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Inscripción no encontrada
 */
router.delete('/:id', validarId, validate, deleteInscripcion);

export default router;
