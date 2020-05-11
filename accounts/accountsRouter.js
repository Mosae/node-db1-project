const express = require('express');
//database access usin knex
const db = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
	//get list of all accounts from database
	db.select('*')
		.from('accounts')
		.then((accounts) => {
			res.status(200).json({ data: accounts });
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
});

router.get('/:id', (req, res) => {
	db('accounts')
		.where({ id: req.params.id })
		.then((account) => {
			res.status(200).json(account);
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
});

// router.put();
// router.delete();
module.exports = router;
