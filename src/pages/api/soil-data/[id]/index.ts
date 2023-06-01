import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { soilDataValidationSchema } from 'validationSchema/soil-data';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.soil_data
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getSoilDataById();
    case 'PUT':
      return updateSoilDataById();
    case 'DELETE':
      return deleteSoilDataById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSoilDataById() {
    const data = await prisma.soil_data.findFirst(convertQueryToPrismaUtil(req.query, 'soil_data'));
    return res.status(200).json(data);
  }

  async function updateSoilDataById() {
    await soilDataValidationSchema.validate(req.body);
    const data = await prisma.soil_data.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteSoilDataById() {
    const data = await prisma.soil_data.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
