// ============================================================
//  src/routes/usuariosRoutes.js
//  Rutas BREAD para la gestión de usuarios administrativos.
//  Acceso restringido a token JWT válido + usuario 'admin'.
// ============================================================

import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import * as ctrl from '../controllers/usuariosController.js';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/', ctrl.listar);
router.post('/', ctrl.crear);
router.put('/:id', ctrl.actualizar);
router.put('/:id/password', ctrl.resetPassword);
router.delete('/:id', ctrl.desactivar);

export default router;
