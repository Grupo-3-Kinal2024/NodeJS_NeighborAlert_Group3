import Comment from './comment.model.js';
import { validateUser } from '../../helpers/data-methods.js';
import { isToken } from '../../helpers/tk-methods.js';

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
        const userData = validateUser(user._id);
        return (true, userData);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export const createComment = async (req, res) => {
    const { idPost, content, anonymous } = req.body;
    const info = await validateUserRequest(req, res);
    anonymous == true ? console.log("ES VERDADERO") : console.log("ES FALSO");
    anonymous == true ?
        handleResponse(res, Comment.create({ idPost, content, anonymous }))
        :
        handleResponse(res, Comment.create({ idUser: info.id, idPost, content, anonymous }))


}

export const getComments = async (req, res) => {
    console.log("Ingresa al controller")
    const { idPost } = req.params;
    console.log("Ingresa al controller: " + idPost)
    await validateUserRequest(req, res);
    handleResponse(res, Comment.find({ status: true, idPost: idPost }));
}

export const updateComment = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    await validateUserRequest(req, res);
    handleResponse(res, Comment.findByIdAndUpdate(id, { $set: { content: content } }, { new: true }));
}

export const deleteComment = async (req, res) => {
    const { id } = req.params;
    await validateUserRequest(req, res);
    handleResponse(res, Comment.findByIdAndUpdate(id, { status: false }, { new: true }));
};

