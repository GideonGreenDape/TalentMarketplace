const Clients= require('express').Router();
const bcrypt= require('bcryptjs');
const connectDB = require('../mongoclient');
const {emailAndPasswordValidation,validate}= require('../formvalidators/createaccount')
const { 
    personalDetailsValidation, 
    companyDetailsValidation, 
    paymentDetailsValidation 
} = require('../formvalidators/clientvalidation');
const { ObjectId } = require('mongodb');
const { jobPostValidation } = require('../formvalidators/jobpostvalidation');



Clients.post('/api/createaccount', emailAndPasswordValidation(), validate, async (req, res) => {
    const { email, password } = req.body;
    let client;

    try {
        client = await connectDB();
        const collection = client.db('marketplace').collection('clients');

        // check for existing email
        const existingUser = await collection.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Hash password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // If no duplicate, create new user
        const newUser = await collection.insertOne({
            email,
            password: hashedPassword,
            createdAt: new Date()
        });

       // Create a new collection with user's email
       const db = client.db('marketplace');
       const freelancerdata = await db.createCollection(email);
       await freelancerdata.insertOne({
           details: email
       });


        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            userId: newUser.insertedId
        });

    }
    catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
});

Clients.post('/api/login',async (req,res) => {
    const {email,password}= req.body;
     let client;
        try {
            client = await connectDB();
            const collection = client.db('marketplace').collection('clients');
    
            // Check if freelancer exists
            const freelancer = await collection.findOne({ email });
    
            if (!freelancer) {
                return res.status(404).json({
                    success: false,
                    message: 'Freelancer not found'
                });
            }
    
            // Check if password matches
            const isMatch = await bcrypt.compare(password, freelancer.password);
    
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid password'
                });
            }
    
            res.status(200).json({
                success: true,
                message: 'Login successful'
            });
        }
     catch (error) {
        if (client) {
            await client.close();
        }
     }
});

