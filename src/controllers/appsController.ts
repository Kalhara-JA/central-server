import { Request, Response, NextFunction, RequestHandler } from 'express';
import {
    createAppService,
    getAppsService,
    getAppByIdService,
    updateAppService,
    deleteAppService,
} from '../services/appsService';

export const createApp: RequestHandler = async (req, res, next) => {
    console.log('[createApp] Request received:', req.method, req.originalUrl);
    const { name } = req.body;

    if (!name) {
        console.warn('[createApp] Missing "name" in request body.');
        res.status(400).json({ message: 'Name is required.' });
        return;
    }

    try {
        console.log('[createApp] Creating app with name:', name);
        const app = await createAppService(name);
        console.log('[createApp] App created successfully with ID:', app.id);
        res.status(201).json(app);
    } catch (error) {
        console.error('[createApp] Error creating app with name:', name, error);
        next(error);
    }
};

export const getApps: RequestHandler = async (req, res, next) => {
    console.log('[getApps] Request received:', req.method, req.originalUrl);
    try {
        console.log('[getApps] Retrieving all apps.');
        const apps = await getAppsService();
        console.log('[getApps] Retrieved', apps.length, 'apps.');
        res.status(200).json(apps);
    } catch (error) {
        console.error('[getApps] Error retrieving apps:', error);
        next(error);
    }
};

export const getAppById: RequestHandler = async (req, res, next) => {
    console.log('[getAppById] Request received:', req.method, req.originalUrl);
    const { id } = req.params;

    try {
        console.log('[getAppById] Retrieving app with ID:', id);
        const app = await getAppByIdService(id);
        if (!app) {
            console.warn('[getAppById] App not found with ID:', id);
            res.status(404).json({ message: 'App not found.' });
            return;
        }
        console.log('[getAppById] App retrieved successfully with ID:', id);
        res.status(200).json(app);
    } catch (error) {
        console.error('[getAppById] Error retrieving app with ID:', id, error);
        next(error);
    }
};

export const updateApp: RequestHandler = async (req, res, next) => {
    console.log('[updateApp] Request received:', req.method, req.originalUrl);
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        console.warn('[updateApp] Missing "name" in request body.');
        res.status(400).json({ message: 'Name is required.' });
        return;
    }

    try {
        console.log('[updateApp] Updating app with ID:', id, 'to new name:', name);
        const app = await updateAppService(id, name);
        console.log('[updateApp] App updated successfully with ID:', id);
        res.status(200).json(app);
    } catch (error) {
        console.error('[updateApp] Error updating app with ID:', id, error);
        next(error);
    }
};

export const deleteApp: RequestHandler = async (req, res, next) => {
    console.log('[deleteApp] Request received:', req.method, req.originalUrl);
    const { id } = req.params;

    try {
        console.log('[deleteApp] Deleting app with ID:', id);
        await deleteAppService(id);
        console.log('[deleteApp] App deleted successfully with ID:', id);
        res.status(200).json({ message: 'App deleted successfully.' });
    } catch (error) {
        console.error('[deleteApp] Error deleting app with ID:', id, error);
        next(error);
    }
};
