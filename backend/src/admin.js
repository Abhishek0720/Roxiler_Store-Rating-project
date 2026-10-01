const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const { auth, allow } = require('./middleware');
const { validateUser } = require('./validation');

const router = express.Router();
router.use(auth, allow('SYSTEM_ADMIN'));

router.get('/dashboard', async (req, res) => {
  const [[users]] = await pool.query('SELECT COUNT(*) total FROM users');
  const [[stores]] = await pool.query('SELECT COUNT(*) total FROM stores');
  const [[ratings]] = await pool.query('SELECT COUNT(*) total FROM ratings');
  res.json({ users: users.total, stores: stores.total, ratings: ratings.total });
});

router.get('/users', async (req, res) => {
  const { name='', email='', address='', role='', sort='name', order='asc' } = req.query;
  const allowedSort = { name:'u.name', email:'u.email', address:'u.address', role:'u.role' };
  const sortSql = allowedSort[sort] || 'u.name';
  const orderSql = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  const [rows] = await pool.query(
    `SELECT u.id,u.name,u.email,u.address,u.role,
      CASE WHEN u.role='STORE_OWNER' THEN ROUND(AVG(r.rating),2) ELSE NULL END rating
     FROM users u LEFT JOIN stores s ON s.owner_id=u.id LEFT JOIN ratings r ON r.store_id=s.id
     WHERE u.name LIKE ? AND u.email LIKE ? AND u.address LIKE ? AND u.role LIKE ?
     GROUP BY u.id ORDER BY ${sortSql} ${orderSql}`,
    [`%${name}%`,`%${email}%`,`%${address}%`,`%${role}%`]
  );
  res.json(rows);
});

router.post('/users', async (req,res)=>{
  const {name,email,address,password,role} = req.body;
  if (!['SYSTEM_ADMIN','NORMAL_USER','STORE_OWNER'].includes(role)) return res.status(400).json({message:'Invalid role'});
  const errors=validateUser({name,email,address,password});
  if(Object.keys(errors).length) return res.status(400).json({message:'Validation failed',errors});
  try {
    const hash=await bcrypt.hash(password,10);
    const [r]=await pool.query('INSERT INTO users(name,email,password_hash,address,role) VALUES(?,?,?,?,?)',
      [name.trim(),email.trim().toLowerCase(),hash,address.trim(),role]);
    res.status(201).json({id:r.insertId,message:'User created'});
  } catch(e) { res.status(409).json({message:'Could not create user; email may already exist'}); }
});

router.get('/users/:id', async(req,res)=>{
  const [rows]=await pool.query(
    `SELECT u.id,u.name,u.email,u.address,u.role,
     CASE WHEN u.role='STORE_OWNER' THEN ROUND(AVG(r.rating),2) ELSE NULL END rating
     FROM users u LEFT JOIN stores s ON s.owner_id=u.id LEFT JOIN ratings r ON r.store_id=s.id
     WHERE u.id=? GROUP BY u.id`, [req.params.id]);
  if(!rows.length) return res.status(404).json({message:'User not found'});
  res.json(rows[0]);
});

router.get('/stores', async(req,res)=>{
  const {name='',email='',address='',sort='name',order='asc'}=req.query;
  const allowed={name:'s.name',email:'s.email',address:'s.address'};
  const sortSql=allowed[sort]||'s.name';
  const orderSql=order.toLowerCase()==='desc'?'DESC':'ASC';
  const [rows]=await pool.query(
    `SELECT s.id,s.name,s.email,s.address,ROUND(AVG(r.rating),2) rating
     FROM stores s LEFT JOIN ratings r ON r.store_id=s.id
     WHERE s.name LIKE ? AND s.email LIKE ? AND s.address LIKE ?
     GROUP BY s.id ORDER BY ${sortSql} ${orderSql}`,
    [`%${name}%`,`%${email}%`,`%${address}%`]);
  res.json(rows);
});

router.post('/stores', async(req,res)=>{
  const {name,email,address,ownerId}=req.body;
  if(!name || name.length<20 || name.length>60 || !address || address.length>400 ||
     !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email||'')) {
    return res.status(400).json({message:'Invalid store details. Name 20-60 chars, address max 400 chars, valid email required.'});
  }
  const [owner]=await pool.query("SELECT id FROM users WHERE id=? AND role='STORE_OWNER'",[ownerId]);
  if(!owner.length) return res.status(400).json({message:'A valid Store Owner is required'});
  const [r]=await pool.query('INSERT INTO stores(name,email,address,owner_id) VALUES(?,?,?,?)',[name,email,address,ownerId]);
  res.status(201).json({id:r.insertId,message:'Store created'});
});

module.exports=router;
