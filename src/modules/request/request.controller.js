import Request from './request.model.js';
import { isToken } from '../../helpers/tk-methods.js';
import { handleResponse } from '../../helpers/handle-resp.js';
import { logger } from '../../helpers/logger.js';
import { validateAdminRequest, validateUserRequest } from '../../helpers/controller-checks.js';
import { makeAdmin, makeUser } from './request.utils.js';

export const createRequest = async (req, res) => {
    logger.info('Start creating request');
    const user = await isToken(req, res);
    const { idCommunity, message } = req.body;
    await validateUserRequest(req, res);
    handleResponse(res, Request.create({ idUser: user._id, idCommunity, message }));
}

export const getAllRequests = async (req, res) => {
    logger.info('Start getting requests');
    await validateAdminRequest(req, res);
    handleResponse(res, Request.find());
}

export const getRequestsPending = async (req, res) => {
    logger.info('Start getting requests');
    await validateAdminRequest(req, res);
    handleResponse(res, Request.find({ status: 'Pending' }));
}

export const getRequestsAccepted = async (req, res) => {
    logger.info('Start getting requests');
    await validateAdminRequest(req, res);
    handleResponse(res, Request.find({ status: 'Accepted' }));
}

export const getRequestsRejected = async (req, res) => {
    logger.info('Start getting requests');
    await validateAdminRequest(req, res);
    handleResponse(res, Request.find({ status: 'Rejected' }));
}

export const acceptRequest = async (req, res) => {
    logger.info('Start accepting request');
    const { id } = req.params;
    await validateAdminRequest(req, res);
    const request = await Request.findById(id);
    if (!request) {
        logger.error('Request not found');
        return res.status(404).json({ message: 'Request not found' });
    }
    await makeAdmin(request.idUser, res);
    handleResponse(res, Request.findByIdAndUpdate(id, { status: 'Accepted' }, { new: true }));
}

export const rejectRequest = async (req, res) => {
    logger.info('Start rejecting request');
    const { id } = req.params;
    await validateAdminRequest(req, res);
    handleResponse(res, Request.findByIdAndUpdate(id, { status: 'Rejected' }, { new: true }));
}

export const pendingRequest = async (req, res) => {
    logger.info('Start pending request');
    const { id } = req.params;
    await validateAdminRequest(req, res);
    const request = await Request.findById(id);
    if (!request) {
        logger.error('Request not found');
        return res.status(404).json({ message: 'Request not found' });
    }
    await makeUser(request.idUser, res);
    handleResponse(res, Request.findByIdAndUpdate(id, { status: 'Pending' }, { new: true }));
}
