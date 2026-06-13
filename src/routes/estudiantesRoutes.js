import { Router } from 'express';
import { validate } from '../middlewares/validateBody.js';
import { validarId, validarEstudiante } from '../middlewares/validators.js';
import * as ctrl from '../controllers/estudiantesController.js';

const router = Router();


router.get('/', ctrl.getEstudiantes);
router.get('/:id', validarId, validate, ctrl.getEstudianteById);
router.post('/', validarEstudiante, validate, ctrl.createEstudiante);
router.put('/:id', validarId, validarEstudiante, validate, ctrl.updateEstudiante);
router.delete('/:id', validarId, validate, ctrl.deleteEstudiante);

export default router;
