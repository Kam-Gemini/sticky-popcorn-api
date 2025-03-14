import mongoose from "mongoose";

// const responseSchema = new mongoose.Schema({
//     content: {
//         type: String,
//     },
    
//     author: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     }
// }, {
//     timestamps: true 
// })


const reviewSchema = new mongoose.Schema({

    content: {
        type: String,
        required: true
    },
    
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
      
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    }, 
    
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }]
},
    
//   reponses: [responseSchema] 
// }, 
{
    timestamps: true
})

reviewSchema.set('toJSON', {
    transform(doc, json){
      delete json.password
    }
  })

export default mongoose.model("Review", reviewSchema)