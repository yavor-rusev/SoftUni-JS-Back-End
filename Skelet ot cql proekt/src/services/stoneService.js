const { StoneModel } = require('../models/Stone');

// TODO add/rename/remove functions and imports depending on exam description

async function createStone(data, authorId){

    // TODO add/change props depending on exam description

    const record = new StoneModel({
        name: data.name,
        category: data.category,
        color: data.color,
        image: data.image,
        location: data.location,
        formula: data.formula,
        description: data.description,
        owner: authorId
    });

    await record.save();

    return record;
} 

async function getAll() {
    const allPlainRecords = await StoneModel.find().lean();
    return allPlainRecords;    
}


async function getRecent() {
    const lastThreePlainRecords = await StoneModel.find()
        .sort({$natural: -1}) // <$natural> -> in order of creation, -1 -> descending
        .limit(3) //Takes first three records
        .lean()
    ;

    return lastThreePlainRecords;    
}

// TODO rename params depending on exam description

async function getById(stoneId){
    const plainStone = await StoneModel.findById(stoneId).lean();

    if(!plainStone) {
        throw new Error('Record not found ' + stoneId);
    }   

    return plainStone;
}

// TODO rename params depending on exam description

async function editById(stoneId, userId, newData){
    const stone = await StoneModel.findById(stoneId);

    if(!stone) {
        throw new Error('Record not found ' + stoneId);
    }

    if(stone.owner.toString() != userId) {
        throw new Error('Access denied');
    }

    // TODO add/change props depending on exam description
    
    stone.name = newData.name;
    stone.category = newData.category;
    stone.color = newData.color;
    stone.image = newData.image;
    stone.location = newData.location;
    stone.formula = newData.formula;
    stone.description = newData.description;    

    await stone.save();
        
    return stone;
}

// TODO rename params depending on exam description

async function deleteById(stoneId, userId) {
    const stone = await StoneModel.findById(stoneId);

    if(!stone) {
        throw new Error('Record not found ' + stoneId);
    }

    if(stone.owner.toString() != userId) {
        throw new Error('Access denied');
    }

    await stone.deleteOne(); 
}

// TODO rename params depending on exam description

async function like(stoneId, userId) {
    const stone = await StoneModel.findById(stoneId);

    if(!stone) {
        throw new Error('Record not found ' + stoneId);
    }

    if(stone.owner.toString() == userId) {
        throw new Error('Access denied');
    }

    //TODO change logic depending on exam description

    const alreadyLiked = stone.likedList.find(l => l.toString() == userId);

    if(alreadyLiked) {
        return;
    }
    
    stone.likedList.push(userId);
    await stone.save();

    return stone;    
}

//TODO add async function searchItems(query){...}

module.exports = {
    createStone,
    getAll,
    getRecent,
    getById,
    editById,
    deleteById,
    like
};