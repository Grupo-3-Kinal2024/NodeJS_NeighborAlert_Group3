import Community from './community.model.js';
import { validateAdmin } from '../../helpers/data-methods.js';
import { isToken } from '../../helpers/tk-methods.js';
import uniqid from 'uniqid';
import bycrypt from 'bcryptjs';

const handleResponse = (res, promise) => {
    promise
        .then(data => res.status(200).json(data))
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

const validateUserRequest = async (req, res) => {
    try {
        const user = await isToken(req, res);
        validateAdmin(user._id);
        return true;
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export const createCommunity = async (req, res) => {
    const { name, location, img, description } = req.body;
    //CREATION CODE
    var code;
    let existence = false;
    do {
        code = uniqid().slice(0, 8);
        //VERIFICATION CODE UNIQUE EXIST
        const codeExistence = await Community.find({ code });
        console.log(codeExistence);
        if (codeExistence.length > 0) {
            existence = true;
        }
    } while (existence);
    //END CREATION CODE - Save
    code = code.toUpperCase();
    await validateUserRequest(req, res);
    handleResponse(res, Community.create({ name, location, img, description, code }));
};

export const getCommunities = async (req, res) => {
    await validateUserRequest(req, res);
    handleResponse(res, Community.find({ status: true }));
};

export const getCommunity = async (req, res) => {
    const { id } = req.params;
    await validateUserRequest(req, res);
    handleResponse(res, Community.findById(id));
};

export const updateCommunity = async (req, res) => {
    const { id } = req.params;
    const { name, location, img } = req.body;
    await validateUserRequest(req, res);
    const newData = { name, location, img };
    // handleResponse(res, Community.findByIdAndUpdate(id, newData, { new: true }));
    handleResponse(res, Community.findOneAndUpdate({ _id: id, status: true }, { $set: newData }, { new: true }));
};

export const deleteCommunity = async (req, res) => {
    const { id } = req.params;
    await validateUserRequest(req, res);
    handleResponse(res, Community.findByIdAndUpdate(id, { status: false }, { new: true }));
};
