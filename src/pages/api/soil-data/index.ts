import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { soilDataValidationSchema } from 'validationSchema/soil-data';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getSoilData();
    case 'POST':
      return createSoilData();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSoilData() {
    const data = await prisma.soil_data
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'soil_data'));
    return res.status(200).json(data);
  }

  async function createSoilData() {
    await soilDataValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.soil_data.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
