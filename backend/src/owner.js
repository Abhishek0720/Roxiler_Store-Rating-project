const express=require('express');
const pool=require('./db');
const {auth,allow}=require('./middleware');
const router=express.Router();
router.get('/dashboard',auth,allow('STORE_OWNER'),async(req,res)=>{
  const [stores]=await pool.query('SELECT id,name,address FROM stores WHERE owner_id=?',[req.user.id]);
  const result=[];
  for(const store of stores){
    const [[avg]]=await pool.query('SELECT ROUND(AVG(rating),2) average_rating, COUNT(*) total_ratings FROM ratings WHERE store_id=?',[store.id]);
    const [users]=await pool.query(
      `SELECT u.id,u.name,u.email,u.address,r.rating,r.updated_at
       FROM ratings r JOIN users u ON u.id=r.user_id WHERE r.store_id=? ORDER BY u.name ASC`,[store.id]);
    result.push({...store,...avg,users});
  }
  res.json(result);
});
module.exports=router;
