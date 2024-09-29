import express, {Request, Response} from 'express';
const router = express.Router();
import authMiddleware from '../middlewares/authUser';

// This route is only accessible to authenticated users who are admins
router.get('/', authMiddleware.authUserSecured, authMiddleware.isAdmin, (req, res) => {
    res.send('Admin is valid.');
});

export default router;