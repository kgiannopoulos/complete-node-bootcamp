const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal to 40 characters'],
    minlength: [10, 'A tour name must have minimum 10 characters']
    // validate: [validator.isAlpha,'tour name must only contain characters']
  },
  slug: String,
  duration: {
    type: Number,
  required: [true, 'A tour must have a duration'],
},
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have a group size'],
  },
  difficulty : {
    type: String,
    required: [true, 'a tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium or difficult'
     }
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'must be below 5.0']
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },

  priceDiscount: {
    type:Number,
    validate: {

      validator: function(val) {
        return val < this.price;
      },
      message: 'Discount price ({VALUE})should be below reqular price'
    }
  },

  summary: {
    type: String,
    trim: true,
    required: [true, 'a tour must have a summary']
  },

  description: {
    type: String,
    trim: true
  },

  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },

  images: String,

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },

  startDates: [Date],

  secretTour: {
    type: Boolean,
    default: false,
  }


},
  {
  toObject: { virtuals: true  },
    toJSON: {  virtuals: true }
  }
);



tourSchema.virtual('durationWeeks').get(function()  {
  return this.duration / 7;
});

//document middleware: runs before .save() and .create() not others
tourSchema.pre('save', function(next) {
this.slug = slugify(this.name, {lower:true});
next();
});


//Query middleware
//tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true} });
   this.start = Date.now();
    next();
  });

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds`);
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: {$ne: true} } });
  console.log(this.pipeline());
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;