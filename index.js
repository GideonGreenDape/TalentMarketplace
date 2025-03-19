const express= require('express');
const Freelancer= require('./router/freelancer');
const Clients= require('./router/client');


const app= express();

// Add JSON middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//Routes
app.use('/client',Clients);
app.use('/freelancer/', Freelancer);



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});