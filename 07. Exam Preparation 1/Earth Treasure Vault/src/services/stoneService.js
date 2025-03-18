const { StoneModel } = require('../models/Stone');

async function createStone(data, authorId){
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

async function getById(stoneId){
    const plainStone = await StoneModel.findById(stoneId).lean();

    if(!plainStone) {
        throw new Error('Record not found ' + stoneId);
    }   

    return plainStone;
}

async function editById(stoneId, userId, newData){
    const stone = await StoneModel.findById(stoneId);

    if(!stone) {
        throw new Error('Record not found ' + stoneId);
    }

    if(stone.owner.toString() != userId) {
        throw new Error('Access denied');
    }
    
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

async function like(stoneId, userId) {
    const stone = await StoneModel.findById(stoneId);

    if(!stone) {
        throw new Error('Record not found ' + stoneId);
    }

    if(stone.owner.toString() == userId) {
        throw new Error('Access denied');
    }

    const alreadyLiked = stone.likedList.find(l => l.toString() == userId);

    if(alreadyLiked) {
        return;
    }
    
    stone.likedList.push(userId);
    await stone.save();

    return stone;    
}


module.exports = {
    createStone,
    getAll,
    getRecent,
    getById,
    editById,
    deleteById,
    like
};