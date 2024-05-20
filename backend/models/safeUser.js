/**
 * Since we user contains passoword hash, we need to create a safe user object so hash is not exposed
 */
import mongoose from 'mongoose';

const safeUserSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    roomids: [{type: String}]
});

const SafeUser = mongoose.model('SafeUser', safeUserSchema);
export default SafeUser;