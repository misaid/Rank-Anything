import mongoose from "mongoose";

/**
 * The schema for the ranked list data
 */
const rankedListSchema = new mongoose.Schema({
    roomid: {
        type: String,
        required: false
    },
    words: {
        type: Map,
        of: Number, default: {},
        required: false
    }
});
const List = mongoose.model('RankedList', rankedListSchema);
export default List;