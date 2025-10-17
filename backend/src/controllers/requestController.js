const { PrismaClient } = require('@prisma/client');
const { getPaginatedData } = require('../utils/pagination');

const prisma = new PrismaClient();

const getRequests = async (req, res) => {
    try {
        const result = await getPaginatedData(
            req,
            (params) => prisma.request.findMany({
                ...params,
                include: {
                    employee: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }),
            () => prisma.request.count(),
            {
                defaultLimit: 10,
                maxLimit: 50,
                defaultOrderBy: { createdAt: 'desc' }
            }
        );

        res.json({ 
            success: true, 
            data: { 
                requests: result.data,
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages,
                hasNext: result.hasNext,
                hasPrev: result.hasPrev
            } 
        });
    } catch (error) {
        console.error('Get requests error:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to fetch requests' } });
    }
};

const getRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await prisma.request.findUnique({
            where: { id: parseInt(id) },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        if (!request) {
            return res.status(404).json({ success: false, error: { message: 'Request not found' } });
        }

        res.json({ success: true, data: { request } });
    } catch (error) {
        console.error('Get request error:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to fetch request' } });
    }
};

const createRequest = async (req, res) => {
    try {
        const { code, description, summary, employeeId } = req.body;

        const request = await prisma.request.create({
            data: {
                code,
                description,
                summary,
                employeeId: parseInt(employeeId)
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.status(201).json({ success: true, data: { request } });
    } catch (error) {
        console.error('Create request error:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to create request' } });
    }
};

const deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.request.delete({ where: { id: parseInt(id) } });
        res.json({ success: true, data: { message: 'Request deleted' } });
    } catch (error) {
        console.error('Delete request error:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to delete request' } });
    }
};

module.exports = {
    getRequests,
    getRequest,
    createRequest,
    deleteRequest
};