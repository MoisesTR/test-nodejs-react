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
        const requestId = parseInt(id);

        const request = await prisma.request.findUnique({
            where: { id: requestId },
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

        // Check if employee exists
        const employee = await prisma.employee.findUnique({
            where: { id: parseInt(employeeId) }
        });

        if (!employee) {
            return res.status(400).json({
                success: false,
                error: { message: 'Employee not found' }
            });
        }

        // Check for duplicate code
        const existingRequest = await prisma.request.findUnique({
            where: { code }
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                error: { message: 'Request code already exists' }
            });
        }

        // Check permissions - only admins can create requests
        if (req.user.role !== 'administrator') {
            return res.status(403).json({
                success: false,
                error: { message: 'Insufficient permissions' }
            });
        }

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
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                error: { message: 'Request code already exists' }
            });
        }
        res.status(500).json({ success: false, error: { message: 'Failed to create request' } });
    }
};

const deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const requestId = parseInt(id);

        // Check if request exists
        const existingRequest = await prisma.request.findUnique({
            where: { id: requestId }
        });

        if (!existingRequest) {
            return res.status(404).json({
                success: false,
                error: { message: 'Request not found' }
            });
        }

        await prisma.request.delete({ where: { id: requestId } });
        res.json({ success: true, data: { message: 'Request deleted' } });
    } catch (error) {
        console.error('Delete request error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                error: { message: 'Request not found' }
            });
        }
        res.status(500).json({ success: false, error: { message: 'Failed to delete request' } });
    }
};

module.exports = {
    getRequests,
    getRequest,
    createRequest,
    deleteRequest
};