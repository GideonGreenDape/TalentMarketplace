const Freelancer = require('express').Router();
const { emailAndPasswordValidation, validate } = require('../formvalidators/createaccount');
const { skillsValidationRules } = require('../formvalidators/skillvalidation');
const connectDB = require('../mongoclient');
const bcrypt = require('bcryptjs');
const { editProfileValidationRules } = require('../formvalidators/editprofilevalidation');
const projectValidationRules = require('../formvalidators/projectvalidation');
const {jobApplicationValidation} = require('../formvalidators/jobapplicationvalidation');
const emailService= require('../emaildirectory/emailutility');
const { ObjectId } = require('mongodb');


Freelancer.get('/api/', async (req, res) => {
    try {
        const mongoclient = await connectDB();
        if (mongoclient) {
            console.log('successfully connected to mongodb database.');

        }
    } catch (error) {

    }
    res.send('welcome to MyDreamConnect Talent marketplace');
});


Freelancer.post('/api/createaccount', emailAndPasswordValidation(), validate, async (req, res) => {
    const { email, password } = req.body;
    let client;

    try {
        client = await connectDB();
        const collection = client.db('marketplace').collection('Freelancer');

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
        })

         // Send welcome email
         try {
            await emailService.sendWelcomeEmail(email, 'Freelancer');
        } catch (emailError) {
            console.error('Welcome email failed:', emailError);
            // Don't return error - account was still created successfully
        }

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


Freelancer.post('/api/validation', async (req, res) => {
    const { firstname, lastname, middlename, DOB, city, phone,
        state, address, email
    } = req.body

    let client;
    try {
        client = await connectDB();
        const collection = client.db('marketplace').collection('Freelancer');

        // Check if freelancer exists
        const freelancer = await collection.findOne({ email });

        if (!freelancer) {
            return res.status(404).json({
                success: false,
                message: 'Freelancer not found'
            });
        }

        // Update freelancer profile
        const updateResult = await collection.updateOne(
            { email },
            {
                $set: {
                    firstname,
                    lastname,
                    middlename,
                    DOB: new Date(DOB),
                    city,
                    phone,
                    state,
                    address,
                    profileUpdatedAt: new Date()
                }
            }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(400).json({
                success: false,
                message: 'Failed to update profile'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully'
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
})


Freelancer.post('/api/addskills', skillsValidationRules(), validate, async (req, res) => {
    const { email, skills, skillNames, hourlyRate, isAvailable } = req.body;

    let client;

    try {
        client = await connectDB();
        const collection = client.db('marketplace').collection('Freelancer');

        // Check if freelancer exists
        const freelancer = await collection.findOne({ email });

        if (!freelancer) {
            return res.status(404).json({
                success: false,
                message: 'Freelancer not found'
            });
        }

        // Update freelancer profile with skills
        const updateResult = await collection.updateOne(
            { email },
            {
                $set: {
                    skills,
                    skillNames,
                    hourlyRate,
                    isAvailable,
                    updatedAt: new Date()
                }
            }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(400).json({
                success: false,
                message: 'Failed to update skills'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Skills updated successfully'
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
})


Freelancer.post('/api/editprofile', editProfileValidationRules(), validate, async (req, res) => {
    const { email, updates } = req.body;
    let client;

    try {
        client = await connectDB();
        const collection = client.db('marketplace').collection('Freelancer');

        // Check if freelancer exists
        const freelancer = await collection.findOne({ email });

        if (!freelancer) {
            return res.status(404).json({
                success: false,
                message: 'Freelancer not found'
            });
        }

        // Remove any undefined or null values from updates
        Object.keys(updates).forEach(key => {
            if (updates[key] === undefined || updates[key] === null) {
                delete updates[key];
            }
        });

        // Add last update timestamp
        updates.lastUpdated = new Date();

        // Update freelancer profile
        const updateResult = await collection.updateOne(
            { email },
            { $set: updates }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(400).json({
                success: false,
                message: 'No changes made to profile'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully'
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


Freelancer.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    let client;
    try {
        client = await connectDB();
        const collection = client.db('marketplace').collection('Freelancer');

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


Freelancer.post('/api/projects', projectValidationRules(), validate, async (req, res) => {
    const { email, project } = req.body;
    let client;

    try {
        client = await connectDB();
        const collection = client.db('marketplace').collection(email);

        // Create new project document
        const newProject = {
            projectId: new ObjectId(),
            title: project.title,
            description: project.description,
            category: project.category,
            skillsUsed: project.skillsUsed,
            duration: {
                startDate: new Date(project.duration.startDate),
                endDate: project.duration.endDate ? new Date(project.duration.endDate) : null,
                totalHours: project.duration.totalHours
            },
            links: project.links || [], // Portfolio, GitHub, Live demo links
            client: project.client || {
                name: 'Anonymous',
                location: 'Undisclosed'
            },
            outcomes: project.outcomes || [],
            status: project.status || 'completed',
            visibility: project.visibility || 'public',
            createdAt: new Date()
        };

        // Insert the new project as a document
        const result = await collection.insertOne(newProject);

        if (!result.insertedId) {
            return res.status(400).json({
                success: false,
                message: 'Failed to add project'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Project added successfully',
            projectId: result.insertedId
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


Freelancer.get('/api/recent-job-updates', async (req, res) => {
    const { email } = req.query;
    let client;

    try {
        client = await connectDB();
        const db = client.db('marketplace');

        // 1. Get freelancer's skills from Freelancer collection
        const freelancerCollection = db.collection('Freelancer');
        const freelancer = await freelancerCollection.findOne(
            { email },
            { projection: { skillNames: 1 } }
        );

        if (!freelancer) {
            return res.status(404).json({
                success: false,
                message: 'Freelancer not found'
            });
        }

        if (!freelancer.skillNames || freelancer.skillNames.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No skills found for freelancer'
            });
        }

        // 2. Find matching jobs from jobPostings collection
        const jobsCollection = db.collection('jobpostings');
        const matchingJobs = await jobsCollection.find({
            requiredSkills: { 
                $in: freelancer.skillNames 
            },
            status: 'active'  // Only fetch active jobs
        })
        .sort({ createdAt: -1 }) // Most recent first
        .limit(10)              // Limit to 10 recent jobs
        .toArray();

        // 3. Return matched jobs
        res.status(200).json({
            success: true,
            matchedJobCount: matchingJobs.length,
            jobs: matchingJobs.map(job => ({
                jobId: job._id,
                title: job.title,
                description: job.description,
                requiredSkills: job.requiredSkills,
                amount: job.amount,
                status: job.status,
                matchedSkills: job.requiredSkills.filter(skill => 
                    freelancer.skillNames.includes(skill)
                ),
                postedAt: job.createdAt,
                clientEmail: job.clientEmail
            }))
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

Freelancer.post('/api/apply-to-jobs', jobApplicationValidation(), validate, async (req, res) => {
    const { email, jobId, proposal } = req.body;
    let client;

    try {
        client = await connectDB();
        const db = client.db('marketplace');

        // 1. Get job details to verify it exists and get client email
        const jobsCollection = db.collection('jobPostings');
        const job = await jobsCollection.findOne({ _id: new ObjectId(jobId) });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // 2. Add application to freelancer's collection
        const freelancerCollection = db.collection(email);
        const applicationDoc = {
            jobId: new ObjectId(jobId),
            jobTitle: job.title,
            proposal,
            appliedAt: new Date(),
            status: 'pending'
        };

        await freelancerCollection.insertOne(applicationDoc);

        // 3. Add freelancer to job proposals collection
        const proposalsCollection = db.collection('jobProposals');
        const proposalUpdate = await proposalsCollection.updateOne(
            { jobId: new ObjectId(jobId) },
            {
                $push: {
                    applications: {
                        freelancerEmail: email,
                        proposal,
                        appliedAt: new Date(),
                        status: 'pending'
                    }
                }
            }
        );

        if (proposalUpdate.modifiedCount === 0) {
            return res.status(400).json({
                success: false,
                message: 'Failed to submit proposal'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Job application submitted successfully'
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


Freelancer.get('/api/fetch-job', async (req, res) => {
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
        const jobsCollection = client.db('marketplace').collection('jobPostings');

        // Fetch job details
        const job = await jobsCollection.findOne({ 
            _id: new ObjectId(jobId)
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Return job details
        res.status(200).json({
            success: true,
            job: {
                jobId: job._id,
                title: job.title,
                description: job.description,
                requiredSkills: job.requiredSkills,
                amount: job.amount,
                status: job.status,
                clientEmail: job.clientEmail,
                createdAt: job.createdAt,
                updatedAt: job.updatedAt
            }
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



Freelancer.get('/api/check-job-award', async (req, res) => {
    const { email, jobId } = req.query;
    let client;

    try {
        // Validate inputs
        if (!jobId || !ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: 'Valid job ID is required'
            });
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        client = await connectDB();
        const db = client.db('marketplace');

        // Check job status in jobProposals collection
        const proposalsCollection = db.collection('jobproposals');
        const jobProposal = await proposalsCollection.findOne({
            jobId: new ObjectId(jobId),
            'applications.freelancerEmail': email
        });

        if (!jobProposal) {
            return res.status(404).json({
                success: false,
                message: 'No application found for this job'
            });
        }

        // Find the specific application
        const application = jobProposal.applications.find(
            app => app.freelancerEmail === email
        );

        // Get job details
        const jobsCollection = db.collection('jobpostings');
        const jobDetails = await jobsCollection.findOne({
            _id: new ObjectId(jobId)
        });

        res.status(200).json({
            success: true,
            isAwarded: application.status === 'awarded',
            application: {
                status: application.status,
                appliedAt: application.appliedAt,
                proposal: application.proposal
            },
            job: {
                title: jobDetails.title,
                amount: jobDetails.amount,
                status: jobDetails.status
            }
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


// The aim is to use express-session and redis server so that
// we can then use userId
// so when login is successfull the with the user id
// we can then have endpoint fetch profile, skill, editprofile data



module.exports = Freelancer;