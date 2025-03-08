import { Router } from 'express';
import {
  createApp,
  getApps,
  getAppById,
  updateApp,
  deleteApp,
} from '../controllers/appsController';

const router = Router();

/**
 * @swagger
 * /apps:
 *   post:
 *     summary: Create a new app.
 *     tags:
 *       - Apps
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: App created successfully.
 *       400:
 *         description: Name is missing.
 *       500:
 *         description: Server error.
 */
router.post('/', createApp);

/**
 * @swagger
 * /apps:
 *   get:
 *     summary: Retrieve all apps.
 *     tags:
 *       - Apps
 *     responses:
 *       200:
 *         description: A list of apps.
 *       500:
 *         description: Server error.
 */
router.get('/', getApps);

/**
 * @swagger
 * /apps/{id}:
 *   get:
 *     summary: Retrieve an app by its ID.
 *     tags:
 *       - Apps
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: App ID.
 *     responses:
 *       200:
 *         description: App details.
 *       404:
 *         description: App not found.
 *       500:
 *         description: Server error.
 */
router.get('/:id', getAppById);

/**
 * @swagger
 * /apps/{id}:
 *   put:
 *     summary: Update an existing app.
 *     tags:
 *       - Apps
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: App ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: App updated successfully.
 *       400:
 *         description: Name is missing.
 *       404:
 *         description: App not found.
 *       500:
 *         description: Server error.
 */
router.put('/:id', updateApp);

/**
 * @swagger
 * /apps/{id}:
 *   delete:
 *     summary: Delete an app by its ID.
 *     tags:
 *       - Apps
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: App ID.
 *     responses:
 *       200:
 *         description: App deleted successfully.
 *       404:
 *         description: App not found.
 *       500:
 *         description: Server error.
 */
router.delete('/:id', deleteApp);

export default router;