Clients.post('/api/personal-details', personalDetailsValidation(), validate, async (req, res) => {
    const { email, firstName, lastName, phone, country, languages } = req.body;
    let client;

    try {
        client = await connectDB();
        const collection = client.db('marketplace').collection('clients');

        const updateResult = await collection.updateOne(
            { email },
            {
                $set: {
                    'profile.personal': {
                        firstName,
                        lastName,
                        phone,
                        country,
                        timezone,
                        languages: languages || [],
                        updatedAt: new Date()
                    }
                }
            }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Personal details updated successfully'
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    } finally {
        if (client) await client.close();
    }
});

Clients.post('/api/company-details', companyDetailsValidation(), validate, async (req, res) => {
    const { email, name, website, industry, size, description } = req.body;
    let client;

    try {
        client = await connectDB();
        const collection = client.db('marketplace').collection('clients');

        const updateResult = await collection.updateOne(
            { email },
            {
                $set: {
                    'profile.company': {
                        name,
                        website,
                        industry,
                        size,
                        description,
                        updatedAt: new Date()
                    }
                }
            }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Company details updated successfully'
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    } finally {
        if (client) await client.close();
    }
});

Clients.post('/api/payment-details', paymentDetailsValidation(), validate, async (req, res) => {
    const { email, currency, preferredPaymentMethod, billingAddress } = req.body;
    let client;

    try {
        client = await connectDB();
        const collection = client.db('marketplace').collection('clients');

        const updateResult = await collection.updateOne(
            { email },
            {
                $set: {
                    'profile.payment': {
                        currency,
                        preferredPaymentMethod,
                        billingAddress,
                        updatedAt: new Date()
                    }
                }
            }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Payment details updated successfully'
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    } finally {
        if (client) await client.close();
    }
});

Clients.post('/api/post-job', jobPostValidation(), validate, async (req, res) => {
    const { email, job } = req.body;
    let client;

    try {
        client = await connectDB();
        const db = client.db('marketplace');

        // Check if client exists
        const clientsCollection = db.collection('clients');
        const clientExists = await clientsCollection.findOne({ email });

        if (!clientExists) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Create job ID and job document
        const jobId = new ObjectId();
        const jobDocument = {
            _id: jobId,
            title: job.title,
            description: job.description,
            requiredSkills: job.requiredSkills,
            amount: job.amount,
            clientEmail: email,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // 1. Add job to jobs collection
        const jobsCollection = db.collection('jobpostings');
        await jobsCollection.insertOne(jobDocument);

        // 2. Add job reference to client's collection
        const clientJobsCollection = db.collection(email);
        await clientJobsCollection.insertOne({
            jobId,
            title: job.title,
            status: 'active',
            createdAt: new Date()
        });

        // 3. Create entry in job proposals collection
        const proposalsCollection = db.collection('jobproposals');
        await proposalsCollection.insertOne({
            jobId,
            applications: [],
            createdAt: new Date()
        });

        res.status(201).json({
            success: true,
            message: 'Job posted successfully',
            jobId: jobId
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
});

Clients.get('/api/job-status-update', async (req, res) => {
    const { jobId } = req.query;
    let client;

    try {
        // Validate jobId
        if (!jobId || !ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: 'Valid job ID is required'
            });
        }

        client = await connectDB();
        const db = client.db('marketplace');
        
        // Get job proposals
        const proposalsCollection = db.collection('jobproposals');
        const jobProposals = await proposalsCollection.findOne(
            { jobId: new ObjectId(jobId) }
        );

        if (!jobProposals) {
            return res.status(404).json({
                success: false,
                message: 'No proposals found for this job'
            });
        }

        // Get job details for context
        const jobsCollection = db.collection('jobpostings');
        const jobDetails = await jobsCollection.findOne(
            { _id: new ObjectId(jobId) }
        );

        res.status(200).json({
            success: true,
            jobDetails: {
                title: jobDetails.title,
                status: jobDetails.status,
                postedAt: jobDetails.createdAt
            },
            applications: jobProposals.applications.map(app => ({
                freelancerEmail: app.freelancerEmail,
                proposal: app.proposal,
                appliedAt: app.appliedAt,
                status: app.status
            })),
            totalApplications: jobProposals.applications.length
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
});

Clients.post('/api/award-job', async (req, res) => {
    const { jobId, freelancerEmail } = req.body;
    let client;

    try {
        // Validate inputs
        if (!jobId || !ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: 'Valid job ID is required'
            });
        }

        if (!freelancerEmail) {
            return res.status(400).json({
                success: false,
                message: 'Freelancer email is required'
            });
        }

        client = await connectDB();
        const db = client.db('marketplace');

        // 1. Update job posting status
        const jobsCollection = db.collection('jobpostings');
        const job = await jobsCollection.findOneAndUpdate(
            { _id: new ObjectId(jobId) },
            { 
                $set: { 
                    status: 'inactive',
                    awardedTo: freelancerEmail,
                    awardedAt: new Date(),
                    updatedAt: new Date()
                } 
            },
            { returnDocument: 'after' }
        );

        if (!job.value) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // 2. Update job proposals collection
        const proposalsCollection = db.collection('jobproposals');
        await proposalsCollection.updateOne(
            { jobId: new ObjectId(jobId) },
            {
                $set: {
                    status: 'awarded',
                    awardedTo: freelancerEmail,
                    awardedAt: new Date(),
                    'applications.$[].status': 'rejected' // Set all applications to rejected first
                }
            }
        );

        // Then update the winning freelancer's application
        await proposalsCollection.updateOne(
            { 
                jobId: new ObjectId(jobId),
                'applications.freelancerEmail': freelancerEmail 
            },
            {
                $set: {
                    'applications.$.status': 'awarded'
                }
            }
        );

        // 3. Update client's job collection
        const clientJobsCollection = db.collection(job.value.clientEmail);
        await clientJobsCollection.updateOne(
            { jobId: new ObjectId(jobId) },
            {
                $set: {
                    status: 'awarded',
                    awardedTo: freelancerEmail,
                    awardedAt: new Date()
                }
            }
        );

        // 4. Add job to freelancer's collection
        const freelancerCollection = db.collection(freelancerEmail);
        await freelancerCollection.insertOne({
            type: 'awarded_job',
            jobId: new ObjectId(jobId),
            jobTitle: job.value.title,
            amount: job.value.amount,
            clientEmail: job.value.clientEmail,
            awardedAt: new Date(),
            status: 'active'
        });

        res.status(200).json({
            success: true,
            message: 'Job awarded successfully',
            awardedTo: freelancerEmail
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
});

module.exports= Clients;