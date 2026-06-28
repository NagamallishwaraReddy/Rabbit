const mongoose=require("mongoose");
const dotenv=require("dotenv");
const Product=require("./models/Product");
const User=require("./models/User");
const Cart=require("./models/Cart");
const products=require("./data/products");
 


dotenv.config();


//connect to mongodb databade
mongoose.connect(process.env.MONGO_URI);



//function to seed data
const seedData =async()=>{
try{
    //clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    //Create adefault admin user
    const createdUser=await User.create({
    name:"Admin User",
    email:"admin@example.com",
    password:"123456",
    role:"Admin",
});
//Assign the default user ID to each product
const userID=createdUser._id;


const sampleProducts=products.map((product)=>
{
    return{...product, user: userID};
});

//Indert the products in the database
await Product.insertMany(sampleProducts);
console.log("Products data seeded successfully");
process.exit();
}catch (error) {
    console.error("Error seeding the data:", error);
    process.exit(1);
}
};
seedData();
