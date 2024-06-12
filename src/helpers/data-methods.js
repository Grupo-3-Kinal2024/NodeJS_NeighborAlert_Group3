import User from '../modules/user/user.model.js';
import Community from '../modules/community/community.model.js';
import zxcvbn from 'zxcvbn';

export const validateAnonymous = async (anonymous) => {
    if (!anonymous) { throw new Error('Anonymous is required') }
    if (typeof anonymous !== 'boolean') { throw new Error('Anonymous must be a boolean') }
    return anonymous;
}

export const validateUser = async (id) => {
    const user = await User.findById(id);
    if (!user) { throw new Error('User not found') }
    if (!user.status) { throw new Error('User is not active') }
    const userData = { id: user.id, name: user.name, email: user.email, role: user.role };
    return userData;
}

export const validateAdmin = async (id) => {
    const user = await User.findById(id);
    if (!user) { throw new Error('User not found') }
    if (!user.status) { throw new Error('User is not active') }
    if (user.role !== 'ADMIN') { throw new Error('User is not an administrator') }
    const userData = { id: user.id, name: user.name, email: user.email, role: user.role };
    return userData;
}

export const validateCodeAccess = async (code) => {
    const community = await Community.findOne({ codeAccess: code });
    if (!community) { throw new Error('Community dont exists or code is incorrect') }
    if (!community.status) { throw new Error('Community is not active') }
    return community;
}

export const validateCommunity = async (id) => {
    const community = await Community.findById(id);
    if (!community) { throw new Error('Community not found') }
    if (!community.status) { throw new Error('Community is not active') }
    return community;
}

export const validateEmail = async (email) => {
    if (!email) { throw new Error('Email is required') }
    if (typeof email !== 'string') { throw new Error('Email must be a string') }
    if (!email.includes('@') || !email.includes('.')) { throw new Error('Email is not valid') }
    return email;
}

export const validateExistentEmail = async (email) => {
    const user = await User.findOne({ email });
    if (user) { throw new Error('Email already exists') }
    return email;
}

export const validatePassword = async (password) => {
    const result = zxcvbn(password);

    if (result.score < 2) {
        throw new Error(`The password is not safe enough.`);
    }
    if (password.length < 6) {
        throw new Error('The password must be at least 6 characters.');
    }
};