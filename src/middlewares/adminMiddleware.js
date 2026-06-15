// ============================================================
//  src/middlewares/adminMiddleware.js
//  Autoriza únicamente al usuario cuyo nombre_usuario sea 'admin'.
//  Debe aplicarse después de authMiddleware.
// ============================================================

export function adminMiddleware(req, res, next) {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';

    if (!req.user || req.user.nombre_usuario !== adminUsername) {
        return res.status(403).json({
            success: false,
            error: 'Acceso denegado: se requieren privilegios de administrador'
        });
    }
    next();
}
