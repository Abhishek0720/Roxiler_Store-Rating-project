require('dotenv').config();
const express=require('express');
const cors=require('cors');
const pool=require('./db');
const authRoutes=require('./auth');
const adminRoutes=require('./admin');
const storeRoutes=require('./stores');
const ownerRoutes=require('./owner');

const app=express();
app.use(cors({origin:'http://localhost:5173'}));
app.use(express.json());

app.get('/api/health',async(req,res)=>{
  try{await pool.query('SELECT 1');res.json({status:'ok'});}
  catch{res.status(500).json({status:'database unavailable'});}
});
app.use('/api/auth',authRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/stores',storeRoutes);
app.use('/api/owner',ownerRoutes);

app.use((err,req,res,next)=>{console.error(err);res.status(500).json({message:'Internal server error'});});

const port=process.env.PORT||5000;
app.listen(port,()=>console.log(`API running on http://localhost:${port}`));
