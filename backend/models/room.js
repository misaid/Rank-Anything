import mongoose from "mongoose";
/**
 * the schema for the room data
 */
const roomSchema = new mongoose.Schema({
    // name of the room
    roomname: {
        type: String,
        default: "",
        required: true,
        unique: true,
    },
    // list of words with their corresponding scores
    opinions: [{
        userId: {
          type: String,
          required: true,
        },
        opinions: {
            type: Map,
            of: Number,
            default: {},
        } }
        ],
    avgOpinion: {
        type: Map,
        of: Number,
        default: {},
    },
    // list of users in the room
    users: {
        type: Array,
        default: [],
    },
    // the default ranked list
    defaultRankedList: {
        type: Map,
        of: Number, default: {},
        required: false,
    }
    });
const Room = mongoose.model('Rooms', roomSchema);
export default Room;