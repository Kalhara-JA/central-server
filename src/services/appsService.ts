import prisma from '../lib/prisma';

export const createAppService = async (name: string) => {
  console.log('[createAppService] Creating app with name:', name);
  const app = await prisma.app.create({
    data: { name },
  });
  console.log('[createAppService] App created successfully with id:', app.id);
  return app;
};

export const getAppsService = async () => {
  console.log('[getAppsService] Retrieving all apps');
  const apps = await prisma.app.findMany();
  console.log(`[getAppsService] Retrieved ${apps.length} apps`);
  return apps;
};

export const getAppByIdService = async (id: string) => {
  console.log('[getAppByIdService] Retrieving app with id:', id);
  const app = await prisma.app.findUnique({
    where: { id },
  });
  if (app) {
    console.log('[getAppByIdService] App found with id:', app.id);
  } else {
    console.warn('[getAppByIdService] No app found with id:', id);
  }
  return app;
};

export const updateAppService = async (id: string, name: string) => {
  console.log('[updateAppService] Updating app with id:', id, 'to new name:', name);
  const app = await prisma.app.update({
    where: { id },
    data: { name },
  });
  console.log('[updateAppService] App updated successfully with id:', app.id);
  return app;
};

export const deleteAppService = async (id: string) => {
  console.log('[deleteAppService] Deleting app with id:', id);
  const app = await prisma.app.delete({
    where: { id },
  });
  console.log('[deleteAppService] App deleted successfully with id:', id);
  return app;
};
