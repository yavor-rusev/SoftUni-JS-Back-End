const { DataModel } = require('../models/Data');

// TODO add/remove functions and change names depending on exam description

async function create(data, authorId){

    // TODO add/change props depending on exam description

    const record = new DataModel({
        propName1: data.propName1,
        propName2: data.propName2,
        author: authorId
    });

    await record.save();

    return record;
} 

async function getAll() {
    const allPlainRecords = await DataModel.find().lean();
    return allPlainRecords;    
}


async function getRecent() {
    const lastThreePlainRecords = await DataModel.find()
        .sort({$natural: -1}) // <$natural> -> in order of creation, -1 -> descending
        .limit(3) //Takes first three records
        .lean()
    ;

    return lastThreePlainRecords;    
}

async function getById(recordId){
    const plainRecord = await DataModel.findById(recordId).lean();

    if(!plainRecord) {
        throw new Error('Record not found ' + recordId);
    }   

    return plainRecord;
}

async function editById(recordId, userId, newData){
    const record = await DataModel.findById(recordId);

    if(!record) {
        throw new Error('Record not found ' + recordId);
    }

    if(record.author.toString() != userId) {
        throw new Error('Access denied');
    }

    // TODO add/change props depending on exam description

    record.propName1 = newData.propName1;
    record.propName2 = newData.propName2;

    await record.save();

    return record;
}

async function deleteById(recordId, userId) {
    const record = await DataModel.findById(recordId);

    if(!record) {
        throw new Error('Record not found ' + recordId);
    }

    if(record.author.toString() != userId) {
        throw new Error('Access denied');
    }

    await record.deleteOne(); 
}


async function searchData(input1, input2, selectOption) {
    const query = {};

    //TODO change logic depending on exam description

    if(input1) {
        // new RegExp(string) -> returns '/<string>/i' regex for partial match. 'i' -> flag for case insensitive search
        query.name = new RegExp(input1, 'i');
    }

    if(input2) {
        query.category = new RegExp(input2, 'i');
    }

    if(selectOption != '---' && selectOption != '') {
        // new RegExp(`^${string}$`) -> returns '/^<string>$/i' regex for whole match. 'i' -> flag for case insensitive search
        query.location = new RegExp(`^${selectOption}$`, 'i');
    }

    // Passed conditions are property's regex values in the <query> object 
    const stones = await DataModel.find(query).lean(); 

    return stones;    
}

async function like(recordId, userId) {
    const record = await DataModel.findById(recordId);

    if(!record) {
        throw new Error('Record not found ' + recordId);
    }

    if(record.author.toString() == userId) {
        throw new Error('Access denied');
    }

    //TODO change logic depending on exam description

    const alreadyLiked = record.likes.find(l => l.toString() == userId);

    if(alreadyLiked) {
        return;
    }
    
    record.likes.push(userId);
    await record.save();

    return record;    
}


module.exports = {
    create,
    getAll,
    getRecent,
    getById,
    editById,
    deleteById,
    searchData,
    like
};