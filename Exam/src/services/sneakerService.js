const { SneakerModel } = require('../models/Sneaker');


async function create(data, authorId){ 

    const record = new SneakerModel({
        brand: data.brand,
        model: data.model,
        price: data.price,
        condition: data.condition,
        year: data.year,
        size: data.size,
        image: data.image,
        description: data.description,    
        owner: authorId
    });

    await record.save();

    return record;
} 

async function getAll() {
    const allPlainRecords = await SneakerModel.find().lean();
    return allPlainRecords;    
}


async function getRecent() {
    const lastThreePlainRecords = await SneakerModel.find()
        .sort({$natural: -1}) 
        .limit(3) 
        .lean()
    ;

    console.log(lastThreePlainRecords);    

    return lastThreePlainRecords;    
}



async function getById(sneakerId){
    const plainSneaker = await SneakerModel.findById(sneakerId).lean();

    if(!plainSneaker) {
        throw new Error('Record not found ' + sneakerId);
    }   

    return plainSneaker;
}



async function editById(sneakerId, userId, newData){
    const sneaker = await SneakerModel.findById(sneakerId);

    if(!sneaker) {
        throw new Error('Record not found ' + sneakerId);
    }

    if(sneaker.owner.toString() != userId) {
        throw new Error('Access denied');
    }    
    
    sneaker.brand = newData.brand;
    sneaker.model = newData.model;
    sneaker.price = newData.price;
    sneaker.condition = newData.condition;
    sneaker.year = newData.year;
    sneaker.size = newData.size;
    sneaker.image = newData.image;     
    sneaker.description = newData.description;  

    await sneaker.save();
        
    return sneaker;
}


async function deleteById(sneakerId, userId) {
    const sneaker = await SneakerModel.findById(sneakerId);

    if(!sneaker) {
        throw new Error('Record not found ' + sneakerId);
    }

    if(sneaker.owner.toString() != userId) {
        throw new Error('Access denied');
    }

    await sneaker.deleteOne(); 
}


async function prefer(sneakerId, userId) {
    const sneaker = await SneakerModel.findById(sneakerId);

    if(!sneaker) {
        throw new Error('Record not found ' + sneakerId);
    }

    if(sneaker.owner.toString() == userId) {
        throw new Error('Access denied');
    }   

    const alreadyPreferred = sneaker.preferredList.find(user => user.toString() == userId);

    if(alreadyPreferred) {
        return;
    }
    
    sneaker.preferredList.push(userId);
    await sneaker.save();

    return sneaker;    
}

async function getMyRecords(userId) {
    const myPlainRecords = await SneakerModel.find({owner: userId}).lean();
    console.log('my records ->', myPlainRecords);
    
    return myPlainRecords;    
}

async function getPreferred(userId) {
    const preferredRecords = await SneakerModel.find( {preferredList: { $in: [userId] }}).lean();
    console.log('prefered records ->', preferredRecords);
    
    return preferredRecords;    
}




module.exports = {
    create,
    getAll,
    getRecent,
    getById,
    editById,
    deleteById,
    prefer,
    getMyRecords,
    getPreferred
};