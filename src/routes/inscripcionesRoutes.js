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


// BROWSE - Listar inscripciones (con paginación y filtros)
router.get('/', getInscripciones);

// READ - Obtener inscripción por ID
router.get('/:id', validarId, validate, getInscripcionById);

// ADD - Crear una nueva inscripción
router.post('/', validarInscripcion, validate, createInscripcion);

// DELETE - Dar de baja una inscripción
router.delete('/:id', validarId, validate, deleteInscripcion);

export default router;
