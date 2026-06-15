// ============================================================
//  src/routes/cursosRoutes.js
//  Capa de Rutas — Definición de endpoints del módulo Cursos
//
//  Responsabilidades de esta capa:
//    · Declarar las rutas HTTP y asociarlas a sus controladores
//    · Definir las reglas de validación de entrada (express-validator)
//    · Aplicar el middleware validate() para cortar el pipeline si hay errores
//
//  Esta capa NO maneja lógica de negocio ni accede a servicios directamente.
// ============================================================

import { Router } from 'express';
import { validate } from '../middlewares/validateBody.js';
import { validarId, validarCurso } from '../middlewares/validators.js';
import * as ctrl from '../controllers/cursosController.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Curso:
 *       type: object
 *       required:
 *         - nombre
 *         - descripcion
 *         - fecha_inicio
 *         - cantidad_horas
 *         - inscriptos_max
 *         - id_curso_estado
 *       properties:
 *         id:
 *           type: integer
 *           description: El ID autogenerado del curso
 *         nombre:
 *           type: string
 *           description: Nombre del curso (máx 200 caracteres)
 *         descripcion:
 *           type: string
 *           description: Descripción detallada del curso
 *         fecha_inicio:
 *           type: string
 *           format: date
 *           description: Fecha de inicio del curso (YYYY-MM-DD)
 *         cantidad_horas:
 *           type: integer
 *           minimum: 1
 *           maximum: 500
 *           description: Duración total en horas
 *         inscriptos_max:
 *           type: integer
 *           minimum: 1
 *           description: Cantidad máxima de alumnos permitidos
 *         id_curso_estado:
 *           type: integer
 *           enum: [1, 2, 3]
 *           description: "Estado del curso: 1 (Borrador), 2 (Abierto), 3 (Cerrado)"
 *       example:
 *         nombre: "Programación Web con Node.js"
 *         descripcion: "Aprende a crear aplicaciones escalables con Express y PostgreSQL."
 *         fecha_inicio: "2026-06-01"
 *         cantidad_horas: 40
 *         inscriptos_max: 30
 *         id_curso_estado: 1
 */

/**
 * @swagger
 * tags:
 *   name: Cursos
 *   description: API para la gestión de cursos
 */

/**
 * @swagger
 * /api/v1/cursos:
 *   get:
 *     summary: Obtiene la lista de todos los cursos con paginación y filtros
 *     tags: [Cursos]
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
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Filtrar por nombre del curso (coincidencia parcial)
 *       - in: query
 *         name: id_curso_estado
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3]
 *         description: "Filtrar por estado del curso: 1 (Borrador), 2 (Abierto), 3 (Cerrado)"
 *     responses:
 *       200:
 *         description: Lista de cursos obtenida con éxito
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
 *                     $ref: '#/components/schemas/Curso'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 15
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 *                     hasNext:
 *                       type: boolean
 *                       example: true
 *                     hasPrev:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: No autorizado
 */
router.get('/',     ctrl.getCursos);

/**
 * @swagger
 * /api/v1/cursos/{id}:
 *   get:
 *     summary: Obtiene un curso por su ID
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Datos del curso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Curso'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Curso no encontrado
 */
router.get('/:id',  validarId, validate, ctrl.getCursoById);

/**
 * @swagger
 * /api/v1/cursos:
 *   post:
 *     summary: Crea un nuevo curso
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       201:
 *         description: Curso creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Curso'
 *       400:
 *         description: Error en los datos de entrada
 *       401:
 *         description: No autorizado
 */
router.post('/',    validarCurso, validate, ctrl.createCurso);

/**
 * @swagger
 * /api/v1/cursos/{id}:
 *   put:
 *     summary: Actualiza un curso existente
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       200:
 *         description: Curso actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Curso'
 *       400:
 *         description: Error en los datos de entrada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Curso no encontrado
 */
router.put('/:id',  validarId, validarCurso, validate, ctrl.updateCurso);

/**
 * @swagger
 * /api/v1/cursos/{id}:
 *   delete:
 *     summary: Elimina un curso (borrado lógico)
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Curso eliminado con éxito
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
 *                   example: "Curso 1 eliminado correctamente."
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Curso no encontrado
 */
router.delete('/:id', validarId, validate, ctrl.deleteCurso);

export default router;
