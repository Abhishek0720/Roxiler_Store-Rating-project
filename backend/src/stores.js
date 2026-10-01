const express=require('express');
const pool=require('./db');
const {auth,allow}=require('./middleware');
const router=express.Router();

router.get('/',auth,async(req,res)=>{
  const {name='',address='',sort='name',order='asc'}=req.query;
  const allowed={name:'s.name',address:'s.address',rating:'rating'};
  const sortSql=allowed[sort]||'s.name';
  const orderSql=order.toLowerCase()==='desc'?'DESC':'ASC';
  const [rows]=await pool.query(
    `SELECT s.id,s.name,s.address,ROUND(AVG(r.rating),2) overall_rating,
      MAX(CASE WHEN r.user_id=? THEN r.rating END) user_rating
     FROM stores s LEFT JOIN ratings r ON r.store_id=s.id
     WHERE s.name LIKE ? AND s.address LIKE ?
     GROUP BY s.id ORDER BY ${sortSql} ${orderSql}`,
    [req.user.id,`%${name}%`,`%${address}%`]);
  res.json(rows);
});

router.get('/:id',auth,async(req,res)=>{
  const [rows]=await pool.query(
    `SELECT s.id,s.name,s.email,s.address,ROUND(AVG(r.rating),2) overall_rating,
     MAX(CASE WHEN r.user_id=? THEN r.rating END) user_rating
     FROM stores s LEFT JOIN ratings r ON r.store_id=s.id
     WHERE s.id=? GROUP BY s.id`,[req.user.id,req.params.id]);
  if(!rows.length) return res.status(404).json({message:'Store not found'});
  res.json(rows[0]);
});

async function rate(req,res,update=false){
  const rating=Number(req.body.rating);
  if(!Number.isInteger(rating)||rating<1||rating>5) return res.status(400).json({message:'Rating must be an integer from 1 to 5'});
  try {
    if(update){
      const [r]=await pool.query('UPDATE ratings SET rating=? WHERE store_id=? AND user_id=?',[rating,req.params.id,req.user.id]);
      if(!r.affectedRows) return res.status(404).json({message:'You have not rated this store yet'});
    } else {
      await pool.query('INSERT INTO ratings(store_id,user_id,rating) VALUES(?,?,?)',[req.params.id,req.user.id,rating]);
    }
    res.json({message:update?'Rating updated':'Rating submitted'});
  } catch(e) {
    if(e.code==='ER_DUP_ENTRY') return res.status(409).json({message:'You already rated this store. Use update.'});
    res.status(500).json({message:'Could not save rating'});
  }
}
router.post('/:id/rating',auth,allow('NORMAL_USER'),(req,res)=>rate(req,res,false));
router.put('/:id/rating',auth,allow('NORMAL_USER'),(req,res)=>rate(req,res,true));

module.exports=router;
