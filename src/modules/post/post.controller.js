import Post from "./post.model.js";
import { isToken } from "../../helpers/tk-methods.js";
import { handleResponse } from "../../helpers/handle-resp.js";  
import { validateUserRequest } from "../../helpers/controller-checks.js";
import { logger } from "../../helpers/logger.js";
const log = logger.child({path: 'post/post.controller.js'});

export const createPost = async (req, res) => {
    log.info('Start creating post');
    const { idCommunity, title, content, anonymous, category, file } = req.body;
    const info = await validateUserRequest(req, res);
    anonymous == true ?
        handleResponse(res, Post.create({ idCommunity, title, content, anonymous, category, file }))
        :
        handleResponse(res, Post.create({ idUser: info.id, idCommunity, title, content, anonymous, category, file }))
}

export const getMyPost = async (req, res) => {
    log.info('Start getting my post');
    await validateUserRequest(req, res);
    const user = await isToken(req, res);
    handleResponse(res, Post.find({ status: true, idUser: user._id }));
}

export const getPostByCommunity = async (req, res) => {
    log.info('Start getting post by community');
    await validateUserRequest(req, res);
    const user = await isToken(req, res);
    handleResponse(res, Post.find({ status: true, idCommunity: user.idCommunity }));
}

export const updatePost = async (req, res) => {
    log.info('Start updating post');
    const { id } = req.params;
    const { title, content, category } = req.body;
    await validateUserRequest(req, res);
    const newData = { title, content, category };
    handleResponse(res, Post.findOneAndUpdate({ _id: id, status: true }, { $set: newData }, { new: true }));
};
export const deletePost = async (req, res) => {
    log.info('Start deleting post');
    const { id } = req.params;
    await validateUserRequest(req, res);
    handleResponse(res, Post.findByIdAndUpdate(id, { status: false }, { new: true }));
};