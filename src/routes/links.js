const express = require('express');
const router = express.Router();

const db = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const nl = { title, url, description } = req.body;
    const sql = 'INSERT INTO links (title, url, description, user_id) VALUES (?,?,?,?)';

    await db.run(sql, [nl.title, nl.url, nl.description, req.user.id], (err) => {
        req.flash('success', 'Link saved successfully.');
        res.redirect('/links');
    });
});

router.get('/', isLoggedIn, async (req, res) => {
    const sql = 'SELECT * FROM links WHERE user_id = ?';

    await db.all(sql, [req.user.id], (err, rows) => {
        res.render('links/list', { links: rows });
    });
});

router.get('/del/:id', isLoggedIn, async (req, res) => {
    const sql = 'DELETE FROM links WHERE id =?';

    await db.run(sql, [req.params.id], (err) => {
        req.flash('success', 'Link removed successfully.');
        res.redirect('/links');
    });
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const sql = 'SELECT * FROM links WHERE id =?';

    await db.get(sql, [req.params.id], (err, row) => {
        res.render('links/edit', { link: row });
    });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const dt = { title, url, description } = req.body;
    const sql = `UPDATE links SET 
                    title=COALESCE(?,title), 
                    url=COALESCE(?,url), 
                    description=COALESCE(?,description) 
                WHERE id = ?`;

    await db.run(sql, [dt.title, dt.url, dt.description, req.params.id], (err) => {
        req.flash('success', 'Link update successfully.');
        res.redirect('/links');
    });
});

module.exports = router;